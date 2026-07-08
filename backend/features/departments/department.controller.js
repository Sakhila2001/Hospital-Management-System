import {
  createDepartmentService,
  getAllDepartmentsService,
  getDepartmentByIdService,
  updateDepartmentService,
  toggleDepartmentStatusService,
  deleteDepartmentService,
} from "./department.service.js";

// ─ Create Department 

export const createDepartment = async (req, res) => {
  try {
    const { department } = await createDepartmentService(req.body);
    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: { department },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─ Get All Departments 

export const getAllDepartments = async (req, res) => {
  try {
    // Admin can pass ?includeInactive=true to see deactivated departments too
    const includeInactive = req.query.includeInactive === "true";
    const { departments } = await getAllDepartmentsService({ includeInactive });
    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      data: { departments },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─ Get Single Department 

export const getDepartmentById = async (req, res) => {
  try {
    const { department } = await getDepartmentByIdService(parseInt(req.params.id));
    return res.status(200).json({
      success: true,
      message: "Department fetched successfully",
      data: { department },
    });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

// ─ Update Department 

export const updateDepartment = async (req, res) => {
  try {
    const { department } = await updateDepartmentService(parseInt(req.params.id), req.body);
    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: { department },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─ Toggle Active Status ─

export const toggleDepartmentStatus = async (req, res) => {
  try {
    const { department } = await toggleDepartmentStatusService(parseInt(req.params.id));
    return res.status(200).json({
      success: true,
      message: `Department ${department.isActive ? "activated" : "deactivated"} successfully`,
      data: { department },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─ Delete Department 

export const deleteDepartment = async (req, res) => {
  try {
    const { message } = await deleteDepartmentService(parseInt(req.params.id));
    return res.status(200).json({ success: true, message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};