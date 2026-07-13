import { useState, useEffect } from "react";
import api from "../../api/axios";
import { normalizeAppointment } from "../../utils/normalizeAppointment";

/**
 * Admin appointments hook — fetches ALL appointments from the backend.
 * Admin can: confirm, cancel, complete, assign doctor/department, delete.
 */
export default function useAppointments({ addNotification, user, authLoading }) {
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);

  const fetchAppointments = async () => {
    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      const res = await api.get("/appointments");
      const raw = res.data.data.appointments || [];
      setAppointments(raw.map(normalizeAppointment));
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load appointments";
      setAppointmentsError(message);
      addNotification(`Error loading appointments: ${message}`);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchAppointments();
    } else if (!authLoading && !user) {
      setAppointmentsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  /**
   * Update appointment status via backend.
   * extraData may contain: { cancelledReason, doctorId, departmentId }
   */
  const updateAppointmentStatus = async (id, status, extraData = {}) => {
    try {
      const res = await api.patch(`/appointments/${id}/status`, {
        status,
        ...extraData,
      });
      const updated = normalizeAppointment(res.data.data.appointment);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      addNotification(`Appointment #${id} status updated to "${status.toUpperCase()}".`);
      return updated;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update appointment status";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  /**
   * Assign doctor and department to a pending appointment (admin triage routing).
   */
  const assignDoctorAndDepartment = async (id, { doctorId, departmentId } = {}) => {
    try {
      const res = await api.patch(`/appointments/${id}/assign`, {
        ...(doctorId ? { doctorId: Number(doctorId) } : {}),
        ...(departmentId ? { departmentId: Number(departmentId) } : {}),
      });
      const updated = normalizeAppointment(res.data.data.appointment);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      addNotification(`Appointment #${id} routed to a doctor/department.`);
      return updated;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to assign doctor/department";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  /**
   * Delete an appointment (admin only).
   */
  const deleteAppointment = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      addNotification(`Appointment #${id} deleted.`);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete appointment";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  /**
   * Book a new appointment via the backend (receptionist/patient flow).
   * Admin uses this less frequently, but it's kept for completeness.
   */
  const bookAppointment = async (data) => {
    try {
      const res = await api.post("/appointments", data);
      const normalized = normalizeAppointment(res.data.data.appointment);
      setAppointments((prev) => [...prev, normalized]);
      addNotification(`New appointment booked.`);
      return normalized;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to book appointment";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  return {
    appointments,
    appointmentsLoading,
    appointmentsError,
    fetchAppointments,
    updateAppointmentStatus,
    assignDoctorAndDepartment,
    deleteAppointment,
    bookAppointment,
  };
}