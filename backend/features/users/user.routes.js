import { Router } from "express";
import { getAllUsers } from "./user.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", authMiddleware, authorizeRoles("admin"), getAllUsers);

export default userRouter;
