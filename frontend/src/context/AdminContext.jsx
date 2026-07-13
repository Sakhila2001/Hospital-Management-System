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

  const deptState = useDepartments({ user, authLoading, addNotification });
  const docState = useDoctors({ user, authLoading, addNotification });
  const recState = useReceptionists({ user, authLoading, addNotification });
  const patState = usePatients({ user, authLoading, addNotification });
  const apptState = useAppointments({
    addNotification,
    doctors: docState.doctors,
    departments: deptState.departments,
    patients: patState.patients,
    setPatients: patState.setPatients,
  });

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
