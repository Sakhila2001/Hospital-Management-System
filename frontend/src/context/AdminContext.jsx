import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import useNotifications from "./admin/useNotifications";
import useDepartments from "./admin/useDepartments";
import useDoctors from "./admin/useDoctors";
import useReceptionists from "./admin/useReceptionists";
import usePatients from "./admin/usePatients";
import useAppointments from "./admin/useAppointments";

const AdminContext = createContext();
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const notifState = useNotifications();
  const { addNotification } = notifState;

  // Only pass user to admin-only hooks when the logged-in user is actually an
  // admin — this prevents /doctors, /receptionists, /patients, /appointments
  // from being called (and returning 403) for doctor/patient/receptionist logins.
  const isAdmin = !authLoading && user?.roles === "admin";
  const adminUser = isAdmin ? user : null;
  const adminAuthLoading = authLoading;

  const deptState = useDepartments({ user: adminUser, authLoading: adminAuthLoading, addNotification });
  const docState = useDoctors({ user: adminUser, authLoading: adminAuthLoading, addNotification });
  const recState = useReceptionists({ user: adminUser, authLoading: adminAuthLoading, addNotification });
  const patState = usePatients({ user: adminUser, authLoading: adminAuthLoading, addNotification });
  const apptState = useAppointments({ addNotification, user: adminUser, authLoading: adminAuthLoading });

  const value = {
    ...notifState,
    ...deptState,
    ...docState,
    ...recState,
    ...patState,
    ...apptState,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
