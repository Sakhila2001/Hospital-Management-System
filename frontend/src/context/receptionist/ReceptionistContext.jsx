import React, { createContext, useContext } from "react";
import { useAuth } from "../AuthContext";
import useReceptionistProfile from "./useReceptionistProfile";
import useReceptionistAppointments from "./useReceptionistAppointments";
import useDepartmentsList from "../shared/useDepartmentsList";
import useDoctorsList from "../shared/useDoctorsList";

const ReceptionistContext = createContext(null);

export const useReceptionist = () => {
  const context = useContext(ReceptionistContext);
  if (!context) {
    throw new Error(
      "useReceptionist must be used within a ReceptionistProvider"
    );
  }
  return context;
};

export const ReceptionistProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const profileState = useReceptionistProfile({ user, authLoading });
  const appointmentState = useReceptionistAppointments({ user, authLoading });
  const deptState = useDepartmentsList({ user, authLoading });
  const docState = useDoctorsList({ user, authLoading });

  const value = {
    ...profileState,
    ...appointmentState,
    ...deptState,
    ...docState,
  };

  return (
    <ReceptionistContext.Provider value={value}>
      {children}
    </ReceptionistContext.Provider>
  );
};
