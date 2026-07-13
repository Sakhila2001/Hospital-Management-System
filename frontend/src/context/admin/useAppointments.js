import { useState } from "react";

export default function useAppointments({ addNotification, doctors, departments, setPatients, patients }) {
  const [appointments, setAppointments] = useState([
    { id: 1, patientId: 301, doctorId: 101, departmentId: 1, patientName: "Robert Paulson", doctorName: "Dr. John Doe", departmentName: "Cardiology", date: "2026-07-10", time: "10:30", type: "consultation", appointmentReason: "Routine heart checkup", status: "pending" },
    { id: 2, patientId: 302, doctorId: 102, departmentId: 2, patientName: "Emily Watson", doctorName: "Dr. Sarah Connor", departmentName: "Pediatrics", date: "2026-07-11", time: "14:00", type: "new_patient", appointmentReason: "Child fever recovery", status: "confirmed" },
    { id: 3, patientId: 303, doctorId: 101, departmentId: 1, patientName: "Michael Chen", doctorName: "Dr. John Doe", departmentName: "Cardiology", date: "2026-07-10", time: "09:30", type: "consultation", appointmentReason: "Persistent headache and dizziness for 3 days.", status: "confirmed" },
    { id: 4, patientId: 304, doctorId: 101, departmentId: 1, patientName: "Amara Okafor", doctorName: "Dr. John Doe", departmentName: "Cardiology", date: "2026-07-10", time: "11:00", type: "follow_up", appointmentReason: "Follow-up on hypertension medication dosage.", status: "confirmed" },
    { id: 5, patientId: 305, doctorId: null, departmentId: null, patientName: "Liam Fitzgerald", doctorName: "Not Assigned", departmentName: "Not Assigned", date: "2026-07-12", time: "14:15", type: "new_patient", appointmentReason: "First visit — general checkup requested.", status: "pending" },
    { id: 6, patientId: 306, doctorId: 101, departmentId: 1, patientName: "Priya Sharma", doctorName: "Dr. John Doe", departmentName: "Cardiology", date: "2026-07-07", time: "10:00", type: "consultation", appointmentReason: "Chest pain evaluation, referred by GP.", status: "completed" },
    { id: 7, patientId: 307, doctorId: 101, departmentId: 1, patientName: "Carlos Mendes", doctorName: "Dr. John Doe", departmentName: "Cardiology", date: "2026-07-09", time: "16:30", type: "follow_up", appointmentReason: "Post-surgery wound check.", status: "no_show" },
    { id: 8, patientId: 308, doctorId: 101, departmentId: 1, patientName: "Grace Kim", doctorName: "Dr. John Doe", departmentName: "Cardiology", date: "2026-07-15", time: "09:00", type: "consultation", appointmentReason: "Recurring migraines, wants referral to neurology.", status: "cancelled", cancelledReason: "Patient found an earlier slot elsewhere." },
    { id: 9, patientId: 301, doctorId: 101, departmentId: 1, patientName: "Robert Paulson", doctorName: "Dr. John Doe", departmentName: "Cardiology", date: "2026-07-13", time: "13:45", type: "emergency", appointmentReason: "Sudden onset abdominal pain, high priority.", status: "confirmed" },
    { id: 10, patientId: 302, doctorId: 101, departmentId: 1, patientName: "Emily Watson", doctorName: "Dr. John Doe", departmentName: "Cardiology", date: "2026-07-03", time: "08:30", type: "new_patient", appointmentReason: "Annual physical exam.", status: "completed" },
  ]);

  const updateAppointmentStatus = (id, status, extraData = {}) => {
    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        let doctorName = app.doctorName;
        let departmentName = app.departmentName;
        if (extraData.doctorId) {
          const doc = doctors.find((d) => d.id === Number(extraData.doctorId) || d.userId === Number(extraData.doctorId));
          doctorName = doc ? `Dr. ${doc.firstName} ${doc.lastName}` : doctorName;
        }
        if (extraData.departmentId) {
          const dept = departments.find((d) => d.id === Number(extraData.departmentId));
          departmentName = dept ? dept.name : departmentName;
        }
        return { ...app, status, ...extraData, doctorName, departmentName };
      }),
    );
    addNotification(`Appointment ID #${id} status updated to "${status.toUpperCase()}".`);
  };

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
          const doc = doctors.find((d) => d.id === Number(doctorId) || d.userId === Number(doctorId));
          doctorName = doc ? `Dr. ${doc.firstName} ${doc.lastName}` : doctorName;
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

  const bookAppointment = (data) => {
    const newId = appointments.length ? Math.max(...appointments.map((a) => a.id)) + 1 : 1;
    const newPatientId = patients.length ? Math.max(...patients.map((p) => p.userId)) + 1 : 301;

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
    addNotification(`New triage appointment request submitted by patient "${data.patientFirstName} ${data.patientLastName}".`);
    return newApp;
  };

  return {
    appointments,
    updateAppointmentStatus,
    assignDoctorAndDepartment,
    deleteAppointment,
    bookAppointment,
  };
}