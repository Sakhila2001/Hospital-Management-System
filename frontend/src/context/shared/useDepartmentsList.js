import { useState, useEffect } from "react";
import api from "../../api/axios";

/**
 * Fetches the list of departments — available to any authenticated role.
 * Used by doctor/patient/receptionist profiles for department selects.
 */
export default function useDepartmentsList({ user, authLoading }) {
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) setDepartmentsLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const res = await api.get("/departments");
        setDepartments(res.data.data.departments || []);
      } catch {
        // non-fatal — UI will just show an empty list
      } finally {
        setDepartmentsLoading(false);
      }
    };
    fetch();
  }, [authLoading, user]);

  return { departments, departmentsLoading };
}
