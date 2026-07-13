import { useState, useEffect } from "react";
import api from "../../api/axios";

/**
 * Fetches the list of all doctors — available to admin/receptionist roles.
 * Used for assignment dropdowns in triage/appointment forms.
 */
export default function useDoctorsList({ user, authLoading }) {
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) setDoctorsLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const res = await api.get("/doctors");
        const raw = res.data.data.doctors || [];
        // Normalize: flatten User association
        setDoctors(
          raw.map((d) => ({
            ...d,
            firstName: d.User?.firstName ?? d.firstName,
            lastName: d.User?.lastName ?? d.lastName,
          }))
        );
      } catch {
        // non-fatal — UI will just show an empty doctor list
      } finally {
        setDoctorsLoading(false);
      }
    };
    fetch();
  }, [authLoading, user]);

  return { doctors, doctorsLoading };
}
