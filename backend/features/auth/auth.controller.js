import User from "../users/user.model.js";
import {
  loginService,
  logoutService,
  registerService,
  refreshTokenService,
} from "./auth.service.js";

export const registerUser = async (req, res) => {
  try {
    const { user } = await registerService(req.body);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginService(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: { user, accessToken },
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // req.user.id comes from auth middleware
    await logoutService(req.user.id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const refreshTokenManager = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const result = await refreshTokenService(refreshToken);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
};
export const getCurrentUser = async (req, res) => {
  try {
    // req.user comes from authMiddleware (decoded JWT: { id, roles })
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { password: _p, refreshToken: _r, ...safeUser } = user.toJSON();
    return res.status(200).json({ success: true, data: { user: safeUser } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
