import {
  adminCreateDoctorService,
  deleteDoctorService,
  getAllDoctorsService,
  updateDoctorProfileService,
  getDoctorByUserIdService,
  toggleDoctorAvailabilityService,
} from "./doctor.service.js";

export const adminCreateDoctor = async (req, res) => {
  try {
    const { user, doctor } = await adminCreateDoctorService(req.body);
    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: { user, doctor },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const { doctors } = await getAllDoctorsService();
    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      data: { doctors },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorByUserId = async (req, res) => {
  try {
    const targetUserId =
      req.user.roles === "admin" && req.params.userId
        ? parseInt(req.params.userId)
        : req.user.id;

    const { doctor } = await getDoctorByUserIdService(targetUserId);

    return res.status(200).json({
      success: true,
      message: "Doctor profile fetched successfully",
      data: { doctor },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    // Admin can pass a userId param; doctor uses their own id
    const targetUserId =
      req.user.roles === "admin" && req.params.userId
        ? parseInt(req.params.userId)
        : req.user.id;

    const { doctor } = await updateDoctorProfileService(
      targetUserId,
      req.body,
      req.user.roles,
    );
    return res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      data: { doctor },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDoctorById = async (req, res) => {
  try {
    const { message } = await deleteDoctorService(req.params.userId);
    return res.status(200).json({ success: true, message });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};
export const toggleDoctorAvailability = async (req, res) => {
  try {
    // Admin can pass a userId param; doctor toggles their own availability
    const targetUserId =
      req.user.roles === "admin" && req.params.userId
        ? parseInt(req.params.userId)
        : req.user.id;

    const { doctor } = await toggleDoctorAvailabilityService(targetUserId);
    return res.status(200).json({
      success: true,
      message: `Doctor marked as ${doctor.isAvailable ? "available" : "unavailable"} successfully`,
      data: { doctor },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
