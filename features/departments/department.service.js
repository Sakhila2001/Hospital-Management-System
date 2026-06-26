import Department from "./department.model.js";
import Receptionist from "../receptionists/receptionist.model.js";
import { Op } from "sequelize";

// ─ Create Department

export const createDepartmentService = async (data) => {
  const { name, description } = data;

  if (!name || name.trim().length === 0) {
    throw new Error("Department name is required");
  }
  if (name.trim().length < 2 || name.trim().length > 100) {
    throw new Error("Department name must be between 2 and 100 characters");
  }

  const existing = await Department.findOne({
    where: { name: name.trim() },
    paranoid: false, // check soft-deleted too
  });
  if (existing && !existing.deletedAt) {
    throw new Error("A department with this name already exists");
  }
  // If it was soft-deleted before, restore instead of creating a duplicate
  if (existing && existing.deletedAt) {
    await existing.restore();
    await existing.update({
      description: description?.trim() || existing.description,
      isActive: true,
    });
    return { department: existing };
  }

  const department = await Department.create({
    name: name.trim(),
    description: description?.trim() || null,
  });

  return { department };
};

// ─ Get All Departments

export const getAllDepartmentsService = async ({
  includeInactive = false,
} = {}) => {
  const where = includeInactive ? {} : { isActive: true };

  const departments = await Department.findAll({
    where,
    order: [["name", "ASC"]],
    attributes: { exclude: ["deletedAt"] },
  });

  return { departments };
};

// ─ Get Single Department

export const getDepartmentByIdService = async (id) => {
  const department = await Department.findByPk(id, {
    attributes: { exclude: ["deletedAt"] },
  });

  if (!department) throw new Error("Department not found");
  return { department };
};

// ─ Update Department

export const updateDepartmentService = async (id, data) => {
  const department = await Department.findByPk(id);
  if (!department) throw new Error("Department not found");

  const { name, description, isActive } = data;

  if (name !== undefined) {
    if (name.trim().length < 2 || name.trim().length > 100) {
      throw new Error("Department name must be between 2 and 100 characters");
    }
    // Check uniqueness, excluding self
    const duplicate = await Department.findOne({
      where: { name: name.trim(), id: { [Op.ne]: id } },
    });
    if (duplicate)
      throw new Error("A department with this name already exists");
  }

  await department.update({
    ...(name !== undefined && { name: name.trim() }),
    ...(description !== undefined && {
      description: description?.trim() || null,
    }),
    ...(isActive !== undefined && { isActive }),
  });

  return { department };
};

// ─ Toggle Active Status ─

export const toggleDepartmentStatusService = async (id) => {
  const department = await Department.findByPk(id);
  if (!department) throw new Error("Department not found");

  await department.update({ isActive: !department.isActive });
  return { department };
};

// ─ Soft Delete Department ─

export const deleteDepartmentService = async (id) => {
  const department = await Department.findByPk(id, {
    include: [{ model: Receptionist, attributes: ["id"] }],
  });

  if (!department) throw new Error("Department not found");

  // Warn if receptionists are still assigned
  if (department.Receptionists && department.Receptionists.length > 0) {
    throw new Error(
      `Cannot delete department. ${department.Receptionists.length} receptionist(s) are still assigned to it. Reassign them first.`,
    );
  }

  await department.destroy(); // paranoid soft-delete
  return {
    message: `Department named "${department.name}" deleted successfully`,
  };
};
