import bcrypt from "bcrypt";
import sequelize from "../../config/connection.js";
import User from "../users/user.model.js";
import Patient from "./patient.model.js";


const VALID_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const VALID_GENDERS = ["male", "female", "other"];
const VALID_MARITAL = ["single", "married", "divorced", "widowed"];

const validatePatientFields = ({
  gender,
  dateOfBirth,
  bloodGroup,
  phone,
  maritalStatus,
  emergencyContactPhone,
}) => {
  if (gender && !VALID_GENDERS.includes(gender))
    throw new Error("Gender must be male, female, or other");

  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) throw new Error("Invalid date of birth");
    if (dob >= new Date()) throw new Error("Date of birth must be in the past");
  }

  if (bloodGroup && !VALID_BLOOD_GROUPS.includes(bloodGroup))
    throw new Error(
      `Blood group must be one of: ${VALID_BLOOD_GROUPS.join(", ")}`,
    );

  if (phone && !/^\+?[\d\s\-]{7,15}$/.test(phone))
    throw new Error("Invalid phone number format");

  if (
    emergencyContactPhone &&
    !/^\+?[\d\s\-]{7,15}$/.test(emergencyContactPhone)
  )
    throw new Error("Invalid emergency contact phone format");

  if (maritalStatus && !VALID_MARITAL.includes(maritalStatus))
    throw new Error(
      `Marital status must be one of: ${VALID_MARITAL.join(", ")}`,
    );

 
};

const safeUser = (user) => {
  const u = user.toJSON();
  delete u.password;
  delete u.refreshToken;
  delete u.deletedAt;
  return u;
};

//  Admin creates patient (user + patient profile in one go) ─

export const adminCreatePatientService = async (data) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    dateOfBirth,
    gender,
    bloodGroup,
    phone,
    address,
    city,
    maritalStatus,
    allergies,
    chronicConditions,
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactRelation,
  } = data;

  if (!firstName || !lastName || !email || !password || !confirmPassword)
    throw new Error(
      "Please provide all required fields: firstName, lastName, email, password, confirmPassword",
    );

  if (
    firstName.length < 2 ||
    firstName.length > 50 ||
    lastName.length < 2 ||
    lastName.length > 50
  )
    throw new Error("First/Last name must be between 2 and 50 characters");

  if (!/^[a-zA-Z\s]+$/.test(firstName) || !/^[a-zA-Z\s]+$/.test(lastName))
    throw new Error("Name can only contain letters and spaces");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) throw new Error("Invalid email format");

  const existingUser = await User.findOne({
    where: { email, deletedAt: null },
  });
  if (existingUser) throw new Error("Email already exists");

  if (password.length < 6)
    throw new Error("Password must be at least 6 characters long");
  if (password !== confirmPassword) throw new Error("Passwords do not match");

  validatePatientFields({
    gender,
    dateOfBirth,
    bloodGroup,
    phone,
    maritalStatus,
    emergencyContactPhone,
  });

 

  const result = await sequelize.transaction(async (t) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roles: "patient",
      },
      { transaction: t },
    );

    const patient = await Patient.create(
      {
        userId: user.id,
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        bloodGroup: bloodGroup || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        maritalStatus: maritalStatus || null,
        allergies: allergies || null,
        chronicConditions: chronicConditions || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        emergencyContactRelation: emergencyContactRelation || null,
      },
      { transaction: t },
    );

    return { user: safeUser(user), patient };
  });

  return result;
};

//  Patient updates own profile 

export const updatePatientProfileService = async (userId, data) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    bloodGroup,
    phone,
    address,
    city,
    maritalStatus,
    allergies,
    chronicConditions,
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactRelation,
  } = data;

  validatePatientFields({
    gender,
    dateOfBirth,
    bloodGroup,
    phone,
    maritalStatus,
    emergencyContactPhone,
  });

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

 

  await user.update({
    ...(firstName !== undefined && { firstName }),
    ...(lastName !== undefined && { lastName }),
  });

  let patient = await Patient.findOne({ where: { userId } });
  let created = false;

  if (!patient) {
    patient = await Patient.create({
      userId,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      bloodGroup: bloodGroup || null,
      phone: phone || null,
      address: address || null,
      city: city || null,
      maritalStatus: maritalStatus || null,
      allergies: allergies || null,
      chronicConditions: chronicConditions || null,
      emergencyContactName: emergencyContactName || null,
      emergencyContactPhone: emergencyContactPhone || null,
      emergencyContactRelation: emergencyContactRelation || null,
    });
    created = true;
  } else {
    await patient.update({
      ...(dateOfBirth !== undefined && { dateOfBirth }),
      ...(gender !== undefined && { gender }),
      ...(bloodGroup !== undefined && { bloodGroup }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(maritalStatus !== undefined && { maritalStatus }),
      ...(allergies !== undefined && { allergies }),
      ...(chronicConditions !== undefined && { chronicConditions }),
      ...(emergencyContactName !== undefined && { emergencyContactName }),
      ...(emergencyContactPhone !== undefined && { emergencyContactPhone }),
      ...(emergencyContactRelation !== undefined && {
        emergencyContactRelation,
      }),
    });
  }

  const updated = await Patient.findOne({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email", "isActive"],
      },
    ],
  });

  return { patient: updated, created };
};

//  Get all patients (admin / receptionist) ─

export const getAllPatientsService = async () => {
  const patients = await Patient.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email", "isActive"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return { patients };
};

//  Get single patient by userId ──

export const getPatientByUserIdService = async (userId) => {
  const patient = await Patient.findOne({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email", "isActive"],
      },
    ],
  });

  if (!patient) {
    const user = await User.findByPk(userId, {
      attributes: ["id", "firstName", "lastName", "email", "isActive"],
    });
    if (!user) throw new Error("User not found");

    return {
      patient: {
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: null,
        gender: null,
        phone: null,
        maritalStatus: null,
        allergies: null,
        chronicConditions: null,
        emergencyContactName: null,
        emergencyContactPhone: null,
        emergencyContactRelation: null,
        bloodGroup: null,
        address: null,
        city: null,
      },
    };
  }

  return { patient };
};

//  Delete patient (soft deletes both patient + user) ──

export const deletePatientService = async (userId) => {
  await sequelize.transaction(async (t) => {
    const user = await User.findByPk(userId, { transaction: t });
    if (!user) throw new Error("User not found");

    const patient = await Patient.findOne({
      where: { userId },
      transaction: t,
    });
    if (patient) await patient.destroy({ transaction: t });

    await user.destroy({ transaction: t });
  });

  return { message: "Patient deleted successfully" };
};
