import { useState, useEffect } from "react";
import api from "../../api/axios";

const normalizeReceptionist = (recObj, userObj) => {
  const u = userObj || recObj.User || recObj.user;
  return {
    ...recObj,
    firstName: u?.firstName ?? recObj.firstName,
    lastName: u?.lastName ?? recObj.lastName,
    email: u?.email ?? recObj.email,
    isActive: u?.isActive ?? recObj.isActive,
  };
};

/**
 * Fetches and manages the logged-in receptionist's own profile.
 * Waits for auth before fetching.
 */
export default function useReceptionistProfile({ user, authLoading }) {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await api.get("/receptionists/me/profile");
      const raw = res.data.data.receptionist;
      setProfile(normalizeReceptionist(raw));
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load receptionist profile";
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
      const res = await api.put("/receptionists/me/profile", updatedFields);
      const normalized = normalizeReceptionist(res.data.data.receptionist);
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
