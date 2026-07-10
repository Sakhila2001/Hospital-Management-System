// import React, { createContext, useContext, useState } from "react";

// const AdminContext = createContext();

// export const useAdmin = () => {
//   const context = useContext(AdminContext);
//   if (!context) {
//     throw new Error("useAdmin must be used within an AdminProvider");
//   }
//   return context;
// };

// export const AdminProvider = ({ children }) => {
//   // --- MOCK NOTIFICATIONS ---
//   const [notifications, setNotifications] = useState([
//     { id: 1, message: "Welcome to City Care Admin Portal.", time: "Just now", read: false },
//     { id: 2, message: "Dr. Sarah Connor availability toggled to Available.", time: "1 hour ago", read: true },
//     { id: 3, message: "New appointment booked by patient Robert Paulson.", time: "2 hours ago", read: true }
//   ]);

//   const addNotification = (message) => {
//     setNotifications((prev) => [
//       { id: Date.now(), message, time: "Just now", read: false },
//       ...prev
//     ]);
//   };

//   const markAllNotificationsAsRead = () => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//   };

//   const clearAllNotifications = () => {
//     setNotifications([]);
//   };

//   // --- MOCK DEPARTMENTS ---
//   const [departments, setDepartments] = useState([
//     { id: 1, name: "Cardiology", description: "Heart care services and specialized cardiovascular surgery.", isActive: true },
//     { id: 2, name: "Pediatrics", description: "Medical care for infants, children, and adolescents.", isActive: true },
//     { id: 3, name: "Neurology", description: "Diagnosis and treatment of brain and nervous system disorders.", isActive: true },
//     { id: 4, name: "Orthopedics", description: "Bone, joint, ligament, and muscle treatment and surgery.", isActive: false },
//   ]);

//   // --- MOCK DOCTORS ---
//   const [doctors, setDoctors] = useState([
//     {
//       id: 1,
//       userId: 101,
//       departmentId: 1,
//       firstName: "John",
//       lastName: "Doe",
//       email: "john.doe@hospital.com",
//       specialization: "Cardiology",
//       qualification: "MD, DM (Cardiology)",
//       experienceYears: 12,
//       licenseNumber: "LIC12345",
//       phone: "9876543210",
//       gender: "male",
//       dateOfBirth: "1980-05-15",
//       address: "123 Main St, Metro City",
//       isAvailable: true,
//       availableDays: ["Mon", "Wed", "Fri"],
//       availableTimeStart: "09:00",
//       availableTimeEnd: "13:00",
//       bio: "Senior Cardiologist dedicated to compassionate cardiac care and research."
//     },
//     {
//       id: 2,
//       userId: 102,
//       departmentId: 2,
//       firstName: "Sarah",
//       lastName: "Connor",
//       email: "sarah.connor@hospital.com",
//       specialization: "Pediatrics",
//       qualification: "MD, DCH",
//       experienceYears: 8,
//       licenseNumber: "LIC54321",
//       phone: "9876543211",
//       gender: "female",
//       dateOfBirth: "1985-08-20",
//       address: "456 Oak Ave, Metro City",
//       isAvailable: true,
//       availableDays: ["Tue", "Thu", "Sat"],
//       availableTimeStart: "10:00",
//       availableTimeEnd: "16:00",
//       bio: "Friendly pediatrician specializing in newborn and infant health monitoring."
//     }
//   ]);

//   // --- MOCK RECEPTIONISTS ---
//   const [receptionists, setReceptionists] = useState([
//     {
//       id: 1,
//       userId: 201,
//       departmentId: 1,
//       firstName: "Alice",
//       lastName: "Smith",
//       email: "alice.smith@hospital.com",
//       phone: "9876543220",
//       shift: "Morning",
//       employeeCode: "REC001",
//       joinedDate: "2024-01-10"
//     },
//     {
//       id: 2,
//       userId: 202,
//       departmentId: 2,
//       firstName: "Bob",
//       lastName: "Johnson",
//       email: "bob.johnson@hospital.com",
//       phone: "9876543221",
//       shift: "Evening",
//       employeeCode: "REC002",
//       joinedDate: "2024-02-15"
//     }
//   ]);

//   // --- MOCK PATIENTS ---
//   const [patients, setPatients] = useState([
//     {
//       id: 1,
//       userId: 301,
//       firstName: "Robert",
//       lastName: "Paulson",
//       email: "robert.p@gmail.com",
//       dateOfBirth: "1975-10-12",
//       gender: "male",
//       bloodGroup: "O+",
//       phone: "9876543230",
//       address: "789 Pine Rd",
//       city: "Metro City",
//       maritalStatus: "single",
//       allergies: "Penicillin",
//       chronicConditions: "Hypertension",
//       emergencyContactName: "Jane Paulson",
//       emergencyContactPhone: "9876543231",
//       emergencyContactRelation: "Sister"
//     },
//     {
//       id: 2,
//       userId: 302,
//       firstName: "Emily",
//       lastName: "Watson",
//       email: "emily.w@gmail.com",
//       dateOfBirth: "1990-03-25",
//       gender: "female",
//       bloodGroup: "A-",
//       phone: "9876543232",
//       address: "101 Maple Dr",
//       city: "Metro City",
//       maritalStatus: "married",
//       allergies: "None",
//       chronicConditions: "Asthma",
//       emergencyContactName: "David Watson",
//       emergencyContactPhone: "9876543233",
//       emergencyContactRelation: "Spouse"
//     }
//   ]);

//   // --- MOCK APPOINTMENTS ---
//   const [appointments, setAppointments] = useState([
//     {
//       id: 1,
//       patientId: 301,
//       doctorId: 101,
//       departmentId: 1,
//       patientName: "Robert Paulson",
//       doctorName: "Dr. John Doe",
//       departmentName: "Cardiology",
//       date: "2026-07-10",
//       time: "10:30",
//       type: "consultation",
//       appointmentReason: "Routine heart checkup",
//       status: "pending"
//     },
//     {
//       id: 2,
//       patientId: 302,
//       doctorId: 102,
//       departmentId: 2,
//       patientName: "Emily Watson",
//       doctorName: "Dr. Sarah Connor",
//       departmentName: "Pediatrics",
//       date: "2026-07-11",
//       time: "14:00",
//       type: "new_patient",
//       appointmentReason: "Child fever recovery",
//       status: "confirmed"
//     }
//   ]);

//   // --- OPERATIONS ---

//   // APPOINTMENTS
//   const updateAppointmentStatus = (id, status, extraData = {}) => {
//     setAppointments((prev) =>
//       prev.map((app) => {
//         if (app.id === id) {
//           let doctorName = app.doctorName;
//           let departmentName = app.departmentName;
//           if (extraData.doctorId) {
//             const doc = doctors.find((d) => d.id === Number(extraData.doctorId) || d.userId === Number(extraData.doctorId));
//             doctorName = doc ? `Dr. ${doc.firstName} ${doc.lastName}` : doctorName;
//           }
//           if (extraData.departmentId) {
//             const dept = departments.find((d) => d.id === Number(extraData.departmentId));
//             departmentName = dept ? dept.name : departmentName;
//           }
//           return {
//             ...app,
//             status,
//             ...extraData,
//             doctorName,
//             departmentName
//           };
//         }
//         return app;
//       })
//     );
//     addNotification(`Appointment ID #${id} status updated to "${status.toUpperCase()}".`);
//   };

//   const deleteAppointment = (id) => {
//     setAppointments((prev) => prev.filter((app) => app.id !== id));
//     addNotification(`Appointment ID #${id} deleted.`);
//   };

//   // DEPARTMENTS
//   const createDepartment = (dept) => {
//     const newId = departments.length ? Math.max(...departments.map((d) => d.id)) + 1 : 1;
//     const newDept = {
//       id: newId,
//       name: dept.name,
//       description: dept.description || "",
//       isActive: dept.isActive !== undefined ? dept.isActive : true,
//     };
//     setDepartments((prev) => [...prev, newDept]);
//     addNotification(`Department "${dept.name}" created successfully.`);
//     return newDept;
//   };

//   const updateDepartment = (id, updatedFields) => {
//     setDepartments((prev) =>
//       prev.map((dept) => (dept.id === id ? { ...dept, ...updatedFields } : dept))
//     );
//     addNotification(`Department details for "${updatedFields.name || id}" updated.`);
//   };

//   const toggleDepartmentStatus = (id) => {
//     let deptName = "";
//     setDepartments((prev) =>
//       prev.map((dept) => {
//         if (dept.id === id) {
//           deptName = dept.name;
//           return { ...dept, isActive: !dept.isActive };
//         }
//         return dept;
//       })
//     );
//     addNotification(`Department "${deptName || id}" status toggled.`);
//   };

//   const deleteDepartment = (id) => {
//     const assignedReceptionist = receptionists.find(
//       (r) => Number(r.departmentId) === Number(id)
//     );
//     if (assignedReceptionist) {
//       throw new Error(
//         `Cannot delete department: Receptionist "${assignedReceptionist.firstName} ${assignedReceptionist.lastName}" is assigned to it.`
//       );
//     }
//     const dept = departments.find((d) => d.id === id);
//     setDepartments((prev) => prev.filter((dept) => dept.id !== id));
//     addNotification(`Department "${dept?.name || id}" deleted.`);
//   };

//   // DOCTORS
//   const createDoctor = (data) => {
//     const newId = doctors.length ? Math.max(...doctors.map((d) => d.id)) + 1 : 1;
//     const newUserId = doctors.length ? Math.max(...doctors.map((d) => d.userId)) + 1 : 101;
//     const newDoc = {
//       id: newId,
//       userId: newUserId,
//       firstName: data.firstName,
//       lastName: data.lastName,
//       email: data.email,
//       departmentId: Number(data.departmentId),
//       specialization: data.specialization,
//       qualification: data.qualification || "",
//       experienceYears: Number(data.experienceYears) || 0,
//       licenseNumber: data.licenseNumber || "",
//       phone: data.phone || "",
//       gender: data.gender || "male",
//       dateOfBirth: data.dateOfBirth || "",
//       address: data.address || "",
//       isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
//       availableDays: data.availableDays || [],
//       availableTimeStart: data.availableTimeStart || "",
//       availableTimeEnd: data.availableTimeEnd || "",
//       bio: data.bio || "",
//     };
//     setDoctors((prev) => [...prev, newDoc]);
//     addNotification(`Dr. ${data.firstName} ${data.lastName} registered as clinical doctor.`);
//     return newDoc;
//   };

//   const updateDoctor = (userId, updatedFields) => {
//     setDoctors((prev) =>
//       prev.map((doc) => (doc.userId === userId ? { ...doc, ...updatedFields } : doc))
//     );
//     addNotification(`Doctor profile details for Dr. ${updatedFields.firstName || userId} updated.`);
//   };

//   const toggleDoctorAvailability = (doctorId) => {
//     setDoctors((prev) =>
//       prev.map((doc) => {
//         if (doc.id === doctorId || doc.userId === doctorId) {
//           const nextVal = !doc.isAvailable;
//           addNotification(`Dr. ${doc.firstName} ${doc.lastName} availability toggled to ${nextVal ? "Available" : "Off-duty"}.`);
//           return { ...doc, isAvailable: nextVal };
//         }
//         return doc;
//       })
//     );
//   };

//   const deleteDoctor = (userId) => {
//     const doc = doctors.find((d) => d.userId === userId);
//     setDoctors((prev) => prev.filter((doc) => doc.userId !== userId));
//     addNotification(`Doctor Dr. ${doc?.firstName || ""} ${doc?.lastName || ""} profile deleted.`);
//   };

//   // RECEPTIONISTS
//   const createReceptionist = (data) => {
//     const newId = receptionists.length ? Math.max(...receptionists.map((r) => r.id)) + 1 : 1;
//     const newUserId = receptionists.length ? Math.max(...receptionists.map((r) => r.userId)) + 1 : 201;
//     const newRec = {
//       id: newId,
//       userId: newUserId,
//       firstName: data.firstName,
//       lastName: data.lastName,
//       email: data.email,
//       departmentId: Number(data.departmentId),
//       phone: data.phone || "",
//       shift: data.shift || "Morning",
//       employeeCode: data.employeeCode || `REC0${newId}`,
//       joinedDate: data.joinedDate || new Date().toISOString().split("T")[0],
//     };
//     setReceptionists((prev) => [...prev, newRec]);
//     addNotification(`Receptionist ${data.firstName} ${data.lastName} registered.`);
//     return newRec;
//   };

//   const updateReceptionist = (userId, updatedFields) => {
//     setReceptionists((prev) =>
//       prev.map((rec) => (rec.userId === userId ? { ...rec, ...updatedFields } : rec))
//     );
//     addNotification(`Receptionist ${updatedFields.firstName || userId} details updated.`);
//   };

//   const deleteReceptionist = (userId) => {
//     const rec = receptionists.find((r) => r.userId === userId);
//     setReceptionists((prev) => prev.filter((rec) => rec.userId !== userId));
//     addNotification(`Receptionist ${rec?.firstName || ""} ${rec?.lastName || ""} details deleted.`);
//   };

//   // PATIENTS
//   const createPatient = (data) => {
//     const newId = patients.length ? Math.max(...patients.map((p) => p.id)) + 1 : 1;
//     const newUserId = patients.length ? Math.max(...patients.map((p) => p.userId)) + 1 : 301;
//     const newPatient = {
//       id: newId,
//       userId: newUserId,
//       firstName: data.firstName,
//       lastName: data.lastName,
//       email: data.email,
//       dateOfBirth: data.dateOfBirth || "",
//       gender: data.gender || "male",
//       bloodGroup: data.bloodGroup || "O+",
//       phone: data.phone || "",
//       address: data.address || "",
//       city: data.city || "",
//       maritalStatus: data.maritalStatus || "single",
//       allergies: data.allergies || "",
//       chronicConditions: data.chronicConditions || "",
//       emergencyContactName: data.emergencyContactName || "",
//       emergencyContactPhone: data.emergencyContactPhone || "",
//       emergencyContactRelation: data.emergencyContactRelation || "",
//     };
//     setPatients((prev) => [...prev, newPatient]);
//     addNotification(`Patient record for ${data.firstName} ${data.lastName} registered.`);
//     return newPatient;
//   };

//   const updatePatient = (userId, updatedFields) => {
//     setPatients((prev) =>
//       prev.map((p) => (p.userId === userId ? { ...p, ...updatedFields } : p))
//     );
//     addNotification(`Patient profile ${updatedFields.firstName || userId} details updated.`);
//   };

//   const deletePatient = (userId) => {
//     const pat = patients.find((p) => p.userId === userId);
//     setPatients((prev) => prev.filter((p) => p.userId !== userId));
//     addNotification(`Patient profile for ${pat?.firstName || ""} ${pat?.lastName || ""} deleted.`);
//   };

//   const bookAppointment = (data) => {
//     const newId = appointments.length ? Math.max(...appointments.map((a) => a.id)) + 1 : 1;
//     const newPatientId = patients.length ? Math.max(...patients.map((p) => p.userId)) + 1 : 301;

//     const newPatientObj = {
//       id: newPatientId - 300,
//       userId: newPatientId,
//       firstName: data.patientFirstName,
//       lastName: data.patientLastName,
//       email: data.patientEmail,
//       phone: data.patientPhone,
//       gender: data.patientGender || "male",
//       dateOfBirth: data.patientDOB || "",
//       bloodGroup: "O+",
//       address: "",
//       city: "",
//     };

//     setPatients((prev) => [...prev, newPatientObj]);

//     const newApp = {
//       id: newId,
//       patientId: newPatientId,
//       doctorId: null,
//       departmentId: null,
//       patientName: `${data.patientFirstName} ${data.patientLastName}`,
//       doctorName: "Not Assigned",
//       departmentName: "Not Assigned",
//       date: data.date,
//       time: data.time,
//       type: data.type || "consultation",
//       appointmentReason: data.appointmentReason || "",
//       status: "pending"
//     };

//     setAppointments((prev) => [...prev, newApp]);
//     addNotification(`New triage appointment request submitted by patient "${data.patientFirstName} ${data.patientLastName}".`);
//     return newApp;
//   };

//   return (
//     <AdminContext.Provider
//       value={{
//         appointments,
//         departments,
//         doctors,
//         receptionists,
//         patients,
//         notifications,
//         updateAppointmentStatus,
//         deleteAppointment,
//         createDepartment,
//         updateDepartment,
//         toggleDepartmentStatus,
//         deleteDepartment,
//         createDoctor,
//         updateDoctor,
//         toggleDoctorAvailability,
//         deleteDoctor,
//         createReceptionist,
//         updateReceptionist,
//         deleteReceptionist,
//         createPatient,
//         updatePatient,
//         deletePatient,
//         bookAppointment,
//         markAllNotificationsAsRead,
//         clearAllNotifications
//       }}
//     >
//       {children}
//     </AdminContext.Provider>
//   );
// };

import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  // --- MOCK NOTIFICATIONS ---
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Welcome to City Care Admin Portal.",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      message: "Dr. Sarah Connor availability toggled to Available.",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 3,
      message: "New appointment booked by patient Robert Paulson.",
      time: "2 hours ago",
      read: true,
    },
  ]);

  const addNotification = (message) => {
    setNotifications((prev) => [
      { id: Date.now(), message, time: "Just now", read: false },
      ...prev,
    ]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // --- MOCK DEPARTMENTS ---
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Cardiology",
      description:
        "Heart care services and specialized cardiovascular surgery.",
      isActive: true,
    },
    {
      id: 2,
      name: "Pediatrics",
      description: "Medical care for infants, children, and adolescents.",
      isActive: true,
    },
    {
      id: 3,
      name: "Neurology",
      description:
        "Diagnosis and treatment of brain and nervous system disorders.",
      isActive: true,
    },
    {
      id: 4,
      name: "Orthopedics",
      description: "Bone, joint, ligament, and muscle treatment and surgery.",
      isActive: false,
    },
  ]);

  // --- MOCK DOCTORS ---
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      userId: 101,
      departmentId: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@hospital.com",
      specialization: "Cardiology",
      qualification: "MD, DM (Cardiology)",
      experienceYears: 12,
      licenseNumber: "LIC12345",
      phone: "9876543210",
      gender: "male",
      dateOfBirth: "1980-05-15",
      address: "123 Main St, Metro City",
      isAvailable: true,
      availableDays: ["Mon", "Wed", "Fri"],
      availableTimeStart: "09:00",
      availableTimeEnd: "13:00",
      bio: "Senior Cardiologist dedicated to compassionate cardiac care and research.",
    },
    {
      id: 2,
      userId: 102,
      departmentId: 2,
      firstName: "Sarah",
      lastName: "Connor",
      email: "sarah.connor@hospital.com",
      specialization: "Pediatrics",
      qualification: "MD, DCH",
      experienceYears: 8,
      licenseNumber: "LIC54321",
      phone: "9876543211",
      gender: "female",
      dateOfBirth: "1985-08-20",
      address: "456 Oak Ave, Metro City",
      isAvailable: true,
      availableDays: ["Tue", "Thu", "Sat"],
      availableTimeStart: "10:00",
      availableTimeEnd: "16:00",
      bio: "Friendly pediatrician specializing in newborn and infant health monitoring.",
    },
  ]);

  // --- MOCK RECEPTIONISTS ---
  const [receptionists, setReceptionists] = useState([
    {
      id: 1,
      userId: 201,
      departmentId: 1,
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@hospital.com",
      phone: "9876543220",
      shift: "Morning",
      employeeCode: "REC001",
      joinedDate: "2024-01-10",
    },
    {
      id: 2,
      userId: 202,
      departmentId: 2,
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob.johnson@hospital.com",
      phone: "9876543221",
      shift: "Evening",
      employeeCode: "REC002",
      joinedDate: "2024-02-15",
    },
  ]);

  // --- MOCK PATIENTS ---
  const [patients, setPatients] = useState([
    {
      id: 1,
      userId: 301,
      firstName: "Robert",
      lastName: "Paulson",
      email: "robert.p@gmail.com",
      dateOfBirth: "1975-10-12",
      gender: "male",
      bloodGroup: "O+",
      phone: "9876543230",
      address: "789 Pine Rd",
      city: "Metro City",
      maritalStatus: "single",
      allergies: "Penicillin",
      chronicConditions: "Hypertension",
      emergencyContactName: "Jane Paulson",
      emergencyContactPhone: "9876543231",
      emergencyContactRelation: "Sister",
    },
    {
      id: 2,
      userId: 302,
      firstName: "Emily",
      lastName: "Watson",
      email: "emily.w@gmail.com",
      dateOfBirth: "1990-03-25",
      gender: "female",
      bloodGroup: "A-",
      phone: "9876543232",
      address: "101 Maple Dr",
      city: "Metro City",
      maritalStatus: "married",
      allergies: "None",
      chronicConditions: "Asthma",
      emergencyContactName: "David Watson",
      emergencyContactPhone: "9876543233",
      emergencyContactRelation: "Spouse",
    },
    {
      id: 3,
      userId: 303,
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@example.com",
      dateOfBirth: "1995-11-02",
      gender: "male",
      bloodGroup: "B+",
      phone: "9812345670",
      address: "22 Birch Lane",
      city: "Metro City",
      maritalStatus: "single",
      allergies: "Shellfish, Pollen",
      chronicConditions: "None",
      emergencyContactName: "Linda Chen",
      emergencyContactPhone: "9812345671",
      emergencyContactRelation: "Mother",
    },
    {
      id: 4,
      userId: 304,
      firstName: "Amara",
      lastName: "Okafor",
      email: "amara.okafor@example.com",
      dateOfBirth: "1979-05-30",
      gender: "female",
      bloodGroup: "AB-",
      phone: "9823456780",
      address: "58 Cedar Court",
      city: "Metro City",
      maritalStatus: "married",
      allergies: "Latex",
      chronicConditions: "Diabetes Type 2",
      emergencyContactName: "Chidi Okafor",
      emergencyContactPhone: "9823456781",
      emergencyContactRelation: "Husband",
    },
    {
      id: 5,
      userId: 305,
      firstName: "Liam",
      lastName: "Fitzgerald",
      email: "liam.fitzgerald@example.com",
      dateOfBirth: "2001-09-14",
      gender: "male",
      bloodGroup: "O-",
      phone: "9834567890",
      address: "9 Elmwood Ave",
      city: "Metro City",
      maritalStatus: "single",
      allergies: "None",
      chronicConditions: "None",
      emergencyContactName: "Sarah Fitzgerald",
      emergencyContactPhone: "9834567891",
      emergencyContactRelation: "Mother",
    },
    {
      id: 6,
      userId: 306,
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya.sharma@example.com",
      dateOfBirth: "1992-01-18",
      gender: "female",
      bloodGroup: "A-",
      phone: "9845678900",
      address: "14 Rosewood St",
      city: "Metro City",
      maritalStatus: "married",
      allergies: "Aspirin",
      chronicConditions: "Migraine",
      emergencyContactName: "Raj Sharma",
      emergencyContactPhone: "9845678901",
      emergencyContactRelation: "Father",
    },
    {
      id: 7,
      userId: 307,
      firstName: "Carlos",
      lastName: "Mendes",
      email: "carlos.mendes@example.com",
      dateOfBirth: "1985-12-05",
      gender: "male",
      bloodGroup: "B-",
      phone: "9856789010",
      address: "77 Palm Grove",
      city: "Metro City",
      maritalStatus: "married",
      allergies: "None",
      chronicConditions: "None",
      emergencyContactName: "Ana Mendes",
      emergencyContactPhone: "9856789011",
      emergencyContactRelation: "Wife",
    },
    {
      id: 8,
      userId: 308,
      firstName: "Grace",
      lastName: "Kim",
      email: "grace.kim@example.com",
      dateOfBirth: "1998-04-27",
      gender: "female",
      bloodGroup: "O+",
      phone: "9867890120",
      address: "3 Willow Bend",
      city: "Metro City",
      maritalStatus: "single",
      allergies: "Pollen",
      chronicConditions: "None",
      emergencyContactName: "David Kim",
      emergencyContactPhone: "9867890121",
      emergencyContactRelation: "Father",
    },
  ]);

  // --- MOCK APPOINTMENTS ---
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientId: 301,
      doctorId: 101,
      departmentId: 1,
      patientName: "Robert Paulson",
      doctorName: "Dr. John Doe",
      departmentName: "Cardiology",
      date: "2026-07-10",
      time: "10:30",
      type: "consultation",
      appointmentReason: "Routine heart checkup",
      status: "pending",
    },
    {
      id: 2,
      patientId: 302,
      doctorId: 102,
      departmentId: 2,
      patientName: "Emily Watson",
      doctorName: "Dr. Sarah Connor",
      departmentName: "Pediatrics",
      date: "2026-07-11",
      time: "14:00",
      type: "new_patient",
      appointmentReason: "Child fever recovery",
      status: "confirmed",
    },
    {
      id: 3,
      patientId: 303,
      doctorId: 101,
      departmentId: 1,
      patientName: "Michael Chen",
      doctorName: "Dr. John Doe",
      departmentName: "Cardiology",
      date: "2026-07-10",
      time: "09:30",
      type: "consultation",
      appointmentReason: "Persistent headache and dizziness for 3 days.",
      status: "confirmed",
    },
    {
      id: 4,
      patientId: 304,
      doctorId: 101,
      departmentId: 1,
      patientName: "Amara Okafor",
      doctorName: "Dr. John Doe",
      departmentName: "Cardiology",
      date: "2026-07-10",
      time: "11:00",
      type: "follow_up",
      appointmentReason: "Follow-up on hypertension medication dosage.",
      status: "confirmed",
    },
    {
      id: 5,
      patientId: 305,
      doctorId: null,
      departmentId: null,
      patientName: "Liam Fitzgerald",
      doctorName: "Not Assigned",
      departmentName: "Not Assigned",
      date: "2026-07-12",
      time: "14:15",
      type: "new_patient",
      appointmentReason: "First visit — general checkup requested.",
      status: "pending",
    },
    {
      id: 6,
      patientId: 306,
      doctorId: 101,
      departmentId: 1,
      patientName: "Priya Sharma",
      doctorName: "Dr. John Doe",
      departmentName: "Cardiology",
      date: "2026-07-07",
      time: "10:00",
      type: "consultation",
      appointmentReason: "Chest pain evaluation, referred by GP.",
      status: "completed",
    },
    {
      id: 7,
      patientId: 307,
      doctorId: 101,
      departmentId: 1,
      patientName: "Carlos Mendes",
      doctorName: "Dr. John Doe",
      departmentName: "Cardiology",
      date: "2026-07-09",
      time: "16:30",
      type: "follow_up",
      appointmentReason: "Post-surgery wound check.",
      status: "no_show",
    },
    {
      id: 8,
      patientId: 308,
      doctorId: 101,
      departmentId: 1,
      patientName: "Grace Kim",
      doctorName: "Dr. John Doe",
      departmentName: "Cardiology",
      date: "2026-07-15",
      time: "09:00",
      type: "consultation",
      appointmentReason: "Recurring migraines, wants referral to neurology.",
      status: "cancelled",
      cancelledReason: "Patient found an earlier slot elsewhere.",
    },
    {
      id: 9,
      patientId: 301,
      doctorId: 101,
      departmentId: 1,
      patientName: "Robert Paulson",
      doctorName: "Dr. John Doe",
      departmentName: "Cardiology",
      date: "2026-07-13",
      time: "13:45",
      type: "emergency",
      appointmentReason: "Sudden onset abdominal pain, high priority.",
      status: "confirmed",
    },
    {
      id: 10,
      patientId: 302,
      doctorId: 101,
      departmentId: 1,
      patientName: "Emily Watson",
      doctorName: "Dr. John Doe",
      departmentName: "Cardiology",
      date: "2026-07-03",
      time: "08:30",
      type: "new_patient",
      appointmentReason: "Annual physical exam.",
      status: "completed",
    },
  ]);

  // --- OPERATIONS ---

  // APPOINTMENTS
  const updateAppointmentStatus = (id, status, extraData = {}) => {
    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          let doctorName = app.doctorName;
          let departmentName = app.departmentName;
          if (extraData.doctorId) {
            const doc = doctors.find(
              (d) =>
                d.id === Number(extraData.doctorId) ||
                d.userId === Number(extraData.doctorId),
            );
            doctorName = doc
              ? `Dr. ${doc.firstName} ${doc.lastName}`
              : doctorName;
          }
          if (extraData.departmentId) {
            const dept = departments.find(
              (d) => d.id === Number(extraData.departmentId),
            );
            departmentName = dept ? dept.name : departmentName;
          }
          return {
            ...app,
            status,
            ...extraData,
            doctorName,
            departmentName,
          };
        }
        return app;
      }),
    );
    addNotification(
      `Appointment ID #${id} status updated to "${status.toUpperCase()}".`,
    );
  };

  // Receptionist routing step: assign doctor and/or department to a
  // pending, patient-self-booked appointment (mirrors assignDoctorAndDepartmentService)
  const assignDoctorAndDepartment = (id, { doctorId, departmentId } = {}) => {
    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        let doctorName = app.doctorName;
        let departmentName = app.departmentName;
        const updates = {};

        if (departmentId) {
          const dept = departments.find((d) => d.id === Number(departmentId));
          departmentName = dept ? dept.name : departmentName;
          updates.departmentId = Number(departmentId);
        }
        if (doctorId) {
          const doc = doctors.find(
            (d) => d.id === Number(doctorId) || d.userId === Number(doctorId),
          );
          doctorName = doc
            ? `Dr. ${doc.firstName} ${doc.lastName}`
            : doctorName;
          updates.doctorId = Number(doctorId);
        }

        return { ...app, ...updates, doctorName, departmentName };
      }),
    );
    addNotification(`Appointment ID #${id} routed to a doctor/department.`);
  };

  const deleteAppointment = (id) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id));
    addNotification(`Appointment ID #${id} deleted.`);
  };

  // DEPARTMENTS
  const createDepartment = (dept) => {
    const newId = departments.length
      ? Math.max(...departments.map((d) => d.id)) + 1
      : 1;
    const newDept = {
      id: newId,
      name: dept.name,
      description: dept.description || "",
      isActive: dept.isActive !== undefined ? dept.isActive : true,
    };
    setDepartments((prev) => [...prev, newDept]);
    addNotification(`Department "${dept.name}" created successfully.`);
    return newDept;
  };

  const updateDepartment = (id, updatedFields) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === id ? { ...dept, ...updatedFields } : dept,
      ),
    );
    addNotification(
      `Department details for "${updatedFields.name || id}" updated.`,
    );
  };

  const toggleDepartmentStatus = (id) => {
    let deptName = "";
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === id) {
          deptName = dept.name;
          return { ...dept, isActive: !dept.isActive };
        }
        return dept;
      }),
    );
    addNotification(`Department "${deptName || id}" status toggled.`);
  };

  const deleteDepartment = (id) => {
    const assignedReceptionist = receptionists.find(
      (r) => Number(r.departmentId) === Number(id),
    );
    if (assignedReceptionist) {
      throw new Error(
        `Cannot delete department: Receptionist "${assignedReceptionist.firstName} ${assignedReceptionist.lastName}" is assigned to it.`,
      );
    }
    const dept = departments.find((d) => d.id === id);
    setDepartments((prev) => prev.filter((dept) => dept.id !== id));
    addNotification(`Department "${dept?.name || id}" deleted.`);
  };

  // DOCTORS
  const createDoctor = (data) => {
    const newId = doctors.length
      ? Math.max(...doctors.map((d) => d.id)) + 1
      : 1;
    const newUserId = doctors.length
      ? Math.max(...doctors.map((d) => d.userId)) + 1
      : 101;
    const newDoc = {
      id: newId,
      userId: newUserId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      departmentId: Number(data.departmentId),
      specialization: data.specialization,
      qualification: data.qualification || "",
      experienceYears: Number(data.experienceYears) || 0,
      licenseNumber: data.licenseNumber || "",
      phone: data.phone || "",
      gender: data.gender || "male",
      dateOfBirth: data.dateOfBirth || "",
      address: data.address || "",
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      availableDays: data.availableDays || [],
      availableTimeStart: data.availableTimeStart || "",
      availableTimeEnd: data.availableTimeEnd || "",
      bio: data.bio || "",
    };
    setDoctors((prev) => [...prev, newDoc]);
    addNotification(
      `Dr. ${data.firstName} ${data.lastName} registered as clinical doctor.`,
    );
    return newDoc;
  };

  const updateDoctor = (userId, updatedFields) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.userId === userId ? { ...doc, ...updatedFields } : doc,
      ),
    );
    addNotification(
      `Doctor profile details for Dr. ${updatedFields.firstName || userId} updated.`,
    );
  };

  const toggleDoctorAvailability = (doctorId) => {
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === doctorId || doc.userId === doctorId) {
          const nextVal = !doc.isAvailable;
          addNotification(
            `Dr. ${doc.firstName} ${doc.lastName} availability toggled to ${nextVal ? "Available" : "Off-duty"}.`,
          );
          return { ...doc, isAvailable: nextVal };
        }
        return doc;
      }),
    );
  };

  const deleteDoctor = (userId) => {
    const doc = doctors.find((d) => d.userId === userId);
    setDoctors((prev) => prev.filter((doc) => doc.userId !== userId));
    addNotification(
      `Doctor Dr. ${doc?.firstName || ""} ${doc?.lastName || ""} profile deleted.`,
    );
  };

  // RECEPTIONISTS
  const createReceptionist = (data) => {
    const newId = receptionists.length
      ? Math.max(...receptionists.map((r) => r.id)) + 1
      : 1;
    const newUserId = receptionists.length
      ? Math.max(...receptionists.map((r) => r.userId)) + 1
      : 201;
    const newRec = {
      id: newId,
      userId: newUserId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      departmentId: Number(data.departmentId),
      phone: data.phone || "",
      shift: data.shift || "Morning",
      employeeCode: data.employeeCode || `REC0${newId}`,
      joinedDate: data.joinedDate || new Date().toISOString().split("T")[0],
    };
    setReceptionists((prev) => [...prev, newRec]);
    addNotification(
      `Receptionist ${data.firstName} ${data.lastName} registered.`,
    );
    return newRec;
  };

  const updateReceptionist = (userId, updatedFields) => {
    setReceptionists((prev) =>
      prev.map((rec) =>
        rec.userId === userId ? { ...rec, ...updatedFields } : rec,
      ),
    );
    addNotification(
      `Receptionist ${updatedFields.firstName || userId} details updated.`,
    );
  };

  const deleteReceptionist = (userId) => {
    const rec = receptionists.find((r) => r.userId === userId);
    setReceptionists((prev) => prev.filter((rec) => rec.userId !== userId));
    addNotification(
      `Receptionist ${rec?.firstName || ""} ${rec?.lastName || ""} details deleted.`,
    );
  };

  // PATIENTS
  const createPatient = (data) => {
    const newId = patients.length
      ? Math.max(...patients.map((p) => p.id)) + 1
      : 1;
    const newUserId = patients.length
      ? Math.max(...patients.map((p) => p.userId)) + 1
      : 301;
    const newPatient = {
      id: newId,
      userId: newUserId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      dateOfBirth: data.dateOfBirth || "",
      gender: data.gender || "male",
      bloodGroup: data.bloodGroup || "O+",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      maritalStatus: data.maritalStatus || "single",
      allergies: data.allergies || "",
      chronicConditions: data.chronicConditions || "",
      emergencyContactName: data.emergencyContactName || "",
      emergencyContactPhone: data.emergencyContactPhone || "",
      emergencyContactRelation: data.emergencyContactRelation || "",
    };
    setPatients((prev) => [...prev, newPatient]);
    addNotification(
      `Patient record for ${data.firstName} ${data.lastName} registered.`,
    );
    return newPatient;
  };

  const updatePatient = (userId, updatedFields) => {
    setPatients((prev) =>
      prev.map((p) => (p.userId === userId ? { ...p, ...updatedFields } : p)),
    );
    addNotification(
      `Patient profile ${updatedFields.firstName || userId} details updated.`,
    );
  };

  const deletePatient = (userId) => {
    const pat = patients.find((p) => p.userId === userId);
    setPatients((prev) => prev.filter((p) => p.userId !== userId));
    addNotification(
      `Patient profile for ${pat?.firstName || ""} ${pat?.lastName || ""} deleted.`,
    );
  };

  const bookAppointment = (data) => {
    const newId = appointments.length
      ? Math.max(...appointments.map((a) => a.id)) + 1
      : 1;
    const newPatientId = patients.length
      ? Math.max(...patients.map((p) => p.userId)) + 1
      : 301;

    const newPatientObj = {
      id: newPatientId - 300,
      userId: newPatientId,
      firstName: data.patientFirstName,
      lastName: data.patientLastName,
      email: data.patientEmail,
      phone: data.patientPhone,
      gender: data.patientGender || "male",
      dateOfBirth: data.patientDOB || "",
      bloodGroup: "O+",
      address: "",
      city: "",
    };

    setPatients((prev) => [...prev, newPatientObj]);

    const newApp = {
      id: newId,
      patientId: newPatientId,
      doctorId: null,
      departmentId: null,
      patientName: `${data.patientFirstName} ${data.patientLastName}`,
      doctorName: "Not Assigned",
      departmentName: "Not Assigned",
      date: data.date,
      time: data.time,
      type: data.type || "consultation",
      appointmentReason: data.appointmentReason || "",
      status: "pending",
    };

    setAppointments((prev) => [...prev, newApp]);
    addNotification(
      `New triage appointment request submitted by patient "${data.patientFirstName} ${data.patientLastName}".`,
    );
    return newApp;
  };

  return (
    <AdminContext.Provider
      value={{
        appointments,
        departments,
        doctors,
        receptionists,
        patients,
        notifications,
        updateAppointmentStatus,
        assignDoctorAndDepartment,
        deleteAppointment,
        createDepartment,
        updateDepartment,
        toggleDepartmentStatus,
        deleteDepartment,
        createDoctor,
        updateDoctor,
        toggleDoctorAvailability,
        deleteDoctor,
        createReceptionist,
        updateReceptionist,
        deleteReceptionist,
        createPatient,
        updatePatient,
        deletePatient,
        bookAppointment,
        markAllNotificationsAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
