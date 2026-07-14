/**
 * Normalizes a raw appointment object from the backend API into a flat
 * shape expected by all frontend pages (doctor, patient, receptionist, admin).
 *
 * Backend returns nested associations:
 *   appointment.Patient.User  → patient name/email
 *   appointment.Doctor.User   → doctor name/email
 *   appointment.Department    → dept name
 *   appointment.appointmentDate / appointmentTime  (not "date"/"time")
 */
export const normalizeAppointment = (appt) => ({
  id: appt.id,
  patientId: appt.patientId,
  doctorId: appt.doctorId,
  departmentId: appt.departmentId,
  patientName: appt.Patient?.User
    ? `${appt.Patient.User.firstName} ${appt.Patient.User.lastName}`
    : appt.Patient?.firstName
      ? `${appt.Patient.firstName} ${appt.Patient.lastName}`
      : "Unknown",
  patientUserId: appt.Patient?.userId ?? appt.Patient?.User?.id ?? null,
  doctorName: appt.Doctor?.User
    ? `Dr. ${appt.Doctor.User.firstName} ${appt.Doctor.User.lastName}`
    : appt.Doctor?.firstName
      ? `Dr. ${appt.Doctor.firstName} ${appt.Doctor.lastName}`
      : "Not Assigned",
  departmentName: appt.Department?.name || "Not Assigned",
  date: appt.appointmentDate,   // normalise field name for frontend
  time: appt.appointmentTime,
  type: appt.appointmentType || appt.type || "consultation",
  appointmentReason: appt.appointmentReason || "",
  status: appt.status,
  cancelledReason: appt.cancelledReason || "",
  cancelledAt: appt.cancelledAt || null,
  createdAt: appt.createdAt,
  // Full patient clinical profile (for doctor's patient record modal)
  patientEmail: appt.Patient?.User?.email || null,
  patientPhone: appt.Patient?.phone || null,
  patientGender: appt.Patient?.gender || null,
  patientDob: appt.Patient?.dateOfBirth || null,
  bloodGroup: appt.Patient?.bloodGroup || null,
  allergies: appt.Patient?.allergies || null,
  chronicConditions: appt.Patient?.chronicConditions || null,
  emergencyContactName: appt.Patient?.emergencyContactName || null,
  emergencyContactPhone: appt.Patient?.emergencyContactPhone || null,
  emergencyContactRelation: appt.Patient?.emergencyContactRelation || null,
  patientAddress: appt.Patient?.address || null,
  patientCity: appt.Patient?.city || null,
  // Proposals
  rescheduleRequested: appt.rescheduleRequested || false,
  proposedDate: appt.proposedDate || null,
  proposedTime: appt.proposedTime || null,
  proposedDoctorId: appt.proposedDoctorId || null,
  proposedDepartmentId: appt.proposedDepartmentId || null,
  proposedDoctorName: appt.ProposedDoctor?.User
    ? `Dr. ${appt.ProposedDoctor.User.firstName} ${appt.ProposedDoctor.User.lastName}`
    : appt.ProposedDoctor?.firstName
      ? `Dr. ${appt.ProposedDoctor.firstName} ${appt.ProposedDoctor.lastName}`
      : "Not Assigned",
  proposedDepartmentName: appt.ProposedDepartment?.name || "Not Assigned",
  rescheduleReason: appt.rescheduleReason || "",
});
