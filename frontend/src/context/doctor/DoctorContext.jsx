import React, { createContext, useContext } from "react";
import { useAuth } from "../AuthContext";
import useDoctorProfile from "./useDoctorProfile";
import useDoctorAppointments from "./useDoctorAppointments";
import useDepartmentsList from "../shared/useDepartmentsList";

const DoctorContext = createContext(null);

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error("useDoctor must be used within a DoctorProvider");
  }
  return context;
};

export const DoctorProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const profileState = useDoctorProfile({ user, authLoading });
  const appointmentState = useDoctorAppointments({ user, authLoading });
  const deptState = useDepartmentsList({ user, authLoading });

  const value = {
    ...profileState,
    ...appointmentState,
    ...deptState,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};
