import bcrypt from "bcrypt";
import User from "../users/user.model.js";
import Receptionist from "./receptionist.model.js";
import sequelize from "../../config/connection.js";
import Department from "../departments/department.model.js";

//  Helpers ─

const VALID_SHIFTS = ["Morning", "Evening", "Night"];

const validateReceptionistFields = ({
  firstName,
  lastName,
  phone,
  shift,
  employeeCode,
  joinedDate,
}) => {
  if (
    firstName !== undefined &&
    (firstName.trim().length < 2 || firstName.trim().length > 50)
  ) {
    throw new Error("First name must be between 2 and 50 characters");
  }

  if (
    lastName !== undefined &&
    (lastName.trim().length < 2 || lastName.trim().length > 50)
  ) {
    throw new Error("Last name must be between 2 and 50 characters");
  }

  if (firstName !== undefined && !/^[a-zA-Z\s]+$/.test(firstName)) {
    throw new Error("First name can only contain letters and spaces");
  }

  if (lastName !== undefined && !/^[a-zA-Z\s]+$/.test(lastName)) {
    throw new Error("Last name can only contain letters and spaces");
  }
  if (phone && !/^\+?[0-9\s\-]{7,15}$/.test(phone)) {
    throw new Error("Invalid phone number format");
  }
  if (shift && !VALID_SHIFTS.includes(shift)) {
    throw new Error(`Shift must be one of: ${VALID_SHIFTS.join(", ")}`);
  }
  if (employeeCode && employeeCode.trim().length < 2) {
    throw new Error("Employee code must be at least 2 characters");
  }
  if (joinedDate) {
    const parsedDate = new Date(joinedDate);

    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid joinedDate format");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    parsedDate.setHours(0, 0, 0, 0);

    if (parsedDate > today) {
      throw new Error("Joined date cannot be in the future");
    }
  }
};

const safeUser = (user) => {
  const u = user.toJSON();
  delete u.password;
  delete u.refreshToken;
  delete u.deletedAt;
  return u;
};

export const adminCreateReceptionistService = async (data) => {
  const {
    // User fields
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    // Receptionist profile fields
    phone,
    shift,
    employeeCode,
    joinedDate,
    departmentId,
  } = data;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    throw new Error(
      "Please provide all required fields: firstName, lastName, email, password, confirmPassword",
    );
  }
  if (
    firstName.length < 2 ||
    firstName.length > 50 ||
    lastName.length < 2 ||
    lastName.length > 50
  ) {
    throw new Error("First/Last name must be between 2 and 50 characters");
  }
  if (!/^[a-zA-Z\s]+$/.test(firstName) || !/^[a-zA-Z\s]+$/.test(lastName)) {
    throw new Error("Name can only contain letters and spaces");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
  const existingUser = await User.findOne({
    where: { email, deletedAt: null },
  });
  if (existingUser) {
    throw new Error("Email already exists");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // --- Receptionist profile validation ---
  validateReceptionistFields({ phone, shift, employeeCode, joinedDate });

  if (employeeCode) {
    const existing = await Receptionist.findOne({
      where: { employeeCode },
    });
    if (existing) throw new Error("Employee code already in use");
  }
  if (departmentId) {
    const existing = await Department.findOne({
      where: {
        id: departmentId,
        deletedAt: null,
      },
    });
    if (!existing) {
      throw new Error("Department not found");
    } else if (existing.isActive === false) {
      throw new Error("Department is not active");
    }
  }

  // --- Transactional creation ---
  const result = await sequelize.transaction(async (t) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roles: "receptionist",
      },
      { transaction: t },
    );

    const receptionist = await Receptionist.create(
      {
        userId: user.id,
        phone: phone || null,
        shift: shift || null,
        employeeCode: employeeCode || null,
        joinedDate: joinedDate || null,
        departmentId: departmentId || null,
      },
      { transaction: t },
    );

    return { user: safeUser(user), receptionist };
  });

  return result;
};

export const updateReceptionistProfileService = async (
  userId,
  data,
  requesterRole,
) => {
  let receptionist = await Receptionist.findOne({
    where: { userId },
  });

  const {
    firstName,
    lastName,
    phone,
    shift,
    employeeCode,
    joinedDate,
    departmentId,
  } = data;

  validateReceptionistFields({
    firstName,
    lastName,
    phone,
    shift,
    employeeCode,
    joinedDate,
  });
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }
  if (employeeCode) {
    const taken = await Receptionist.findOne({
      where: { employeeCode },
    });

    if (taken && taken.userId !== userId) {
      throw new Error("Employee code already in use");
    }
  }

  if (
    departmentId !== undefined &&
    departmentId !== null &&
    requesterRole === "admin"
  ) {
    const department = await Department.findOne({
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      throw new Error("Department not found");
    }

    if (!department.isActive) {
      throw new Error("Department is not active");
    }
  }
  await user.update({
    ...(firstName !== undefined && { firstName }),
    ...(lastName !== undefined && { lastName }),
  });
  let created = false;

  if (!receptionist) {
    receptionist = await Receptionist.create({
      userId,
      phone: phone || null,
      shift: shift || null,
      employeeCode: employeeCode || null,
      joinedDate: joinedDate || null,
      departmentId: departmentId || null,
    });

    created = true;
  } else {
    await receptionist.update({
      ...(phone !== undefined && { phone }),
      ...(shift !== undefined && { shift }),
      ...(employeeCode !== undefined && { employeeCode }),
      ...(joinedDate !== undefined && { joinedDate }),
      ...(departmentId !== undefined && { departmentId }),
    });
  }

  const updatedReceptionist = await Receptionist.findOne({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email", "isActive"],
      },
    ],
  });

  return {
    receptionist: updatedReceptionist,
    created,
  };
};

//  Get all receptionists (admin only) ─

export const getAllReceptionistsService = async () => {
  const receptionists = await Receptionist.findAll({
    include: [
      {
        model: User,
        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
          "isActive",
          "lastLoginAt",
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return { receptionists };
};

//  Get single receptionist by userId ──

export const getReceptionistByUserIdService = async (userId) => {
  const receptionist = await Receptionist.findOne({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email", "isActive"],
      },
    ],
  });

  if (!receptionist) {
    const user = await User.findByPk(userId, {
      attributes: ["id", "firstName", "lastName", "email", "isActive"],
    });
    if (!user) {
      throw new Error("User not found");
    }

    return {
      receptionist: {
        firstName: user.firstName,
        lastName: user.lastName,
        departmentId: null,
        phone: null,
        shift: null,
        employeeCode: null,
        joinedDate: null,
      },
    };
  }

  return { receptionist };
};

export const deleteReceptionistService = async (userId) => {
  await sequelize.transaction(async (t) => {
    const user = await User.findByPk(userId, { transaction: t });
    if (!user) throw new Error("User not found");

    // soft delete from role-specific table based on user's role
    if (user.roles === "receptionist") {
      const receptionist = await Receptionist.findOne({
        where: { userId },
        transaction: t,
      });
      if (receptionist) await receptionist.destroy({ transaction: t }); // soft deletes via paranoid
    }

    // soft delete the user
    await user.destroy({ transaction: t });
  });

  return { message: "User deleted successfully" };
};
