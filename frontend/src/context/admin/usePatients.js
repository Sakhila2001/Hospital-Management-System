import { useState, useEffect } from "react";
import api from "../../api/axios";

const normalizePatient = (patObj, userObj) => {
  const u = userObj || patObj.User || patObj.user;
  return {
    ...patObj,
    firstName: u?.firstName ?? patObj.firstName,
    lastName: u?.lastName ?? patObj.lastName,
    email: u?.email ?? patObj.email,
    isActive: u?.isActive ?? patObj.isActive,
  };
};

export default function usePatients({ user, authLoading, addNotification }) {
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState(null);

  const fetchPatients = async () => {
    setPatientsLoading(true);
    setPatientsError(null);
    try {
      const res = await api.get("/patients");
      const list = res.data.data.patients.map((p) => normalizePatient(p));
      setPatients(list);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load patients";
      setPatientsError(message);
      addNotification(`Error loading patients: ${message}`);
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchPatients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const createPatient = async (data) => {
    try {
      const res = await api.post("/patients/admin", data);
      const { user: newUser, patient: newPatient } = res.data.data;
      const normalized = normalizePatient(newPatient, newUser);
      setPatients((prev) => [...prev, normalized]);
      addNotification(
        `Patient record for ${newUser.firstName} ${newUser.lastName} registered.`,
      );
      return normalized;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create patient";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  const updatePatient = async (userId, updatedFields) => {
    try {
      const res = await api.put(`/patients/${userId}`, updatedFields);
      const normalized = normalizePatient(res.data.data.patient);
      setPatients((prev) =>
        prev.map((p) => (p.userId === userId ? normalized : p)),
      );
      addNotification(
        `Patient profile ${normalized.firstName || userId} details updated.`,
      );
      return normalized;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update patient";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  const deletePatient = async (userId) => {
    const pat = patients.find((p) => p.userId === userId);
    try {
      await api.delete(`/patients/${userId}`);
      setPatients((prev) => prev.filter((p) => p.userId !== userId));
      addNotification(
        `Patient profile for ${pat?.firstName || ""} ${pat?.lastName || ""} deleted.`,
      );
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete patient";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  return {
    patients,
    patientsLoading,
    patientsError,
    fetchPatients,
    setPatients, // still needed by useAppointments' bookAppointment
    createPatient,
    updatePatient,
    deletePatient,
  };
}