import { useState, useEffect } from "react";
import api from "../../api/axios";

const normalizeDoctor = (doctorObj, userObj) => {
  const u = userObj || doctorObj.User || doctorObj.user;
  return {
    ...doctorObj,
    firstName: u?.firstName ?? doctorObj.firstName,
    lastName: u?.lastName ?? doctorObj.lastName,
    email: u?.email ?? doctorObj.email,
    isActive: u?.isActive ?? doctorObj.isActive,
  };
};

export default function useDoctors({ user, authLoading, addNotification }) {
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState(null);

  const fetchDoctors = async () => {
    setDoctorsLoading(true);
    setDoctorsError(null);
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data.data.doctors.map((d) => normalizeDoctor(d)));
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load doctors";
      setDoctorsError(message);
      addNotification(`Error loading doctors: ${message}`);
    } finally {
      setDoctorsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchDoctors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const createDoctor = async (data) => {
    try {
      const res = await api.post("/doctors/admin", data);
      const { user: newUser, doctor: newDoctor } = res.data.data;
      const normalized = normalizeDoctor(newDoctor, newUser);
      setDoctors((prev) => [...prev, normalized]);
      addNotification(`Dr. ${newUser.firstName} ${newUser.lastName} registered as clinical doctor.`);
      return normalized;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create doctor";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  const updateDoctor = async (userId, updatedFields) => {
    try {
      const res = await api.put(`/doctors/${userId}`, updatedFields);
      const normalized = normalizeDoctor(res.data.data.doctor);
      setDoctors((prev) => prev.map((d) => (d.userId === userId ? normalized : d)));
      addNotification(`Doctor profile details for Dr. ${normalized.firstName || userId} updated.`);
      return normalized;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update doctor";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  const deleteDoctor = async (userId) => {
    const doc = doctors.find((d) => d.userId === userId);
    try {
      await api.delete(`/doctors/${userId}`);
      setDoctors((prev) => prev.filter((d) => d.userId !== userId));
      addNotification(`Doctor Dr. ${doc?.firstName || ""} ${doc?.lastName || ""} profile deleted.`);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete doctor";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  const toggleDoctorAvailability = async (userId) => {
    try {
      const res = await api.patch(`/doctors/${userId}/availability`);
      const normalized = normalizeDoctor(res.data.data.doctor);
      setDoctors((prev) => prev.map((d) => (d.userId === userId ? normalized : d)));
      addNotification(
        `Dr. ${normalized.firstName} ${normalized.lastName} availability toggled to ${
          normalized.isAvailable ? "Available" : "Off-duty"
        }.`,
      );
      return normalized;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to toggle doctor availability";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  return {
    doctors,
    doctorsLoading,
    doctorsError,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    toggleDoctorAvailability,
  };
}