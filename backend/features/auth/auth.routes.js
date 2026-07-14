import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenManager,
  getCurrentUser,
} from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const authRouter = express.Router();
authRouter.get("/me", authMiddleware, getCurrentUser);
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", authMiddleware, logoutUser);
authRouter.post("/refresh-token", refreshTokenManager);
export default authRouter;
