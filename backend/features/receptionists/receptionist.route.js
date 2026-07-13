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

// IMPORTANT: /me/profile MUST come before /:userId so Express does not
// treat the literal "me" as a userId parameter and route it to the admin handler.
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

export default receptionistRouter;
