import React, { createContext, useContext } from "react";
import { useAuth } from "../AuthContext";
import usePatientProfile from "./usePatientProfile";
import usePatientAppointments from "./usePatientAppointments";
import useDepartmentsList from "../shared/useDepartmentsList";

const PatientContext = createContext(null);

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
};

export const PatientProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const profileState = usePatientProfile({ user, authLoading });
  const appointmentState = usePatientAppointments({ user, authLoading });
  const deptState = useDepartmentsList({ user, authLoading });

  const value = {
    ...profileState,
    ...appointmentState,
    ...deptState,
  };

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
};
