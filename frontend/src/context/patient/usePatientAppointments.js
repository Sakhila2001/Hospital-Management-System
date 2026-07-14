import { useState, useEffect } from "react";
import api from "../../api/axios";
import { normalizeAppointment } from "../../utils/normalizeAppointment";

/**
 * Fetches patient appointments and provides book/cancel operations.
 * Waits for auth before fetching.
 */
export default function usePatientAppointments({ user, authLoading }) {
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

  const bookAppointment = async ({ date, time, type, appointmentReason }) => {
    try {
      const res = await api.post("/appointments", {
        appointmentDate: date,
        appointmentTime: time,
        type,
        appointmentReason,
      });
      const normalized = normalizeAppointment(res.data.data.appointment);
      setAppointments((prev) => [...prev, normalized]);
      return normalized;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to book appointment";
      throw new Error(message);
    }
  };

  const cancelAppointment = async (appointmentId, cancelledReason) => {
    try {
      const res = await api.patch(`/appointments/${appointmentId}/status`, {
        status: "cancelled",
        cancelledReason,
      });
      const updated = normalizeAppointment(res.data.data.appointment);
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? updated : a))
      );
      return updated;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to cancel appointment";
      throw new Error(message);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId,
    status,
    extraData = {}
  ) => {
    if (status === "cancelled") {
      return cancelAppointment(appointmentId, extraData.cancelledReason);
    }
    throw new Error("Patients can only cancel appointments");
  };

  const acceptReschedule = async (appointmentId) => {
    try {
      const res = await api.post(`/appointments/${appointmentId}/reschedule-accept`);
      const updated = normalizeAppointment(res.data.data.appointment);
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? updated : a))
      );
      return updated;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to accept reschedule request";
      throw new Error(message);
    }
  };

  const rejectReschedule = async (appointmentId) => {
    try {
      const res = await api.post(`/appointments/${appointmentId}/reschedule-reject`);
      const updated = normalizeAppointment(res.data.data.appointment);
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? updated : a))
      );
      return updated;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to reject reschedule request";
      throw new Error(message);
    }
  };

  return {
    appointments,
    appointmentsLoading,
    appointmentsError,
    fetchAppointments,
    bookAppointment,
    cancelAppointment,
    updateAppointmentStatus,
    acceptReschedule,
    rejectReschedule,
  };
}
