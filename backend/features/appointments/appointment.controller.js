import {
  createAppointmentService,
  getAllAppointmentsService,
  getAppointmentByIdService,
  assignDoctorAndDepartmentService,
  updateAppointmentStatusService,
  deleteAppointmentService,
  createRescheduleRequestService,
  acceptRescheduleRequestService,
  rejectRescheduleRequestService,
} from "./appointment.service.js";

export const createAppointment = async (req, res) => {
  try {
    const result = await createAppointmentService(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: result,
    });
  } catch (error) {
    const status =
      error.message ===
      "Only patients and receptionists can create appointments"
        ? 403
        : error.message === "Access denied"
          ? 403
          : 400;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const result = await getAllAppointmentsService(req.user);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const result = await getAppointmentByIdService(
      parseInt(req.params.id),
      req.user,
    );
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    const status =
      error.message === "Appointment not found"
        ? 404
        : error.message === "Access denied"
          ? 403
          : 400;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const assignDoctorAndDepartment = async (req, res) => {
  try {
    const result = await assignDoctorAndDepartmentService(
      parseInt(req.params.id),
      req.body,
      req.user,
    );
    return res.status(200).json({
      success: true,
      message: "Doctor and department assigned successfully",
      data: result,
    });
  } catch (error) {
    const status =
      error.message === "Appointment not found"
        ? 404
        : error.message === "Access denied" ||
            error.message ===
              "Only receptionists or admins can assign a doctor and department"
          ? 403
          : 400;
    return res.status(status).json({ success: false, message: error.message });
  }
};
export const updateAppointmentStatus = async (req, res) => {
  try {
    const result = await updateAppointmentStatusService(
      parseInt(req.params.id),
      req.body,
      req.user,
    );
    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: result,
    });
  } catch (error) {
    const status =
      error.message === "Appointment not found"
        ? 404
        : error.message === "Access denied"
          ? 403
          : 400;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const result = await deleteAppointmentService(parseInt(req.params.id));
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    const status = error.message === "Appointment not found" ? 404 : 400;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const createRescheduleRequest = async (req, res) => {
  try {
    const result = await createRescheduleRequestService(
      parseInt(req.params.id),
      req.body,
      req.user
    );
    return res.status(200).json({
      success: true,
      message: "Reschedule change request proposed to patient successfully",
      data: result,
    });
  } catch (error) {
    const status = error.message.includes("Access denied") ? 403 : 400;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const acceptRescheduleRequest = async (req, res) => {
  try {
    const result = await acceptRescheduleRequestService(
      parseInt(req.params.id),
      req.user
    );
    return res.status(200).json({
      success: true,
      message: "Reschedule request accepted and appointment confirmed",
      data: result,
    });
  } catch (error) {
    const status = error.message.includes("Access denied") ? 403 : 400;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const rejectRescheduleRequest = async (req, res) => {
  try {
    const result = await rejectRescheduleRequestService(
      parseInt(req.params.id),
      req.user
    );
    return res.status(200).json({
      success: true,
      message: "Reschedule request rejected/dismissed",
      data: result,
    });
  } catch (error) {
    const status = error.message.includes("Access denied") ? 403 : 400;
    return res.status(status).json({ success: false, message: error.message });
  }
};
