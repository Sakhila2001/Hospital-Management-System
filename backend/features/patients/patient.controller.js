import {
  adminCreatePatientService,
  deletePatientService,
  getAllPatientsService,
  getPatientByUserIdService,
  updatePatientProfileService,
} from "./patient.service.js";

export const adminCreatePatient = async (req, res) => {
  try {
    const { user, patient } = await adminCreatePatientService(req.body);
    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: { user, patient },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const { patients } = await getAllPatientsService();
    return res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      data: { patients },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientByUserId = async (req, res) => {
  try {
    const targetUserId =
      req.user.roles === "admin" && req.params.userId
        ? parseInt(req.params.userId)
        : req.user.id;

    const { patient } = await getPatientByUserIdService(targetUserId);

    return res.status(200).json({
      success: true,
      message: "Patient profile fetched successfully",
      data: { patient },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePatientProfile = async (req, res) => {
  try {
    // Admin can pass a userId param; patient uses their own id
    const targetUserId =
      req.user.roles === "admin" && req.params.userId
        ? parseInt(req.params.userId)
        : req.user.id;

    const { patient } = await updatePatientProfileService(
      targetUserId,
      req.body,
      req.user.roles,
    );
    return res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
      data: { patient },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePatientById = async (req, res) => {
  try {
    const { message } = await deletePatientService(req.params.userId);
    return res.status(200).json({ success: true, message });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};
