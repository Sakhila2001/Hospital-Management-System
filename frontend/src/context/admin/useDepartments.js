import { useState, useEffect } from "react";
import api from "../../api/axios";

const extractDepartment = (resData) => resData.data.department;
const extractDepartments = (resData) => resData.data.departments;

export default function useDepartments({ user, authLoading, addNotification }) {
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [departmentsError, setDepartmentsError] = useState(null);

  const fetchDepartments = async (includeInactive = true) => {
    setDepartmentsLoading(true);
    setDepartmentsError(null);
    try {
      const res = await api.get("/departments", { params: { includeInactive } });
      setDepartments(extractDepartments(res.data));
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load departments";
      setDepartmentsError(message);
      addNotification(`Error loading departments: ${message}`);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchDepartments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const createDepartment = async (dept) => {
    try {
      const res = await api.post("/departments", {
        name: dept.name,
        description: dept.description,
      });
      const newDept = extractDepartment(res.data);
      setDepartments((prev) => [...prev, newDept]);
      addNotification(`Department "${dept.name}" created successfully.`);
      return newDept;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create department";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  const updateDepartment = async (id, updatedFields) => {
    try {
      const res = await api.put(`/departments/${id}`, updatedFields);
      const updated = extractDepartment(res.data);
      setDepartments((prev) => prev.map((dept) => (dept.id === id ? updated : dept)));
      addNotification(`Department details for "${updatedFields.name || id}" updated.`);
      return updated;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update department";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  const toggleDepartmentStatus = async (id) => {
    try {
      const res = await api.patch(`/departments/${id}`); // server flips isActive itself
      const updated = extractDepartment(res.data);
      setDepartments((prev) => prev.map((d) => (d.id === id ? updated : d)));
      addNotification(`Department "${updated?.name || id}" status toggled.`);
      return updated;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to toggle department status";
      addNotification(`Error: ${message}`);
      throw new Error(message);
    }
  };

  const deleteDepartment = async (id) => {
    const dept = departments.find((d) => d.id === id);
    try {
      await api.delete(`/departments/${id}`);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      addNotification(`Department "${dept?.name || id}" deleted.`);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete department";
      throw new Error(message);
    }
  };

  return {
    departments,
    departmentsLoading,
    departmentsError,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    toggleDepartmentStatus,
    deleteDepartment,
  };
}