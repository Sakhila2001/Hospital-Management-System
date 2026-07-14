import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "patients",
        key: "id",
      },
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "departments",
        key: "id",
      },
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "doctors",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("new_patient", "follow_up", "consultation", "emergency"),
      allowNull: false,
      defaultValue: "consultation",
    },
    createdBy: {
      type: DataTypes.INTEGER, // receptionist id, nullable if self-booked
      references: {
        model: "receptionists",
        key: "id",
      },
    },
    appointmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    appointmentTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    appointmentReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    cancelledReason: {
      type: DataTypes.TEXT,
    },
    cancelledAt: {
      type: DataTypes.DATE,
    },
    rescheduleRequested: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    proposedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    proposedTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    proposedDoctorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "doctors",
        key: "id",
      },
    },
    proposedDepartmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "departments",
        key: "id",
      },
    },
    rescheduleReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "appointments",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "doctor_schedule_idx",
        fields: ["doctorId", "appointmentDate", "appointmentTime"],
      },
      {
        name: "patient_schedule_idx",
        fields: ["patientId", "appointmentDate"],
      },
    ],
  },
);

export default Appointment;
