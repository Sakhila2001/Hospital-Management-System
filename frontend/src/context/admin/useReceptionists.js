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

export default function useReceptionists({ user, authLoading, addNotification }) {
  const [receptionists, setReceptionists] = useState([]);
  const [receptionistsLoading, setReceptionistsLoading] = useState(true);
  const [receptionistsError, setReceptionistsError] = useState(null);

  const fetchReceptionists = async () => {
    setReceptionistsLoading(true);
    setReceptionistsError(null);
    try {
      const res = await api.get("/receptionists");
      const list = res.data.data.receptionists.map((r) => normalizeReceptionist(r));
      setReceptionists(list);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load receptionists";
      setReceptionistsError(message);
      addNotification(`Error loading receptionists: ${message}`);
    } finally {
      setReceptionistsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchReceptionists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const createReceptionist = async (data) => {
    try {
      const res = await api.post("/receptionists/admin", data);
      const { user: newUser, receptionist: newRec } = res.data.data;
      const normalized = normalizeReceptionist(newRec, newUser);
      setReceptionists((prev) => [...prev, normalized]);
      addNotification(
        `Receptionist ${newUser.firstName} ${newUser.lastName} registered.`,
      );
      return normalized;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create receptionist";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  const updateReceptionist = async (userId, updatedFields) => {
    try {
      const res = await api.put(`/receptionists/${userId}`, updatedFields);
      const normalized = normalizeReceptionist(res.data.data.receptionist);
      setReceptionists((prev) =>
        prev.map((r) => (r.userId === userId ? normalized : r)),
      );
      addNotification(
        `Receptionist ${normalized.firstName || userId} details updated.`,
      );
      return normalized;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update receptionist";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  const deleteReceptionist = async (userId) => {
    const rec = receptionists.find((r) => r.userId === userId);
    try {
      await api.delete(`/receptionists/${userId}`);
      setReceptionists((prev) => prev.filter((r) => r.userId !== userId));
      addNotification(
        `Receptionist ${rec?.firstName || ""} ${rec?.lastName || ""} details deleted.`,
      );
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete receptionist";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  return {
    receptionists,
    receptionistsLoading,
    receptionistsError,
    fetchReceptionists,
    createReceptionist,
    updateReceptionist,
    deleteReceptionist,
  };
}