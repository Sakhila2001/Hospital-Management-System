import User from "../features/users/user.model.js";
import Department from "../features/departments/department.model.js";
import Doctor from "../features/doctors/doctor.model.js";
import Receptionist from "../features/receptionists/receptionist.model.js";
import Patient from "../features/patients/patient.model.js";
import Appointment from "../features/appointments/appointment.model.js";

// User <-> role tables (1-to-1)
User.hasOne(Doctor, { foreignKey: "userId" });
Doctor.belongsTo(User, { foreignKey: "userId" });

User.hasOne(Receptionist, { foreignKey: "userId" });
Receptionist.belongsTo(User, { foreignKey: "userId" });

User.hasOne(Patient, { foreignKey: "userId" });
Patient.belongsTo(User, { foreignKey: "userId" });

// Receptionist -> Department (desk assigned)
Department.hasMany(Receptionist, { foreignKey: "departmentId" });
Receptionist.belongsTo(Department, { foreignKey: "departmentId" });

// Appointments
Patient.hasMany(Appointment, { foreignKey: "patientId" });
Appointment.belongsTo(Patient, { foreignKey: "patientId" });

Doctor.hasMany(Appointment, { foreignKey: "doctorId" });
Appointment.belongsTo(Doctor, { foreignKey: "doctorId" });

Department.hasMany(Appointment, { foreignKey: "departmentId" });
Appointment.belongsTo(Department, { foreignKey: "departmentId" });

Receptionist.hasMany(Appointment, { foreignKey: "createdBy" });
Appointment.belongsTo(Receptionist, { foreignKey: "createdBy" });
