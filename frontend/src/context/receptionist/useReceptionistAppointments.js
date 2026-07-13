import { useState, useEffect } from "react";
import api from "../../api/axios";
import { normalizeAppointment } from "../../utils/normalizeAppointment";

const normalizePatient = (patObj) => {
  const u = patObj.User || patObj.user;
  return {
    ...patObj,
    firstName: u?.firstName ?? patObj.firstName,
    lastName: u?.lastName ?? patObj.lastName,
    email: u?.email ?? patObj.email,
    isActive: u?.isActive ?? patObj.isActive,
  };
};

/**
 * Receptionist appointments + patients hook.
 * Waits for auth before fetching.
 */
export default function useReceptionistAppointments({ user, authLoading }) {
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);

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

  const fetchPatients = async () => {
    setPatientsLoading(true);
    try {
      const res = await api.get("/patients");
      const raw = res.data.data.patients || [];
      setPatients(raw.map(normalizePatient));
    } catch {
      // non-fatal
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchAppointments();
      fetchPatients();
    } else if (!authLoading && !user) {
      setAppointmentsLoading(false);
      setPatientsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  /**
   * Assign doctor + department to pending appointment, then confirm it.
   */
  const assignDoctorAndDepartment = async (
    appointmentId,
    { doctorId, departmentId, appointmentReason }
  ) => {
    try {
      // Step 1: assign doctor + department
      await api.patch(`/appointments/${appointmentId}/assign`, {
        doctorId: Number(doctorId),
        departmentId: Number(departmentId),
      });

      // Step 2: confirm
      const confirmRes = await api.patch(
        `/appointments/${appointmentId}/status`,
        {
          status: "confirmed",
          doctorId: Number(doctorId),
          ...(appointmentReason ? { appointmentReason } : {}),
        }
      );

      const updated = normalizeAppointment(confirmRes.data.data.appointment);
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? updated : a))
      );
      return updated;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to assign doctor/department";
      throw new Error(message);
    }
  };

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

  const createAppointment = async (data) => {
    try {
      const res = await api.post("/appointments", data);
      const normalized = normalizeAppointment(res.data.data.appointment);
      setAppointments((prev) => [...prev, normalized]);
      return normalized;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create appointment";
      throw new Error(message);
    }
  };

  const createPatient = async (data) => {
    try {
      const res = await api.post("/patients/admin", data);
      const { patient: newPatient, user: newUser } = res.data.data;
      const normalized = normalizePatient({ ...newPatient, User: newUser });
      setPatients((prev) => [...prev, normalized]);
      return normalized;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create patient";
      throw new Error(message);
    }
  };

  const updatePatient = async (userId, updatedFields) => {
    try {
      const res = await api.put(`/patients/${userId}`, updatedFields);
      const normalized = normalizePatient(res.data.data.patient);
      setPatients((prev) =>
        prev.map((p) => (p.userId === userId ? normalized : p))
      );
      return normalized;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update patient";
      throw new Error(message);
    }
  };

  const deletePatient = async (userId) => {
    try {
      await api.delete(`/patients/${userId}`);
      setPatients((prev) => prev.filter((p) => p.userId !== userId));
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete patient";
      throw new Error(message);
    }
  };

  const proposeReschedule = async (appointmentId, data) => {
    try {
      const res = await api.post(`/appointments/${appointmentId}/reschedule-request`, data);
      const updated = normalizeAppointment(res.data.data.appointment);
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? updated : a))
      );
      return updated;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to propose reschedule request";
      throw new Error(message);
    }
  };

  const rejectRescheduleRequest = async (appointmentId) => {
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
    assignDoctorAndDepartment,
    updateAppointmentStatus,
    createAppointment,
    proposeReschedule,
    rejectRescheduleRequest,
    patients,
    patientsLoading,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
}
