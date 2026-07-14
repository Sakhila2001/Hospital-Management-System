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

/**
 * Fetches and manages the logged-in doctor's own profile.
 * Waits for auth to finish before fetching (avoids 401 race condition).
 */
export default function useDoctorProfile({ user, authLoading }) {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await api.get("/doctors/me/profile");
      const raw = res.data.data.doctor;
      setProfile(normalizeDoctor(raw));
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load doctor profile";
      setProfileError(message);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth to complete before making API calls
    if (!authLoading && user) {
      fetchProfile();
    } else if (!authLoading && !user) {
      // Not authenticated — stop loading
      setProfileLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const updateProfile = async (updatedFields) => {
    try {
      const res = await api.put("/doctors/me/profile", updatedFields);
      const normalized = normalizeDoctor(res.data.data.doctor);
      setProfile(normalized);
      return normalized;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update profile";
      throw new Error(message);
    }
  };

  const toggleAvailability = async () => {
    if (!profile) return;
    try {
      const res = await api.patch(`/doctors/${profile.userId}/availability`);
      const normalized = normalizeDoctor(res.data.data.doctor);
      setProfile(normalized);
      return normalized;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to toggle availability";
      throw new Error(message);
    }
  };

  return {
    profile,
    profileLoading,
    profileError,
    fetchProfile,
    updateProfile,
    toggleAvailability,
  };
}
