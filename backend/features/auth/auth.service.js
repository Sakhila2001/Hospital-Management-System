import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../users/user.model.js";

export const registerService = async (data) => {
  const { firstName, lastName, email, password, confirmPassword, roles } = data;

  // required fields
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    throw new Error("Please provide all required fields");
  }

  // name validation
  if (firstName.length < 2 || firstName.length > 50) {
    throw new Error("First name must be between 2 and 50 characters");
  }
  if (lastName.length < 2 || lastName.length > 50) {
    throw new Error("Last name must be between 2 and 50 characters");
  }
  if (!/^[a-zA-Z\s]+$/.test(firstName) || !/^[a-zA-Z\s]+$/.test(lastName)) {
    throw new Error("Name can only contain letters and spaces");
  }

  // email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  // duplicate email check
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // role validation
  const allowedRoles = ["admin", "doctor", "receptionist", "patient"];
  if (roles && !allowedRoles.includes(roles)) {
    throw new Error("Invalid role");
  }

  // password validation
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    roles: roles || "patient",
  });

  // Auto-create the corresponding profile record so the portal works immediately
  // after registration — without this, /me/profile and /appointments return
  // "Doctor/Patient/Receptionist profile not found".
  const assignedRole = roles || "patient";
  if (assignedRole === "doctor") {
    const { default: Doctor } = await import("../doctors/doctor.model.js");
    await Doctor.create({ userId: user.id });
  } else if (assignedRole === "receptionist") {
    const { default: Receptionist } = await import("../receptionists/receptionist.model.js");
    await Receptionist.create({ userId: user.id });
  } else if (assignedRole === "patient") {
    const { default: Patient } = await import("../patients/patient.model.js");
    await Patient.create({ userId: user.id });
  }

  const safeUser = user.toJSON();
  delete safeUser.password;
  delete safeUser.refreshToken;
  delete safeUser.isActive;
  delete safeUser.lastLoginAt;
  delete safeUser.deletedAt;

  return { user: safeUser };
};

export const loginService = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Please provide all required fields");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isActive) {
    throw { status: 403, message: "Account is deactivated" };
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw { status: 401, message: "Invalid password" };
  }

  const accessToken = jwt.sign(
    { id: user.id, roles: user.roles },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN },
  );
  const refreshToken = jwt.sign(
    { id: user.id, roles: user.roles },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
  );

  // store refresh token + last login in db
  await user.update({
    refreshToken,
    lastLoginAt: new Date(),
  });

  const { password: _p, refreshToken: _r, ...safeUser } = user.toJSON();

  return { accessToken, refreshToken, user: safeUser };
};

export const logoutService = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // clear refresh token from db
  await user.update({ refreshToken: null });
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw { status: 401, message: "Refresh token not provided" };
  }

  // verify the refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw { status: 403, message: "Invalid or expired refresh token" };
  }

  // check if token matches what's stored in DB
  const user = await User.findByPk(decoded.id);
  if (!user) {
    throw { status: 403, message: "User not found" };
  }
  if (user.refreshToken !== refreshToken) {
    throw { status: 403, message: "Refresh token mismatch" };
  }
  if (!user.isActive) {
    throw { status: 403, message: "Account is deactivated" };
  }

  // issue new access token (same payload as login)
  const accessToken = jwt.sign(
    { id: user.id, roles: user.roles },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN },
  );

  return { accessToken };
};
