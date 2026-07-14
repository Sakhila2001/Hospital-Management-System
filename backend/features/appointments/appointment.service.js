import bcrypt from "bcrypt";
import crypto from "crypto";
import Appointment from "./appointment.model.js";
import Doctor from "../doctors/doctor.model.js";
import Patient from "../patients/patient.model.js";
import Receptionist from "../receptionists/receptionist.model.js";
import Department from "../departments/department.model.js";
import User from "../users/user.model.js";
import sequelize from "../../config/connection.js";
import { Op } from "sequelize";

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM (24-hour)

const validateAppointmentFields = ({
  appointmentDate,
  appointmentTime,
  status,
  cancelledReason,
}) => {
  if (appointmentDate && isNaN(Date.parse(appointmentDate))) {
    throw new Error("Invalid appointmentDate format. Use YYYY-MM-DD");
  }

  if (appointmentDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(appointmentDate) < today) {
      throw new Error("Appointment date cannot be in the past");
    }
  }

  if (appointmentTime && !TIME_REGEX.test(appointmentTime)) {
    throw new Error("Invalid appointmentTime format. Use HH:MM (24-hour)");
  }

  if (status && !VALID_STATUSES.includes(status)) {
    throw new Error(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if (status === "cancelled" && !cancelledReason?.trim()) {
    throw new Error(
      "cancelledReason is required when cancelling an appointment",
    );
  }
};

// Shared doctor-fit checks: availability, working day/hours, department match, no clash.
// Used both at creation time (receptionist booking with a doctor already picked)
// and in assignDoctorAndDepartmentService (receptionist assigning later).
const validateDoctorFitsAppointment = async ({
  doctorId,
  departmentId,
  appointmentDate,
  appointmentTime,
  excludeAppointmentId = null,
}) => {
  // doctorId from the frontend is actually the User.id (userId), not Doctor.id
  const doctor = await Doctor.findOne({
    where: { userId: doctorId },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
    ],
  });
  const doctorName = doctor
    ? `Dr. ${doctor.User?.firstName || ""} ${doctor.User?.lastName || ""}`.trim()
    : `Doctor (userId: ${doctorId})`;

  if (!doctor) {
    throw new Error(
      `${doctorName} was not found. They may not have a doctor profile yet. ` +
      `Please ask them to log in and complete their profile first.`
    );
  }

  if (!doctor.isAvailable) {
    throw new Error(
      `${doctorName} is currently marked as unavailable and cannot be assigned appointments.`
    );
  }

  if (doctor.availableDays?.length) {
    const dayName = new Date(appointmentDate).toLocaleDateString("en-US", {
      weekday: "short",
    });
    if (!doctor.availableDays.includes(dayName)) {
      throw new Error(
        `${doctorName} is not available on ${dayName}. ` +
        `Their available days are: ${doctor.availableDays.join(", ")}.`
      );
    }
  }

  if (doctor.availableTimeStart && doctor.availableTimeEnd) {
    if (
      appointmentTime < doctor.availableTimeStart ||
      appointmentTime > doctor.availableTimeEnd
    ) {
      throw new Error(
        `${doctorName} is only available between ${doctor.availableTimeStart} and ${doctor.availableTimeEnd}, ` +
        `but the appointment is at ${appointmentTime}.`
      );
    }
  }

  if (doctor.departmentId && doctor.departmentId !== departmentId) {
    const doctorDept = await Department.findByPk(doctor.departmentId);
    const targetDept = await Department.findByPk(departmentId);
    throw new Error(
      `${doctorName} belongs to the "${doctorDept?.name || "Unknown"}" department, ` +
      `but you are assigning to "${targetDept?.name || "Unknown"}". ` +
      `Please choose a doctor from the correct department.`
    );
  }

  const clashWhere = {
    doctorId: doctor.id,  // Use the Doctor table PK for appointment FK lookup
    appointmentDate,
    appointmentTime,
    status: { [Op.in]: ["pending", "confirmed"] },
  };
  if (excludeAppointmentId) {
    clashWhere.id = { [Op.ne]: excludeAppointmentId };
  }
  const clash = await Appointment.findOne({ where: clashWhere });
  if (clash) {
    throw new Error(
      `${doctorName} already has an appointment at ${appointmentTime} on ${appointmentDate}. ` +
      `Please choose a different time slot or another doctor.`
    );
  }

  return doctor;
};

//  Create Appointment (patient self-book OR receptionist books for patient OR public booking) ─
// Patients: submit only appointmentDate, appointmentTime, appointmentReason.
//           departmentId/doctorId are NOT accepted — a receptionist assigns
//           these afterwards via assignDoctorAndDepartmentService.
// Receptionists: must supply departmentId (routing decision); doctorId optional.
// Public: no auth — system creates a patient user + profile, then books appointment.

export const createAppointmentService = async (data, requester) => {
  const {
    patientId, // required when receptionist books; ignored when patient/public books
    doctorId,
    departmentId,
    appointmentDate,
    appointmentTime,
    appointmentReason,
    type,
    // Public booking fields
    firstName,
    lastName,
    email,
    phone,
    gender,
    dateOfBirth,
  } = data;

  // Resilient field-name aliases
  const finalAppointmentDate = appointmentDate || data.date;
  const finalAppointmentTime = appointmentTime || data.time;
  const finalAppointmentReason = appointmentReason || data.reason || "";
  const finalType = type || data.type || data.appointmentType || "consultation";

  let resolvedPatientId;
  let createdBy = null;

  if (!requester) {
    // Public booking — create patient user + profile on the fly
    if (!firstName || !lastName || !email || !phone || !gender || !dateOfBirth) {
      throw new Error(
        "firstName, lastName, email, phone, gender, and dateOfBirth are required for public booking",
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const existingUser = await User.findOne({
      where: { email, deletedAt: null },
    });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const randomPassword = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const result = await sequelize.transaction(async (t) => {
      const user = await User.create(
        {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          roles: "patient",
        },
        { transaction: t },
      );

      const patient = await Patient.create(
        {
          userId: user.id,
          phone,
          gender,
          dateOfBirth,
        },
        { transaction: t },
      );

      const appointment = await Appointment.create(
        {
          patientId: patient.id,
          doctorId: doctorId || null,
          departmentId: departmentId || null,
          type: finalType,
          appointmentDate: finalAppointmentDate,
          appointmentTime: finalAppointmentTime,
          appointmentReason: finalAppointmentReason || null,
          status: "pending",
        },
        { transaction: t },
      );

      return { appointment, user, patient };
    });

    return result;
  }

  const { roles, id: requesterId } = requester;

  if (roles === "patient") {
    const patientRecord = await Patient.findOne({
      where: { userId: requesterId },
    });
    if (!patientRecord) {
      throw new Error(
        "Patient profile not found. Please complete your profile first",
      );
    }
    resolvedPatientId = patientRecord.id;

    if (departmentId) {
      throw new Error(
        "Patients cannot select a department. Your appointment will be routed by our reception team.",
      );
    }
    if (doctorId) {
      throw new Error(
        "Patients cannot assign doctors. Doctors must be assigned by a receptionist.",
      );
    }
  } else if (roles === "receptionist") {
    if (!patientId) throw new Error("patientId is required");

    const patientRecord = await Patient.findOne({
      where: { userId: patientId },
    });
    if (!patientRecord) throw new Error("Patient not found");

    resolvedPatientId = patientRecord.id;

    if (!departmentId) {
      throw new Error("departmentId is required");
    }
  } else {
    throw new Error("Only patients and receptionists can create appointments");
  }

  if (!finalAppointmentDate || !finalAppointmentTime) {
    throw new Error("appointmentDate and appointmentTime are required");
  }

  validateAppointmentFields({
    appointmentDate: finalAppointmentDate,
    appointmentTime: finalAppointmentTime,
  });

  if (departmentId) {
    const department = await Department.findOne({
      where: { id: departmentId },
    });
    if (!department) throw new Error("Department not found");
    if (!department.isActive) throw new Error("Department is not active");
  }

  if (doctorId) {
    await validateDoctorFitsAppointment({
      doctorId,
      departmentId,
      appointmentDate: finalAppointmentDate,
      appointmentTime: finalAppointmentTime,
    });
  }

  if (roles === "receptionist") {
    const receptionistRecord = await Receptionist.findOne({
      where: { userId: requesterId },
    });
    if (!receptionistRecord) throw new Error("Receptionist profile not found");
    createdBy = receptionistRecord.id;
  }

  const appointment = await sequelize.transaction(async (t) => {
    return Appointment.create(
      {
        patientId: resolvedPatientId,
        doctorId: doctorId || null,
        departmentId: departmentId || null,
        type: finalType,
        appointmentDate: finalAppointmentDate,
        appointmentTime: finalAppointmentTime,
        appointmentReason: finalAppointmentReason || null,
        createdBy,
        status: "pending",
      },
      { transaction: t },
    );
  });

  return { appointment };
};

//  Public appointment booking (no auth required) ─

export const createPublicAppointmentService = async (data) => {
  return createAppointmentService(data, null);
};

//  Get all appointments (admin sees all; doctor/receptionist sees own; patient sees own) ─

export const getAllAppointmentsService = async (requester) => {
  const { roles, id: userId } = requester;

  let whereClause = {};

  if (roles === "patient") {
    const patient = await Patient.findOne({ where: { userId } });
    if (!patient) throw new Error("Patient profile not found");
    whereClause.patientId = patient.id;
  } else if (roles === "doctor") {
    const [doctor] = await Doctor.findOrCreate({
      where: { userId },
      defaults: { specialization: "General Practice" },
    });
    whereClause.doctorId = doctor.id;
  } else if (roles === "receptionist") {
    const [receptionist] = await Receptionist.findOrCreate({
      where: { userId },
      defaults: {},
    });
    // Receptionists need to see:
    //   1. ALL pending appointments (no department assigned yet — waiting for triage)
    //   2. Appointments already assigned to their department
    // If the receptionist has no department yet, show everything.
    if (receptionist.departmentId) {
      whereClause[Op.or] = [
        { status: "pending" },                          // all unassigned pending
        { departmentId: receptionist.departmentId },    // their department
      ];
    }
    // else: no filter → show all appointments
  }
  // admin: no whereClause filter — sees all

  const appointments = await Appointment.findAll({
    where: whereClause,
    include: [
      {
        model: Patient,
        attributes: [
          "id", "userId", "phone", "gender", "bloodGroup",
          "dateOfBirth", "allergies", "chronicConditions",
          "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation",
          "address", "city", "maritalStatus",
        ],
        include: [
          { model: User, attributes: ["id", "firstName", "lastName", "email"] },
        ],
      },
      {
        model: Doctor,
        include: [
          { model: User, attributes: ["id", "firstName", "lastName", "email"] },
        ],
      },
      { model: Department, attributes: ["id", "name"] },
      {
        model: Doctor,
        as: "ProposedDoctor",
        include: [
          { model: User, attributes: ["id", "firstName", "lastName"] },
        ],
      },
      {
        model: Department,
        as: "ProposedDepartment",
        attributes: ["id", "name"],
      },
    ],
    order: [
      ["appointmentDate", "ASC"],
      ["appointmentTime", "ASC"],
    ],
  });

  return { appointments };
};

// Get single appointment

export const getAppointmentByIdService = async (appointmentId, requester) => {
  const { roles, id: userId } = requester;

  const appointment = await Appointment.findByPk(appointmentId, {
    include: [
      {
        model: Patient,
        attributes: [
          "id", "userId", "phone", "gender", "bloodGroup",
          "dateOfBirth", "allergies", "chronicConditions",
          "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation",
          "address", "city", "maritalStatus",
        ],
        include: [
          { model: User, attributes: ["id", "firstName", "lastName", "email"] },
        ],
      },
      {
        model: Doctor,
        include: [
          { model: User, attributes: ["id", "firstName", "lastName", "email"] },
        ],
      },
      { model: Department, attributes: ["id", "name"] },
      {
        model: Doctor,
        as: "ProposedDoctor",
        include: [
          { model: User, attributes: ["id", "firstName", "lastName"] },
        ],
      },
      {
        model: Department,
        as: "ProposedDepartment",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!appointment) throw new Error("Appointment not found");

  // Scope check — non-admin roles can only see their own appointments
  if (roles === "patient") {
    const patient = await Patient.findOne({ where: { userId } });
    if (!patient || appointment.patientId !== patient.id) {
      throw new Error("Access denied");
    }
  } else if (roles === "doctor") {
    const doctor = await Doctor.findOne({ where: { userId } });
    if (!doctor || appointment.doctorId !== doctor.id) {
      throw new Error("Access denied");
    }
  } else if (roles === "receptionist") {
    const receptionist = await Receptionist.findOne({ where: { userId } });
    // check department match
    if (
      !receptionist ||
      appointment.departmentId !== receptionist.departmentId
    ) {
      throw new Error("Access denied");
    }
  }

  return { appointment };
};

//  Assign / reassign doctor + department (receptionist routing step) ─
// Used for appointments a patient self-booked without a department/doctor.
// Only pending appointments can be routed. A receptionist may only route
// appointments into their own department (or reassign within it).

export const assignDoctorAndDepartmentService = async (
  appointmentId,
  data,
  requester,
) => {
  const { roles, id: userId } = requester;
  const { doctorId, departmentId } = data;

  if (roles !== "receptionist" && roles !== "admin") {
    throw new Error(
      "Only receptionists or admins can assign a doctor and department",
    );
  }

  if (!doctorId && !departmentId) {
    throw new Error(
      "At least one of doctorId or departmentId must be provided",
    );
  }

  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  if (appointment.status !== "pending") {
    throw new Error(
      "Only pending appointments can be assigned a doctor or department",
    );
  }

  let receptionist = null;
  if (roles === "receptionist") {
    receptionist = await Receptionist.findOne({ where: { userId } });
    if (!receptionist) throw new Error("Receptionist profile not found");
  }

  const updateData = {};

  // Resolve which department this appointment will end up in
  const resolvedDepartmentId = departmentId || appointment.departmentId;
  if (!resolvedDepartmentId) {
    throw new Error("departmentId is required");
  }

  if (departmentId) {
    const department = await Department.findOne({
      where: { id: departmentId },
    });
    if (!department) throw new Error("Department not found");
    if (!department.isActive) throw new Error("Department is not active");

    // A receptionist can only route into their own department
    if (
      roles === "receptionist" &&
      receptionist.departmentId !== departmentId
    ) {
      throw new Error("Access denied: department mismatch");
    }

    updateData.departmentId = departmentId;
  } else if (
    roles === "receptionist" &&
    receptionist.departmentId !== appointment.departmentId
  ) {
    // No new departmentId given, but the appointment's existing department
    // isn't this receptionist's — block assigning a doctor into it
    throw new Error("Access denied");
  }

  if (doctorId) {
    const doctorObj = await validateDoctorFitsAppointment({
      doctorId,
      departmentId: resolvedDepartmentId,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      excludeAppointmentId: appointment.id,
    });
    updateData.doctorId = doctorObj.id;
  }

  await appointment.update(updateData);

  const updated = await Appointment.findByPk(appointmentId, {
    include: [
      {
        model: Patient,
        include: [
          { model: User, attributes: ["id", "firstName", "lastName", "email"] },
        ],
      },
      {
        model: Doctor,
        include: [
          { model: User, attributes: ["id", "firstName", "lastName", "email"] },
        ],
      },
      { model: Department, attributes: ["id", "name"] },
    ],
  });

  return { appointment: updated };
};

//  Update appointment status
// Rules:
//   patient     → can only cancel their own pending appointment
//   receptionist→ can confirm / cancel appointments they created
//   doctor      → can mark confirmed → completed / no_show
//   admin       → can do anything

export const updateAppointmentStatusService = async (
  appointmentId,
  data,
  requester,
) => {
  const { roles, id: userId } = requester;
  const { status, cancelledReason, doctorId } = data;

  if (!status) throw new Error("status is required");
  validateAppointmentFields({ status, cancelledReason });

  // Cancellation always requires a reason, regardless of who is cancelling
  if (status === "cancelled" && !cancelledReason?.trim()) {
    throw new Error("A cancellation reason is required");
  }

  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  //  Role-based permission matrix
  if (roles === "patient") {
    const patient = await Patient.findOne({ where: { userId } });
    if (!patient || appointment.patientId !== patient.id) {
      throw new Error("Access denied");
    }
    if (status !== "cancelled") {
      throw new Error("Patients can only cancel their appointments");
    }
    if (appointment.status !== "pending") {
      throw new Error("Only pending appointments can be cancelled");
    }
  } else if (roles === "receptionist") {
    const receptionist = await Receptionist.findOne({ where: { userId } });
    if (!receptionist) throw new Error("Receptionist profile not found");
    //  check department match instead of createdBy
    if (appointment.departmentId !== receptionist.departmentId) {
      throw new Error("Access denied");
    }
    if (!["confirmed", "cancelled"].includes(status)) {
      throw new Error("Receptionists can only confirm or cancel appointments");
    }
  } else if (roles === "doctor") {
    const doctor = await Doctor.findOne({ where: { userId } });
    if (!doctor || appointment.doctorId !== doctor.id) {
      throw new Error("Access denied");
    }
    if (!["completed", "no_show"].includes(status)) {
      throw new Error(
        "Doctors can only mark appointments as completed or no_show",
      );
    }
    if (appointment.status !== "confirmed") {
      throw new Error("Only confirmed appointments can be updated by a doctor");
    }
  }
  // admin: no restriction

  const updateData = { status };
  if (status === "cancelled") {
    updateData.cancelledReason = cancelledReason.trim();
    updateData.cancelledAt = new Date();
  }

  // Enforce receptionist doctor assignment check
  if (status === "confirmed") {
    const activeDoctorId = doctorId || appointment.doctorId;
    if (!activeDoctorId) {
      throw new Error("A doctor must be assigned to confirm this appointment");
    }
  }

  if (doctorId) {
    if (roles === "patient") {
      throw new Error(
        "Patients cannot assign doctors. Doctors must be assigned by a receptionist.",
      );
    }
    const doctorObj = await validateDoctorFitsAppointment({
      doctorId,
      departmentId: appointment.departmentId,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      excludeAppointmentId: appointment.id,
    });
    updateData.doctorId = doctorObj.id;
  }

  await appointment.update(updateData);

  return { appointment };
};

export const deleteAppointmentService = async (appointmentId) => {
  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  await appointment.destroy();

  return { message: "Appointment deleted successfully" };
};

export const createRescheduleRequestService = async (appointmentId, data, requester) => {
  const { roles, id: userId } = requester;
  const { proposedDate, proposedTime, proposedDoctorId, proposedDepartmentId, rescheduleReason } = data;

  if (roles !== "receptionist" && roles !== "admin") {
    throw new Error("Only receptionists or admins can propose reschedule requests");
  }

  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  // Validate the proposed doctor fits the proposed slot if doctorId is supplied
  if (proposedDoctorId) {
    const resolvedDeptId = proposedDepartmentId || appointment.departmentId;
    if (!resolvedDeptId) throw new Error("Department assignment is required");

    await validateDoctorFitsAppointment({
      doctorId: proposedDoctorId, // Note: validator expects user id, handles conversion internally
      departmentId: resolvedDeptId,
      appointmentDate: proposedDate || appointment.appointmentDate,
      appointmentTime: proposedTime || appointment.appointmentTime,
      excludeAppointmentId: appointment.id,
    });
  }

  // If a receptionist, verify they belong to the correct department
  if (roles === "receptionist") {
    const receptionist = await Receptionist.findOne({ where: { userId } });
    if (!receptionist) throw new Error("Receptionist profile not found");
    const checkDeptId = proposedDepartmentId || appointment.departmentId;
    if (checkDeptId && receptionist.departmentId !== checkDeptId) {
      throw new Error("Access denied: department mismatch");
    }
  }

  // Resolve actual internal doctor ID from doctor's user ID if provided
  let internalProposedDoctorId = null;
  if (proposedDoctorId) {
    const doctorObj = await Doctor.findOne({ where: { userId: proposedDoctorId } });
    if (doctorObj) internalProposedDoctorId = doctorObj.id;
  }

  await appointment.update({
    rescheduleRequested: true,
    proposedDate: proposedDate || appointment.appointmentDate,
    proposedTime: proposedTime || appointment.appointmentTime,
    proposedDoctorId: internalProposedDoctorId || appointment.doctorId,
    proposedDepartmentId: proposedDepartmentId || appointment.departmentId,
    rescheduleReason: rescheduleReason || "Doctor availability adjustment",
  });

  return { appointment };
};

export const acceptRescheduleRequestService = async (appointmentId, requester) => {
  const { roles, id: userId } = requester;

  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  // Only the assigned patient or admin can accept the change
  if (roles === "patient") {
    const patient = await Patient.findOne({ where: { userId } });
    if (!patient || appointment.patientId !== patient.id) {
      throw new Error("Access denied: you can only accept changes for your own appointments");
    }
  } else if (roles !== "admin") {
    throw new Error("Only the patient or an admin can accept reschedule requests");
  }

  if (!appointment.rescheduleRequested) {
    throw new Error("No reschedule proposal exists for this appointment");
  }

  // Apply proposed fields to the actual fields and confirm the appointment
  await appointment.update({
    appointmentDate: appointment.proposedDate,
    appointmentTime: appointment.proposedTime,
    doctorId: appointment.proposedDoctorId,
    departmentId: appointment.proposedDepartmentId,
    status: "confirmed",
    rescheduleRequested: false,
    proposedDate: null,
    proposedTime: null,
    proposedDoctorId: null,
    proposedDepartmentId: null,
    rescheduleReason: null,
  });

  return { appointment };
};

export const rejectRescheduleRequestService = async (appointmentId, requester) => {
  const { roles, id: userId } = requester;

  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  // Patient, receptionist, or admin can reject/dismiss it
  if (roles === "patient") {
    const patient = await Patient.findOne({ where: { userId } });
    if (!patient || appointment.patientId !== patient.id) {
      throw new Error("Access denied");
    }
  } else if (roles === "receptionist") {
    const receptionist = await Receptionist.findOne({ where: { userId } });
    if (!receptionist) throw new Error("Receptionist profile not found");
    if (appointment.departmentId !== receptionist.departmentId && appointment.proposedDepartmentId !== receptionist.departmentId) {
      throw new Error("Access denied");
    }
  } else if (roles !== "admin") {
    throw new Error("Access denied");
  }

  if (!appointment.rescheduleRequested) {
    throw new Error("No reschedule proposal exists for this appointment");
  }

  // Clear proposed fields and revert request flag
  await appointment.update({
    rescheduleRequested: false,
    proposedDate: null,
    proposedTime: null,
    proposedDoctorId: null,
    proposedDepartmentId: null,
    rescheduleReason: null,
  });

  return { appointment };
};

