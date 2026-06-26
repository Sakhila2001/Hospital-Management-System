import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

const Doctor = sequelize.define(
  "Doctor",
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
      allowNull: false,
      references: {
        model: "departments",
        key: "id",
      },
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qualification: {
      type: DataTypes.STRING,
    },
    experienceYears: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    licenseNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
    },
    address: {
      type: DataTypes.STRING,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    availableDays: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    availableTimeStart: {
      type: DataTypes.TIME,
    },
    availableTimeEnd: {
      type: DataTypes.TIME,
    },
    bio: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "doctors",
    timestamps: true,
    paranoid: true,
  },
);

export default Doctor;
