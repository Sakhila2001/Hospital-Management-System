import { Router } from "express";
import {
  adminCreatePatient,
  deletePatientById,
  getAllPatients,
  getPatientByUserId,
  updatePatientProfile,
} from "./patient.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares/auth.middleware.js";

const patientRouter = Router();

patientRouter.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "receptionist", "doctor"),
  getAllPatients,
);
patientRouter.get(
  "/:userId",
  authMiddleware,
  authorizeRoles("admin", "receptionist", "doctor", "patient"),
  getPatientByUserId,
);
patientRouter.post(
  "/admin",
  authMiddleware,
  authorizeRoles("admin"),
  adminCreatePatient,
);
patientRouter.get(
  "/me/profile",
  authMiddleware,
  authorizeRoles("patient"),
  getPatientByUserId,
);
patientRouter.put(
  "/me/profile",
  authMiddleware,
  authorizeRoles("patient"),
  updatePatientProfile,
);
patientRouter.put(
  "/:userId",
  authMiddleware,
  authorizeRoles("admin"),
  updatePatientProfile,
);
patientRouter.delete(
  "/:userId",
  authMiddleware,
  authorizeRoles("admin"),
  deletePatientById,
);

export default patientRouter;
