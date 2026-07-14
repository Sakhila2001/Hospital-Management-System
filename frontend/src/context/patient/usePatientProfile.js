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

/**
 * Fetches and manages the logged-in patient's own profile.
 * Waits for auth to finish before fetching.
 */
export default function usePatientProfile({ user, authLoading }) {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await api.get("/patients/me/profile");
      const raw = res.data.data.patient;
      setProfile(normalizePatient(raw));
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load patient profile";
      setProfileError(message);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfile();
    } else if (!authLoading && !user) {
      setProfileLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const updateProfile = async (updatedFields) => {
    try {
      const res = await api.put("/patients/me/profile", updatedFields);
      const normalized = normalizePatient(res.data.data.patient);
      setProfile(normalized);
      return normalized;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update profile";
      throw new Error(message);
    }
  };

  return {
    profile,
    profileLoading,
    profileError,
    fetchProfile,
    updateProfile,
  };
}
