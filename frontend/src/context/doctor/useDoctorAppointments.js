import { useState, useEffect } from "react";
import api from "../../api/axios";
import { normalizeAppointment } from "../../utils/normalizeAppointment";

/**
 * Fetches and manages appointments for the logged-in doctor.
 * Waits for auth to finish before fetching (avoids 401 race condition).
 */
export default function useDoctorAppointments({ user, authLoading }) {
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
      const message =
        err.response?.data?.message || "Failed to load appointments";
      setAppointmentsError(message);
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
   * Doctor can only set: "completed" or "no_show"
   */
  const updateAppointmentStatus = async (
    appointmentId,
    status,
    extraData = {}
  ) => {
    try {
      const res = await api.patch(`/appointments/${appointmentId}/status`, {
        status,
        ...extraData,
      });
      const updated = normalizeAppointment(res.data.data.appointment);
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? updated : a))
      );
      return updated;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update appointment status";
      throw new Error(message);
    }
  };

  return {
    appointments,
    appointmentsLoading,
    appointmentsError,
    fetchAppointments,
    updateAppointmentStatus,
  };
}
