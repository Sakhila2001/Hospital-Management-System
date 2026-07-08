import bcrypt from "bcrypt";
import sequelize from "../../config/connection.js";
import User from "../users/user.model.js";
import Doctor from "./doctor.model.js";
import Department from "../departments/department.model.js";

const validateDoctorFields = ({
  specialization,
  experienceYears,
  phone,
  gender,
  dateOfBirth,
  availableDays,
  availableTimeStart,
  availableTimeEnd,
  bio,
  licenseNumber,
}) => {
  if (
    specialization !== undefined &&
    (specialization.length < 3 || specialization.length > 100)
  ) {
    throw new Error("Specialization must be between 3 and 100 characters");
  }
  if (
    experienceYears !== undefined &&
    (isNaN(experienceYears) || experienceYears < 0 || experienceYears > 60)
  ) {
    throw new Error("Experience years must be between 0 and 60");
  }

  if (phone && !/^\+?[\d\s\-]{7,15}$/.test(phone)) {
    throw new Error("Invalid phone number format");
  }
  if (gender && !["male", "female", "other"].includes(gender)) {
    throw new Error("Gender must be male, female, or other");
  }
  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) throw new Error("Invalid date of birth");
    if (dob >= new Date()) throw new Error("Date of birth must be in the past");
  }
  if (availableDays !== undefined) {
    const allowedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    if (!Array.isArray(availableDays)) {
      throw new Error("availableDays must be an array");
    }

    const invalid = availableDays.filter((day) => !allowedDays.includes(day));

    if (invalid.length > 0) {
      throw new Error(
        `Invalid days: ${invalid.join(", ")}. Allowed values are Mon,Tue,Wed,Thu,Fri,Sat,Sun`,
      );
    }
  }
  if (availableTimeStart && availableTimeEnd) {
    if (availableTimeStart >= availableTimeEnd) {
      throw new Error("availableTimeStart must be before availableTimeEnd");
    }
  }
  if (bio && bio.length > 1000) {
    throw new Error("Bio must not exceed 1000 characters");
  }
  if (licenseNumber && licenseNumber.length > 50) {
    throw new Error("License number must not exceed 50 characters");
  }
};

const safeUser = (user) => {
  const u = user.toJSON();
  delete u.password;
  delete u.refreshToken;
  delete u.deletedAt;
  return u;
};

//  Admin can create doctor (user + doctor profile in one go) ──

export const adminCreateDoctorService = async (data) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    specialization,
    qualification,
    experienceYears,
    licenseNumber,
    phone,
    gender,
    dateOfBirth,
    address,
    isAvailable,
    availableDays,
    availableTimeStart,
    availableTimeEnd,
    bio,
    departmentId,
  } = data;

  // user field validation
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
  if (!emailRegex.test(email)) throw new Error("Invalid email format");

  const existingUser = await User.findOne({
    where: { email, deletedAt: null },
  });
  if (existingUser) throw new Error("Email already exists");

  if (password.length < 6)
    throw new Error("Password must be at least 6 characters long");
  if (password !== confirmPassword) throw new Error("Passwords do not match");

  if (!specialization) throw new Error("Specialization is required");

  // doctor field validation
  validateDoctorFields({
    specialization,
    experienceYears,
    phone,
    gender,
    dateOfBirth,
    availableDays,
    availableTimeStart,
    availableTimeEnd,
    bio,
    licenseNumber,
  });

  if (licenseNumber) {
    const licenseExists = await Doctor.findOne({ where: { licenseNumber } });
    if (licenseExists) throw new Error("License number already exists");
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

  const result = await sequelize.transaction(async (t) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create(
      { firstName, lastName, email, password: hashedPassword, roles: "doctor" },
      { transaction: t },
    );

    const doctor = await Doctor.create(
      {
        userId: user.id,
        departmentId: departmentId || null,
        specialization,
        qualification: qualification || null,
        experienceYears: experienceYears || 0,
        licenseNumber: licenseNumber || null,
        phone: phone || null,
        gender: gender || null,
        dateOfBirth: dateOfBirth || null,
        address: address || null,
        isAvailable: isAvailable ?? true,
        availableDays: availableDays || null,
        availableTimeStart: availableTimeStart || null,
        availableTimeEnd: availableTimeEnd || null,
        bio: bio || null,
      },
      { transaction: t },
    );

    return { user: safeUser(user), doctor };
  });

  return result;
};

//  Doctor can update its own profile

export const updateDoctorProfileService = async (userId, data) => {
  const {
    firstName,
    lastName,
    specialization,
    qualification,
    experienceYears,
    licenseNumber,
    phone,
    gender,
    dateOfBirth,
    address,
    isAvailable,
    availableDays,
    availableTimeStart,
    availableTimeEnd,
    bio,
    departmentId,
  } = data;

  validateDoctorFields({
    specialization,
    experienceYears,
    phone,
    gender,
    dateOfBirth,
    availableDays,
    availableTimeStart,
    availableTimeEnd,
    bio,
  });

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  if (licenseNumber) {
    const taken = await Doctor.findOne({
      where: { licenseNumber },
      paranoid: false, // check even soft-deleted records
    });
    if (taken && taken.userId !== userId) {
      throw new Error("License number already exists");
    }
  }
  if (departmentId !== undefined) {
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

  await user.update({
    ...(firstName !== undefined && { firstName }),
    ...(lastName !== undefined && { lastName }),
  });

  let doctor = await Doctor.findOne({ where: { userId } });
  let created = false;

  if (!doctor) {
    doctor = await Doctor.create({
      userId,
      departmentId: departmentId || null,
      specialization,
      qualification: qualification || null,
      experienceYears: experienceYears || 0,
      licenseNumber: licenseNumber || null,
      phone: phone || null,
      gender: gender || null,
      dateOfBirth: dateOfBirth || null,
      address: address || null,
      isAvailable: isAvailable ?? true,
      availableDays: availableDays || null,
      availableTimeStart: availableTimeStart || null,
      availableTimeEnd: availableTimeEnd || null,
      bio: bio || null,
    });
    created = true;
  } else {
    await doctor.update({
      ...(departmentId !== undefined && { departmentId }),
      ...(specialization !== undefined && { specialization }),
      ...(qualification !== undefined && { qualification }),
      ...(experienceYears !== undefined && { experienceYears }),
      ...(licenseNumber !== undefined && { licenseNumber }),
      ...(phone !== undefined && { phone }),
      ...(gender !== undefined && { gender }),
      ...(dateOfBirth !== undefined && { dateOfBirth }),
      ...(address !== undefined && { address }),
      ...(isAvailable !== undefined && { isAvailable }),
      ...(availableDays !== undefined && { availableDays }),
      ...(availableTimeStart !== undefined && { availableTimeStart }),
      ...(availableTimeEnd !== undefined && { availableTimeEnd }),
      ...(bio !== undefined && { bio }),
    });
  }

  const updated = await Doctor.findOne({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email", "isActive"],
      },
    ],
  });

  return { doctor: updated, created };
};
export const getDoctorByUserIdService = async (userId) => {
  const doctor = await Doctor.findOne({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "isActive"],
      },
    ],
  });

  if (!doctor) {
    const user = await User.findByPk(userId, {
      attributes: ["id", "firstName", "lastName", "email", "isActive"],
    });
    if (!user) {
      throw new Error("User not found");
    }

    return {
      doctor: {
        firstName: user.firstName,
        lastName: user.lastName,
        departmentId: null,
        phone: null,
        gender: null,
        licenseNumber: null,
        bio: null,
        isAvailable: null,
        availableDays: null,
        availableTimeStart: null,
        availableTimeEnd: null,
        qualification: null,
        experienceYears: null,
        specialization: null,
        address: null,
      },
    };
  }

  return { doctor };
};
//  Get all doctors

export const getAllDoctorsService = async () => {
  const doctors = await Doctor.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
        where: { deletedAt: null },
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return { doctors };
};

//  Delete doctor (soft deletes both doctor + user) ─

export const deleteDoctorService = async (userId) => {
  await sequelize.transaction(async (t) => {
    const user = await User.findByPk(userId, { transaction: t });
    if (!user) throw new Error("User not found");

    const doctor = await Doctor.findOne({ where: { userId }, transaction: t });
    if (doctor) await doctor.destroy({ transaction: t }); // paranoid soft delete

    await user.destroy({ transaction: t }); // paranoid soft delete
  });

  return { message: "Doctor deleted successfully" };
};
