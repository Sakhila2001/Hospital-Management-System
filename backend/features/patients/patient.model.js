import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

const Patient = sequelize.define(
  "Patient",
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
    dateOfBirth: {
      type: DataTypes.DATEONLY,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
    },
    bloodGroup: {
      type: DataTypes.ENUM("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"),
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    maritalStatus: {
      type: DataTypes.ENUM("single", "married", "divorced", "widowed"),
      allowNull: true,
    },
    allergies: {
      type: DataTypes.TEXT,
    },
    chronicConditions: {
      type: DataTypes.TEXT,
    },
    emergencyContactName: {
      type: DataTypes.STRING,
    },
    emergencyContactPhone: {
      type: DataTypes.STRING,
    },
    emergencyContactRelation: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "patients",
    timestamps: true,
    paranoid: true,
  },
);

export default Patient;
