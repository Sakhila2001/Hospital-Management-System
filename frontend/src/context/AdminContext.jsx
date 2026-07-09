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
    { id: 1, message: "Welcome to City Care Admin Portal.", time: "Just now", read: false },
    { id: 2, message: "Dr. Sarah Connor availability toggled to Available.", time: "1 hour ago", read: true },
    { id: 3, message: "New appointment booked by patient Robert Paulson.", time: "2 hours ago", read: true }
  ]);

  const addNotification = (message) => {
    setNotifications((prev) => [
      { id: Date.now(), message, time: "Just now", read: false },
      ...prev
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
    { id: 1, name: "Cardiology", description: "Heart care services and specialized cardiovascular surgery.", isActive: true },
    { id: 2, name: "Pediatrics", description: "Medical care for infants, children, and adolescents.", isActive: true },
    { id: 3, name: "Neurology", description: "Diagnosis and treatment of brain and nervous system disorders.", isActive: true },
    { id: 4, name: "Orthopedics", description: "Bone, joint, ligament, and muscle treatment and surgery.", isActive: false },
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
      bio: "Senior Cardiologist dedicated to compassionate cardiac care and research."
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
      bio: "Friendly pediatrician specializing in newborn and infant health monitoring."
    }
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
      joinedDate: "2024-01-10"
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
      joinedDate: "2024-02-15"
    }
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
      nationalId: "NID12345",
      maritalStatus: "single",
      allergies: "Penicillin",
      chronicConditions: "Hypertension",
      emergencyContactName: "Jane Paulson",
      emergencyContactPhone: "9876543231",
      emergencyContactRelation: "Sister"
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
      nationalId: "NID54321",
      maritalStatus: "married",
      allergies: "None",
      chronicConditions: "Asthma",
      emergencyContactName: "David Watson",
      emergencyContactPhone: "9876543233",
      emergencyContactRelation: "Spouse"
    }
  ]);

  // --- MOCK APPOINTMENTS ---
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientId: 301,
      doctorId: 101,
      patientName: "Robert Paulson",
      doctorName: "Dr. John Doe",
      departmentName: "Cardiology",
      date: "2026-07-10",
      time: "10:30",
      status: "pending"
    },
    {
      id: 2,
      patientId: 302,
      doctorId: 102,
      patientName: "Emily Watson",
      doctorName: "Dr. Sarah Connor",
      departmentName: "Pediatrics",
      date: "2026-07-11",
      time: "14:00",
      status: "confirmed"
    }
  ]);

  // --- OPERATIONS ---

  // APPOINTMENTS
  const updateAppointmentStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    addNotification(`Appointment ID #${id} status updated to "${status.toUpperCase()}".`);
  };

  const deleteAppointment = (id) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id));
    addNotification(`Appointment ID #${id} deleted.`);
  };

  // DEPARTMENTS
  const createDepartment = (dept) => {
    const newId = departments.length ? Math.max(...departments.map((d) => d.id)) + 1 : 1;
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
      prev.map((dept) => (dept.id === id ? { ...dept, ...updatedFields } : dept))
    );
    addNotification(`Department details for "${updatedFields.name || id}" updated.`);
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
      })
    );
    addNotification(`Department "${deptName || id}" status toggled.`);
  };

  const deleteDepartment = (id) => {
    const assignedReceptionist = receptionists.find(
      (r) => Number(r.departmentId) === Number(id)
    );
    if (assignedReceptionist) {
      throw new Error(
        `Cannot delete department: Receptionist "${assignedReceptionist.firstName} ${assignedReceptionist.lastName}" is assigned to it.`
      );
    }
    const dept = departments.find((d) => d.id === id);
    setDepartments((prev) => prev.filter((dept) => dept.id !== id));
    addNotification(`Department "${dept?.name || id}" deleted.`);
  };

  // DOCTORS
  const createDoctor = (data) => {
    const newId = doctors.length ? Math.max(...doctors.map((d) => d.id)) + 1 : 1;
    const newUserId = doctors.length ? Math.max(...doctors.map((d) => d.userId)) + 1 : 101;
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
    addNotification(`Dr. ${data.firstName} ${data.lastName} registered as clinical doctor.`);
    return newDoc;
  };

  const updateDoctor = (userId, updatedFields) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.userId === userId ? { ...doc, ...updatedFields } : doc))
    );
    addNotification(`Doctor profile details for Dr. ${updatedFields.firstName || userId} updated.`);
  };

  const deleteDoctor = (userId) => {
    const doc = doctors.find((d) => d.userId === userId);
    setDoctors((prev) => prev.filter((doc) => doc.userId !== userId));
    addNotification(`Doctor Dr. ${doc?.firstName || ""} ${doc?.lastName || ""} profile deleted.`);
  };

  // RECEPTIONISTS
  const createReceptionist = (data) => {
    const newId = receptionists.length ? Math.max(...receptionists.map((r) => r.id)) + 1 : 1;
    const newUserId = receptionists.length ? Math.max(...receptionists.map((r) => r.userId)) + 1 : 201;
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
    addNotification(`Receptionist ${data.firstName} ${data.lastName} registered.`);
    return newRec;
  };

  const updateReceptionist = (userId, updatedFields) => {
    setReceptionists((prev) =>
      prev.map((rec) => (rec.userId === userId ? { ...rec, ...updatedFields } : rec))
    );
    addNotification(`Receptionist ${updatedFields.firstName || userId} details updated.`);
  };

  const deleteReceptionist = (userId) => {
    const rec = receptionists.find((r) => r.userId === userId);
    setReceptionists((prev) => prev.filter((rec) => rec.userId !== userId));
    addNotification(`Receptionist ${rec?.firstName || ""} ${rec?.lastName || ""} details deleted.`);
  };

  // PATIENTS
  const createPatient = (data) => {
    const newId = patients.length ? Math.max(...patients.map((p) => p.id)) + 1 : 1;
    const newUserId = patients.length ? Math.max(...patients.map((p) => p.userId)) + 1 : 301;
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
      nationalId: data.nationalId || "",
      maritalStatus: data.maritalStatus || "single",
      allergies: data.allergies || "",
      chronicConditions: data.chronicConditions || "",
      emergencyContactName: data.emergencyContactName || "",
      emergencyContactPhone: data.emergencyContactPhone || "",
      emergencyContactRelation: data.emergencyContactRelation || "",
    };
    setPatients((prev) => [...prev, newPatient]);
    addNotification(`Patient record for ${data.firstName} ${data.lastName} registered.`);
    return newPatient;
  };

  const updatePatient = (userId, updatedFields) => {
    setPatients((prev) =>
      prev.map((p) => (p.userId === userId ? { ...p, ...updatedFields } : p))
    );
    addNotification(`Patient profile ${updatedFields.firstName || userId} details updated.`);
  };

  const deletePatient = (userId) => {
    const pat = patients.find((p) => p.userId === userId);
    setPatients((prev) => prev.filter((p) => p.userId !== userId));
    addNotification(`Patient profile for ${pat?.firstName || ""} ${pat?.lastName || ""} deleted.`);
  };

  const bookAppointment = (data) => {
    const newId = appointments.length ? Math.max(...appointments.map((a) => a.id)) + 1 : 1;
    const newPatientId = patients.length ? Math.max(...patients.map((p) => p.userId)) + 1 : 301;
    
    const doctorObj = doctors.find(d => d.userId === Number(data.doctorId));
    const doctorName = doctorObj ? `Dr. ${doctorObj.firstName} ${doctorObj.lastName}` : "General Doctor";
    
    const deptId = doctorObj ? doctorObj.departmentId : (data.departmentId ? Number(data.departmentId) : 1);
    const deptObj = departments.find(d => d.id === deptId);
    const deptName = deptObj ? deptObj.name : "General Care";

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
      nationalId: `NID${newPatientId}`,
    };
    
    setPatients((prev) => [...prev, newPatientObj]);

    const newApp = {
      id: newId,
      patientId: newPatientId,
      doctorId: Number(data.doctorId),
      patientName: `${data.patientFirstName} ${data.patientLastName}`,
      doctorName: doctorName,
      departmentName: deptName,
      date: data.date,
      time: data.time,
      status: "pending"
    };

    setAppointments((prev) => [...prev, newApp]);
    addNotification(`New appointment booked by patient "${data.patientFirstName} ${data.patientLastName}" (Awaiting confirm).`);
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
        deleteAppointment,
        createDepartment,
        updateDepartment,
        toggleDepartmentStatus,
        deleteDepartment,
        createDoctor,
        updateDoctor,
        deleteDoctor,
        createReceptionist,
        updateReceptionist,
        deleteReceptionist,
        createPatient,
        updatePatient,
        deletePatient,
        bookAppointment,
        markAllNotificationsAsRead,
        clearAllNotifications
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
