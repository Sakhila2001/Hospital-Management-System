import { Router } from "express";
import {
  adminCreateDoctor,
  deleteDoctorById,
  getAllDoctors,
  getDoctorByUserId,
  toggleDoctorAvailability,
  updateDoctorProfile,
} from "./doctor.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares/auth.middleware.js";

const doctorRouter = Router();

doctorRouter.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "receptionist"),
  getAllDoctors,
);

// IMPORTANT: /me/profile and /admin MUST come before /:userId so Express
// does not treat the literal string "me" or "admin" as a userId parameter.
doctorRouter.get(
  "/me/profile",
  authMiddleware,
  authorizeRoles("doctor"),
  getDoctorByUserId,
);
doctorRouter.put(
  "/me/profile",
  authMiddleware,
  authorizeRoles("doctor"),
  updateDoctorProfile,
);
doctorRouter.post(
  "/admin",
  authMiddleware,
  authorizeRoles("admin"),
  adminCreateDoctor,
);

doctorRouter.get(
  "/:userId",
  authMiddleware,
  authorizeRoles("admin", "receptionist", "doctor"),
  getDoctorByUserId,
);
doctorRouter.put(
  "/:userId",
  authMiddleware,
  authorizeRoles("admin", "doctor"),
  updateDoctorProfile,
);
doctorRouter.patch(
  "/:userId/availability",
  authMiddleware,
  authorizeRoles("admin", "doctor"),
  toggleDoctorAvailability,
);
doctorRouter.delete(
  "/:userId",
  authMiddleware,
  authorizeRoles("admin"),
  deleteDoctorById,
);

export default doctorRouter;
