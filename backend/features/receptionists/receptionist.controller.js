import {
  adminCreateReceptionistService,
  updateReceptionistProfileService,
  getAllReceptionistsService,
  getReceptionistByUserIdService,
  deleteReceptionistService,
} from "./receptionist.service.js";

//  Admin: Create a receptionist account + profile in one shot

export const adminCreateReceptionist = async (req, res) => {
  try {
    const { user, receptionist } = await adminCreateReceptionistService(
      req.body,
    );
    return res.status(201).json({
      success: true,
      message: "Receptionist created successfully",
      data: { user, receptionist },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateReceptionistProfile = async (req, res) => {
  try {
    // Admin can pass a userId param; receptionist uses their own id
    const targetUserId =
      req.user.roles === "admin" && req.params.userId
        ? parseInt(req.params.userId)
        : req.user.id;

    const { receptionist } = await updateReceptionistProfileService(
      targetUserId,
      req.body,
      req.user.roles,
    );
    return res.status(200).json({
      success: true,
      message: "Receptionist profile updated successfully",
      data: { receptionist },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//  Admin: Get all receptionists

export const getAllReceptionists = async (req, res) => {
  try {
    const { receptionists } = await getAllReceptionistsService();
    return res.status(200).json({
      success: true,
      message: "Receptionists fetched successfully",
      data: { receptionists },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getReceptionistProfile = async (req, res) => {
  try {
    const targetUserId =
      req.user.roles === "admin" && req.params.userId
        ? parseInt(req.params.userId)
        : req.user.id;

    const { receptionist } = await getReceptionistByUserIdService(targetUserId);

    return res.status(200).json({
      success: true,
      message: "Receptionist profile fetched successfully",
      data: { receptionist },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
//  Admin: Soft-delete receptionist

export const deleteReceptionist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = await deleteReceptionistService(parseInt(userId));
    return res.status(200).json({ success: true, message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
