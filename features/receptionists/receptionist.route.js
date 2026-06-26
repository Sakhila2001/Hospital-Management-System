import express from "express";
import {
  adminCreateReceptionist,
  updateReceptionistProfile,
  getAllReceptionists,
  getReceptionistProfile,
  deleteReceptionist,
} from "./receptionist.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares/auth.middleware.js";

const receptionistRouter = express.Router();

receptionistRouter.use(authMiddleware);

receptionistRouter.post(
  "/admin",
  authorizeRoles("admin"),
  adminCreateReceptionist,
);
receptionistRouter.get("/", authorizeRoles("admin"), getAllReceptionists);
receptionistRouter.get(
  "/:userId",
  authorizeRoles("admin"),
  getReceptionistProfile,
);
receptionistRouter.put(
  "/:userId",
  authorizeRoles("admin"),
  updateReceptionistProfile,
);
receptionistRouter.delete(
  "/:userId",
  authorizeRoles("admin"),
  deleteReceptionist,
);
receptionistRouter.get(
  "/me/profile",
  authorizeRoles("receptionist"),
  getReceptionistProfile,
);
receptionistRouter.put(
  "/me/profile",
  authorizeRoles("receptionist"),
  updateReceptionistProfile,
);

export default receptionistRouter;
