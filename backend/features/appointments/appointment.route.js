import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  assignDoctorAndDepartment,
  createRescheduleRequest,
  acceptRescheduleRequest,
  rejectRescheduleRequest,
} from "./appointment.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares/auth.middleware.js";

const appointmentRouter = express.Router();

appointmentRouter.use(authMiddleware);

appointmentRouter.post(
  "/",
  authorizeRoles("patient", "receptionist"),
  createAppointment,
);
appointmentRouter.get("/", getAllAppointments);
appointmentRouter.get("/:id", getAppointmentById);
appointmentRouter.patch(
  "/:id/assign",
  authorizeRoles("receptionist", "admin"),
  assignDoctorAndDepartment,
);
appointmentRouter.patch(
  "/:id/status",
  authorizeRoles("patient", "receptionist", "doctor", "admin"),
  updateAppointmentStatus,
);
appointmentRouter.post(
  "/:id/reschedule-request",
  authorizeRoles("receptionist", "admin"),
  createRescheduleRequest,
);
appointmentRouter.post(
  "/:id/reschedule-accept",
  authorizeRoles("patient", "admin"),
  acceptRescheduleRequest,
);
appointmentRouter.post(
  "/:id/reschedule-reject",
  authorizeRoles("patient", "receptionist", "admin"),
  rejectRescheduleRequest,
);
appointmentRouter.delete(
  "/:id",
  authorizeRoles("admin"),
  deleteAppointment
);

export default appointmentRouter;
