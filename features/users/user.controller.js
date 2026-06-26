import { getAllUsersService } from "./user.service.js";

export const getAllUsers = async (req, res) => {
  try {
    const { users, pagination } = await getAllUsersService(req.query);
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: { users, pagination },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};