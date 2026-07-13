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
  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor) throw new Error("Doctor not found");
  if (!doctor.isAvailable)
    throw new Error("Doctor is not available for appointments");

  if (doctor.availableDays?.length) {
    const dayName = new Date(appointmentDate).toLocaleDateString("en-US", {
      weekday: "short",
    });
    if (!doctor.availableDays.includes(dayName)) {
      throw new Error(`Doctor is not available on ${dayName}`);
    }
  }

  if (doctor.availableTimeStart && doctor.availableTimeEnd) {
    if (
      appointmentTime < doctor.availableTimeStart ||
      appointmentTime > doctor.availableTimeEnd
    ) {
      throw new Error(
        `Doctor is only available between ${doctor.availableTimeStart} and ${doctor.availableTimeEnd}`,
      );
    }
  }

  if (doctor.departmentId !== departmentId) {
    throw new Error("Doctor does not belong to the specified department");
  }

  const clashWhere = {
    doctorId,
    appointmentDate,
    appointmentTime,
    status: { [Op.in]: ["pending", "confirmed"] },
  };
  if (excludeAppointmentId) {
    clashWhere.id = { [Op.ne]: excludeAppointmentId };
  }
  const clash = await Appointment.findOne({ where: clashWhere });
  if (clash)
    throw new Error("Doctor already has an appointment at this date and time");

  return doctor;
};

//  Create Appointment (patient self-book OR receptionist books for patient) ─
// Patients: submit only appointmentDate, appointmentTime, appointmentReason.
//           departmentId/doctorId are NOT accepted — a receptionist assigns
//           these afterwards via assignDoctorAndDepartmentService.
// Receptionists: must supply departmentId (routing decision); doctorId optional.

export const createAppointmentService = async (data, requester) => {
  const { roles, id: requesterId } = requester; // id = userId from JWT

  const {
    patientId, // required when receptionist books; ignored when patient books
    doctorId,
    departmentId,
    appointmentDate,
    appointmentTime,
    appointmentReason,
  } = data;

  let resolvedPatientId;

  if (roles === "patient") {
    // patient can only book for themselves
    const patientRecord = await Patient.findOne({
      where: { userId: requesterId },
    });
    if (!patientRecord) {
      throw new Error(
        "Patient profile not found. Please complete your profile first",
      );
    }
    resolvedPatientId = patientRecord.id;

    // Patients cannot choose department or doctor — receptionist routes these later
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
    // receptionist must supply a patientId (userId of the patient)
    if (!patientId) throw new Error("patientId is required");

    // patientId here is the userId, not the patients table id
    const patientRecord = await Patient.findOne({
      where: { userId: patientId },
    });
    if (!patientRecord) throw new Error("Patient not found");

    resolvedPatientId = patientRecord.id;

    // Receptionist is doing the routing, so departmentId is mandatory here
    if (!departmentId) {
      throw new Error("departmentId is required");
    }
  } else {
    throw new Error("Only patients and receptionists can create appointments");
  }

  //  Required field check ─
  if (!appointmentDate || !appointmentTime) {
    throw new Error("appointmentDate and appointmentTime are required");
  }

  //  Field validation ─
  validateAppointmentFields({ appointmentDate, appointmentTime });

  //  Department is active (only relevant when receptionist supplied one)
  if (departmentId) {
    const department = await Department.findOne({
      where: { id: departmentId },
    });
    if (!department) throw new Error("Department not found");
    if (!department.isActive) throw new Error("Department is not active");
  }

  if (doctorId) {
    // roles === "receptionist" only reaches here, since patient path already
    // threw above if doctorId was supplied
    await validateDoctorFitsAppointment({
      doctorId,
      departmentId,
      appointmentDate,
      appointmentTime,
    });
  }

  //  Resolve receptionist id (createdBy)
  let createdBy = null;
  if (roles === "receptionist") {
    const receptionistRecord = await Receptionist.findOne({
      where: { userId: requesterId },
    });
    if (!receptionistRecord) throw new Error("Receptionist profile not found");
    createdBy = receptionistRecord.id;
  }

  //  Create
  const appointment = await sequelize.transaction(async (t) => {
    return Appointment.create(
      {
        patientId: resolvedPatientId,
        doctorId: doctorId || null,
        departmentId: departmentId || null,
        appointmentDate,
        appointmentTime,
        appointmentReason: appointmentReason || null,
        createdBy,
        status: "pending",
      },
      { transaction: t },
    );
  });

  return { appointment };
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
    const doctor = await Doctor.findOne({ where: { userId } });
    if (!doctor) throw new Error("Doctor profile not found");
    whereClause.doctorId = doctor.id;
  } else if (roles === "receptionist") {
    const receptionist = await Receptionist.findOne({ where: { userId } });
    if (!receptionist) throw new Error("Receptionist profile not found");
    // show all appointments in their department, not just ones they created
    whereClause.departmentId = receptionist.departmentId;
  }
  // admin: no whereClause filter — sees all

  const appointments = await Appointment.findAll({
    where: whereClause,
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
    await validateDoctorFitsAppointment({
      doctorId,
      departmentId: resolvedDepartmentId,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      excludeAppointmentId: appointment.id,
    });
    updateData.doctorId = doctorId;
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
    await validateDoctorFitsAppointment({
      doctorId,
      departmentId: appointment.departmentId,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      excludeAppointmentId: appointment.id,
    });
    updateData.doctorId = doctorId;
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
