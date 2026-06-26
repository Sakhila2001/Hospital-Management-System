import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  toggleDepartmentStatus,
  deleteDepartment,
} from "./department.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares/auth.middleware.js";

const departmentRouter = express.Router();

// ─ Public route (any logged-in user can list active departments)

/**
 * GET /api/departments
 * Any authenticated user can see active departments.
 * Admin can also pass ?includeInactive=true to see deactivated ones.
 */
departmentRouter.get("/", authMiddleware, getAllDepartments);
/**
 * GET /api/departments/:id
 * Any authenticated user can view a department (with its receptionists).
 */
departmentRouter.get("/:id", authMiddleware, getDepartmentById);
// ─ Admin-only routes
/**
 * POST /api/departments
 * Body: { name, description? }
 * If the department was previously soft-deleted, it gets restored automatically.
 */
departmentRouter.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  createDepartment,
);
/**
 * PUT /api/departments/:id
 * Body: { name?, description?, isActive? }
 */
departmentRouter.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateDepartment,
);

/**
 * PATCH /api/departments/:id/toggle-status
 * Flips isActive between true and false.
 */
departmentRouter.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  toggleDepartmentStatus,
);

/**
 * DELETE /api/departments/:id
 * Soft-deletes the department.
 * Blocked if any receptionists are still assigned to it.
 */
departmentRouter.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteDepartment,
);

export default departmentRouter;
