import { Op } from "sequelize";
import sequelize from "../../config/connection.js";
import User from "./user.model.js";

export const getAllUsersService = async (query) => {
  const { page = 1, limit = 10, roles, search } = query;

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = { deletedAt: null };

  if (roles) {
    const allowedRoles = ["admin", "doctor", "receptionist", "patient"];
    const requestedRoles = roles.split(",").map((r) => r.trim());
    const invalid = requestedRoles.filter((r) => !allowedRoles.includes(r));
    if (invalid.length > 0)
      throw new Error(`Invalid roles: ${invalid.join(", ")}`);
    where.roles = { [Op.in]: requestedRoles };
  }

  // search by name
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${search}%` } },
      { lastName: { [Op.like]: `%${search}%` } },
      sequelize.where(
        sequelize.fn(
          "CONCAT",
          sequelize.col("firstName"),
          " ",
          sequelize.col("lastName"),
        ),
        { [Op.like]: `%${search}%` },
      ),
    ];
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: [
      "id",
      "firstName",
      "lastName",
      "email",
      "roles",
      "isActive",
      "lastLoginAt",
      "createdAt",
    ],
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit),
    offset,
  });

  return {
    users: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit)),
    },
  };
};
