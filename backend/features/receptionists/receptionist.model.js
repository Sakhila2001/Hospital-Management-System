import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

const Receptionist = sequelize.define(
  "Receptionist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: "departments",
        key: "id",
      },
    },
    phone: {
      type: DataTypes.STRING,
    },
    shift: {
      type: DataTypes.ENUM("Morning", "Evening", "Night"),
    },
    employeeCode: {
      type: DataTypes.STRING,
      unique: true,
    },
    joinedDate: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    tableName: "receptionists",
    timestamps: true,
    paranoid: true,
  },
);

export default Receptionist;
