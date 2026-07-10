import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import Logo from "../../assets/images/logo.png";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
// Reusable Components
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";

import {
  HomeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
  UserGroupIcon,
  IdentificationIcon,
  ClockIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const {
    departments,
    createDepartment,
    updateDepartment,
    createDoctor,
    updateDoctor,
    createReceptionist,
    updateReceptionist,
    createPatient,
    updatePatient,
    notifications,
    markAllNotificationsAsRead,
    clearAllNotifications,
  } = useAdmin();

  const navigate = useNavigate();

  // Tab State: "overview", "appointments", "departments", "doctors", "receptionists", "patients"
  const location = useLocation();
  const activeTab = location.pathname.split("/")[2] || "overview";
  // Notification panel open/close
  const [showNotifications, setShowNotifications] = useState(false);

  // Unread notification count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Modal State
  // { show: false, type: "doctor" | "department" | "receptionist" | "patient", action: "create" | "edit" | "view", data: null }
  const [modal, setModal] = useState({
    show: false,
    type: "",
    action: "",
    data: null,
  });

  // Form State
  const [formFields, setFormFields] = useState({});

  const handleOpenCreateModal = (type) => {
    let initialFields = {};
    if (type === "department") {
      initialFields = { name: "", description: "", isActive: true };
    } else if (type === "doctor") {
      initialFields = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        departmentId: departments.find((d) => d.isActive)?.id || "",
        specialization: "",
        qualification: "",
        experienceYears: 0,
        licenseNumber: "",
        phone: "",
        gender: "male",
        dateOfBirth: "",
        address: "",
        isAvailable: true,
        availableDays: [],
        availableTimeStart: "09:00",
        availableTimeEnd: "17:00",
        bio: "",
      };
    } else if (type === "receptionist") {
      initialFields = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        departmentId: departments.find((d) => d.isActive)?.id || "",
        phone: "",
        shift: "Morning",
        employeeCode: "",
        joinedDate: new Date().toISOString().split("T")[0],
      };
    } else if (type === "patient") {
      initialFields = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
        gender: "male",
        bloodGroup: "O+",
        phone: "",
        address: "",
        city: "",
        maritalStatus: "single",
        allergies: "",
        chronicConditions: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelation: "",
      };
    }
    setFormFields(initialFields);
    setModal({ show: true, type, action: "create", data: null });
  };

  const handleOpenEditModal = (type, entity) => {
    let initialFields = { ...entity };
    if (type === "doctor" || type === "receptionist" || type === "patient") {
      initialFields.password = "password123";
      initialFields.confirmPassword = "password123";
    }
    setFormFields(initialFields);
    setModal({ show: true, type, action: "edit", data: entity });
  };

  const handleOpenViewModal = (type, entity) => {
    setModal({ show: true, type, action: "view", data: entity });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      if (modal.type === "department") {
        if (!formFields.name.trim())
          throw new Error("Department name is required");
        if (modal.action === "create") {
          createDepartment(formFields);
          triggerToast("Department created successfully!");
        } else {
          updateDepartment(modal.data.id, formFields);
          triggerToast("Department updated successfully!");
        }
      } else if (modal.type === "doctor") {
        if (modal.action === "create") {
          if (
            !formFields.firstName ||
            !formFields.lastName ||
            !formFields.email ||
            !formFields.password
          ) {
            throw new Error("Please fill in all user login credentials");
          }
          if (formFields.password !== formFields.confirmPassword) {
            throw new Error("Passwords do not match");
          }
          if (!formFields.specialization)
            throw new Error("Specialization is required");
          if (!formFields.departmentId)
            throw new Error("Please assign a department");
          createDoctor(formFields);
          triggerToast("Doctor created successfully!");
        } else {
          updateDoctor(modal.data.userId, formFields);
          triggerToast("Doctor profile updated successfully!");
        }
      } else if (modal.type === "receptionist") {
        if (modal.action === "create") {
          if (
            !formFields.firstName ||
            !formFields.lastName ||
            !formFields.email ||
            !formFields.password
          ) {
            throw new Error("Please fill in all user login credentials");
          }
          if (formFields.password !== formFields.confirmPassword) {
            throw new Error("Passwords do not match");
          }
          if (!formFields.departmentId)
            throw new Error("Please assign a department");
          createReceptionist(formFields);
          triggerToast("Receptionist created successfully!");
        } else {
          updateReceptionist(modal.data.userId, formFields);
          triggerToast("Receptionist profile updated successfully!");
        }
      } else if (modal.type === "patient") {
        if (modal.action === "create") {
          if (
            !formFields.firstName ||
            !formFields.lastName ||
            !formFields.email ||
            !formFields.password
          ) {
            throw new Error("Please fill in all user credentials");
          }
          if (formFields.password !== formFields.confirmPassword) {
            throw new Error("Passwords do not match");
          }
          createPatient(formFields);
          triggerToast("Patient profile created successfully!");
        } else {
          updatePatient(modal.data.userId, formFields);
          triggerToast("Patient profile updated successfully!");
        }
      }
      setModal({ show: false, type: "", action: "", data: null });
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  const getDeptName = (id) => {
    const dept = departments.find((d) => d.id === Number(id));
    return dept ? dept.name : "N/A";
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out from the portal?")) {
      navigate("/");
    }
  };

  const outletContext = {
    onOpenCreateModal: handleOpenCreateModal,
    onOpenEditModal: handleOpenEditModal,
    onOpenViewModal: handleOpenViewModal,
    triggerToast,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ show: false, message: "", type: "success" })}
      />

      {/* Main Dashboard Layout */}
      <div className="flex flex-1 h-screen overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex">
          <div>
            <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-3">
              <img src={Logo} alt="Logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-sm font-semibold text-gray-800 tracking-wide uppercase">
                  City Care
                </h1>
                <p className="text-xs text-teal-600 font-medium -mt-1">
                  Admin Portal
                </p>
              </div>
            </div>

            <nav className="p-4 space-y-1">
              <button
                onClick={() => navigate("/admin/overview")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <HomeIcon className="h-5 w-5" />
                Overview
              </button>

              <button
                onClick={() => navigate("/admin/appointments")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "appointments"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <CalendarIcon className="h-5 w-5" />
                Appointments
              </button>

              <button
                onClick={() => navigate("/admin/departments")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "departments"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <BuildingOfficeIcon className="h-5 w-5" />
                Departments
              </button>

              <button
                onClick={() => navigate("/admin/doctors")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "doctors"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <UserIcon className="h-5 w-5" />
                Doctors
              </button>

              <button
                onClick={() => navigate("/admin/receptionists")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "receptionists"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <UserGroupIcon className="h-5 w-5" />
                Receptionists
              </button>

              <button
                onClick={() => navigate("/admin/patients")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "patients"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <IdentificationIcon className="h-5 w-5" />
                Patients
              </button>
            </nav>
          </div>

          {/* Sidebar Footer with Logout trigger */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                AD
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  Admin User
                </p>
                <p className="text-[10px] text-gray-400 font-medium">
                  Chief Executive
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-550 rounded-lg transition-colors border border-transparent hover:border-red-100 cursor-pointer"
              title="Logout from portal"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50 relative">
          <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800 capitalize">
                {activeTab} Management
              </h2>

              <div className="md:hidden flex gap-2">
                <select
                  value={activeTab}
                  onChange={(e) => navigate(`/admin/${e.target.value}`)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-teal-500 p-1.5"
                >
                  <option value="overview">Overview</option>
                  <option value="appointments">Appointments</option>
                  <option value="departments">Departments</option>
                  <option value="doctors">Doctors</option>
                  <option value="receptionists">Receptionists</option>
                  <option value="patients">Patients</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 relative">
              {/* Notification Bell */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-full relative cursor-pointer"
                title="Notifications"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Floating Notifications Dropdown Popover */}
              {showNotifications && (
                <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-30 flex flex-col max-h-96 overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b border-gray-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">
                      Event Alerts ({unreadCount} new)
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          markAllNotificationsAsRead();
                          triggerToast("Notifications marked as read");
                        }}
                        className="text-[10px] text-teal-600 hover:text-teal-550 font-bold hover:underline cursor-pointer"
                      >
                        Mark read
                      </button>
                      <span className="text-gray-300 text-xs">|</span>
                      <button
                        onClick={() => {
                          clearAllNotifications();
                          triggerToast("Notifications cleared");
                        }}
                        className="text-[10px] text-red-500 hover:text-red-550 font-bold hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs leading-relaxed transition-all ${
                          !n.read
                            ? "bg-teal-50/20 font-semibold"
                            : "text-gray-650"
                        }`}
                      >
                        <p className="text-gray-800">{n.message}</p>
                        <span className="text-[10px] text-gray-400 font-medium block mt-1">
                          {n.time}
                        </span>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="p-8 text-center text-gray-400 font-medium">
                        No recent notifications.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <ClockIcon className="h-4 w-4 text-teal-600" />
                <span>
                  Today:{" "}
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
            <Outlet context={outletContext} />
          </div>
        </main>
      </div>

      {/* --- REUSABLE MODAL CONTAINER --- */}
      <Modal
        isOpen={modal.show}
        onClose={() =>
          setModal({ show: false, type: "", action: "", data: null })
        }
        badge={`${modal.type} management`}
        title={`${modal.action} ${modal.type}`}
      >
        {modal.action === "view" ? (
          <div className="space-y-4">
            {modal.type === "doctor" && modal.data && (
              <div className="space-y-3">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <h4 className="text-base font-bold text-gray-800">
                    Dr. {modal.data.firstName} {modal.data.lastName}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
                    License: {modal.data.licenseNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <b>Email:</b>{" "}
                    <span className="text-gray-600">{modal.data.email}</span>
                  </p>
                  <p>
                    <b>Department:</b>{" "}
                    <span className="text-gray-600">
                      {getDeptName(modal.data.departmentId)}
                    </span>
                  </p>
                  <p>
                    <b>Specialization:</b>{" "}
                    <span className="text-gray-600">
                      {modal.data.specialization}
                    </span>
                  </p>
                  <p>
                    <b>Qualification:</b>{" "}
                    <span className="text-gray-600">
                      {modal.data.qualification}
                    </span>
                  </p>
                  <p>
                    <b>Experience:</b>{" "}
                    <span className="text-gray-600">
                      {modal.data.experienceYears} Years
                    </span>
                  </p>
                  <p>
                    <b>Gender:</b>{" "}
                    <span className="text-gray-600 capitalize">
                      {modal.data.gender}
                    </span>
                  </p>
                  <p>
                    <b>Phone:</b>{" "}
                    <span className="text-gray-600">{modal.data.phone}</span>
                  </p>
                  <p>
                    <b>DOB:</b>{" "}
                    <span className="text-gray-600">
                      {modal.data.dateOfBirth}
                    </span>
                  </p>
                  <p className="col-span-2">
                    <b>Clinic Hours:</b>{" "}
                    <span className="text-gray-600">
                      {modal.data.availableTimeStart} to{" "}
                      {modal.data.availableTimeEnd} (
                      {modal.data.availableDays.join(", ")})
                    </span>
                  </p>
                  <p className="col-span-2">
                    <b>Address:</b>{" "}
                    <span className="text-gray-600">{modal.data.address}</span>
                  </p>
                </div>

                {modal.data.bio && (
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-sm font-semibold">Biography:</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">
                      {modal.data.bio}
                    </p>
                  </div>
                )}
              </div>
            )}

            {modal.type === "patient" && modal.data && (
              <div className="space-y-3">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <h4 className="text-base font-bold text-gray-800">
                    {modal.data.firstName} {modal.data.lastName}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    Blood: {modal.data.bloodGroup}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <b>Email:</b>{" "}
                    <span className="text-gray-600">{modal.data.email}</span>
                  </p>
                  <p>
                    <b>Phone:</b>{" "}
                    <span className="text-gray-600">{modal.data.phone}</span>
                  </p>
                  <p>
                    <b>Gender:</b>{" "}
                    <span className="text-gray-600 capitalize">
                      {modal.data.gender}
                    </span>
                  </p>
                  <p>
                    <b>Date of Birth:</b>{" "}
                    <span className="text-gray-600">
                      {modal.data.dateOfBirth}
                    </span>
                  </p>
                  <p>
                    <b>Marital Status:</b>{" "}
                    <span className="text-gray-600 capitalize">
                      {modal.data.maritalStatus}
                    </span>
                  </p>
                  <p>
                    <b>City:</b>{" "}
                    <span className="text-gray-600">{modal.data.city}</span>
                  </p>
                  <p className="col-span-2">
                    <b>Address:</b>{" "}
                    <span className="text-gray-600">{modal.data.address}</span>
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-red-50/50 p-2.5 rounded-lg border border-red-100">
                    <p className="font-semibold text-red-800">Allergies:</p>
                    <p className="text-red-700 mt-1 font-medium">
                      {modal.data.allergies || "None declared."}
                    </p>
                  </div>
                  <div className="bg-yellow-50/50 p-2.5 rounded-lg border border-yellow-100">
                    <p className="font-semibold text-yellow-800">
                      Chronic Conditions:
                    </p>
                    <p className="text-yellow-700 mt-1 font-medium">
                      {modal.data.chronicConditions || "None declared."}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-sm font-semibold text-gray-800">
                    Emergency Contact Info:
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    <p>
                      <b>Contact:</b> {modal.data.emergencyContactName}
                    </p>
                    <p>
                      <b>Phone:</b> {modal.data.emergencyContactPhone}
                    </p>
                    <p>
                      <b>Relation:</b> {modal.data.emergencyContactRelation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* DEPARTMENT FORM */}
            {modal.type === "department" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase">
                    Department Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formFields.name || ""}
                    onChange={(e) =>
                      setFormFields({ ...formFields, name: e.target.value })
                    }
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
                    placeholder="e.g. Ophthalmology"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={formFields.description || ""}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
                    placeholder="Detailed department overview..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="deptActive"
                    checked={formFields.isActive !== false}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        isActive: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded-sm border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label
                    htmlFor="deptActive"
                    className="text-sm font-semibold text-gray-600 cursor-pointer"
                  >
                    Active Department
                  </label>
                </div>
              </>
            )}

            {/* DOCTOR FORM */}
            {modal.type === "doctor" && (
              <>
                {modal.action === "create" && (
                  <div className="bg-teal-50/50 p-3 rounded-lg border border-teal-100/50 space-y-3">
                    <p className="text-xs font-bold text-teal-700 uppercase">
                      1. User Authentication Credentials
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="email"
                        required
                        placeholder="User Email Address"
                        value={formFields.email || ""}
                        onChange={(e) =>
                          setFormFields({
                            ...formFields,
                            email: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="password"
                          required
                          placeholder="Password"
                          value={formFields.password || ""}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              password: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                        />
                        <input
                          type="password"
                          required
                          placeholder="Confirm"
                          value={formFields.confirmPassword || ""}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs font-bold text-gray-600 uppercase border-b border-gray-100 pb-1">
                  2. Profile Details
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.firstName || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          firstName: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.lastName || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          lastName: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Department
                    </label>
                    <select
                      value={formFields.departmentId || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          departmentId: Number(e.target.value),
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    >
                      {departments
                        .filter((d) => d.isActive)
                        .map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Specialization
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cardiologist"
                      value={formFields.specialization || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          specialization: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Qualification
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MD, DM"
                      value={formFields.qualification || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          qualification: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      License Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LIC1000"
                      value={formFields.licenseNumber || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          licenseNumber: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={formFields.experienceYears || 0}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          experienceYears: Number(e.target.value),
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formFields.phone || ""}
                      onChange={(e) =>
                        setFormFields({ ...formFields, phone: e.target.value })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formFields.dateOfBirth || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Gender
                    </label>
                    <select
                      value={formFields.gender || "male"}
                      onChange={(e) =>
                        setFormFields({ ...formFields, gender: e.target.value })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Work Hours Start
                    </label>
                    <input
                      type="time"
                      value={formFields.availableTimeStart || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          availableTimeStart: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Work Hours End
                    </label>
                    <input
                      type="time"
                      value={formFields.availableTimeEnd || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          availableTimeEnd: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formFields.address || ""}
                    onChange={(e) =>
                      setFormFields({ ...formFields, address: e.target.value })
                    }
                    className="mt-1.5 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">
                    Bio / Doctor notes
                  </label>
                  <textarea
                    rows="2"
                    value={formFields.bio || ""}
                    onChange={(e) =>
                      setFormFields({ ...formFields, bio: e.target.value })
                    }
                    className="mt-1.5 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    placeholder="Brief biography details..."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFields.isAvailable !== false}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded-sm border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    Available for New Patients
                  </label>

                  <div className="text-xs">
                    <span className="font-bold text-gray-500 uppercase">
                      Workdays:
                    </span>{" "}
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => {
                        const isChecked =
                          formFields.availableDays?.includes(day);
                        return (
                          <label
                            key={day}
                            className="inline-flex items-center mr-2 font-semibold text-gray-600 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const currentDays =
                                  formFields.availableDays || [];
                                const newDays = e.target.checked
                                  ? [...currentDays, day]
                                  : currentDays.filter((d) => d !== day);
                                setFormFields({
                                  ...formFields,
                                  availableDays: newDays,
                                });
                              }}
                              className="h-3 w-3 mr-1 text-teal-600 border-gray-300 cursor-pointer"
                            />
                            {day}
                          </label>
                        );
                      },
                    )}
                  </div>
                </div>
              </>
            )}

            {/* RECEPTIONIST FORM */}
            {modal.type === "receptionist" && (
              <>
                {modal.action === "create" && (
                  <div className="bg-teal-50/50 p-3 rounded-lg border border-teal-100/50 space-y-3">
                    <p className="text-xs font-bold text-teal-700 uppercase">
                      1. User Authentication Credentials
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="email"
                        required
                        placeholder="User Email Address"
                        value={formFields.email || ""}
                        onChange={(e) =>
                          setFormFields({
                            ...formFields,
                            email: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="password"
                          required
                          placeholder="Password"
                          value={formFields.password || ""}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              password: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                        />
                        <input
                          type="password"
                          required
                          placeholder="Confirm"
                          value={formFields.confirmPassword || ""}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs font-bold text-gray-600 uppercase border-b border-gray-100 pb-1">
                  2. Staff Details
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.firstName || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          firstName: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.lastName || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          lastName: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Department
                    </label>
                    <select
                      value={formFields.departmentId || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          departmentId: Number(e.target.value),
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    >
                      {departments
                        .filter((d) => d.isActive)
                        .map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Employee Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. REC102"
                      value={formFields.employeeCode || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          employeeCode: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Shift Schedule
                    </label>
                    <select
                      value={formFields.shift || "Morning"}
                      onChange={(e) =>
                        setFormFields({ ...formFields, shift: e.target.value })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formFields.phone || ""}
                      onChange={(e) =>
                        setFormFields({ ...formFields, phone: e.target.value })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Joined Date
                    </label>
                    <input
                      type="date"
                      value={formFields.joinedDate || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          joinedDate: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* PATIENT FORM */}
            {modal.type === "patient" && (
              <>
                {modal.action === "create" && (
                  <div className="bg-teal-50/50 p-3 rounded-lg border border-teal-100/50 space-y-3">
                    <p className="text-xs font-bold text-teal-700 uppercase">
                      1. User Credentials
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="email"
                        required
                        placeholder="Email address"
                        value={formFields.email || ""}
                        onChange={(e) =>
                          setFormFields({
                            ...formFields,
                            email: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="password"
                          required
                          placeholder="Password"
                          value={formFields.password || ""}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              password: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                        />
                        <input
                          type="password"
                          required
                          placeholder="Confirm"
                          value={formFields.confirmPassword || ""}
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs font-bold text-gray-600 uppercase border-b border-gray-100 pb-1">
                  2. Demographics & Profile
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.firstName || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          firstName: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formFields.lastName || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          lastName: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formFields.dateOfBirth || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Gender
                    </label>
                    <select
                      value={formFields.gender || "male"}
                      onChange={(e) =>
                        setFormFields({ ...formFields, gender: e.target.value })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Blood Group
                    </label>
                    <select
                      value={formFields.bloodGroup || "O+"}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          bloodGroup: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    >
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                        (bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formFields.phone || ""}
                      onChange={(e) =>
                        setFormFields({ ...formFields, phone: e.target.value })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Marital Status
                    </label>
                    <select
                      value={formFields.maritalStatus || "single"}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          maritalStatus: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      City
                    </label>
                    <input
                      type="text"
                      value={formFields.city || ""}
                      onChange={(e) =>
                        setFormFields({ ...formFields, city: e.target.value })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Full Address
                    </label>
                    <input
                      type="text"
                      value={formFields.address || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          address: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Allergies
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Penicillin, Peanuts, etc."
                      value={formFields.allergies || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          allergies: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">
                      Chronic Conditions
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Asthma, Diabetes, etc."
                      value={formFields.chronicConditions || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          chronicConditions: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                    />
                  </div>
                </div>

                <p className="text-xs font-bold text-gray-600 uppercase border-b border-gray-100 pb-1 pt-2">
                  3. Emergency Contact Details
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formFields.emergencyContactName || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          emergencyContactName: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={formFields.emergencyContactPhone || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          emergencyContactPhone: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase">
                      Relation
                    </label>
                    <input
                      type="text"
                      placeholder="Spouse, Parent"
                      value={formFields.emergencyContactRelation || ""}
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          emergencyContactRelation: e.target.value,
                        })
                      }
                      className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs focus:ring-teal-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 border-t border-gray-150 pt-4 mt-6">
              <button
                type="button"
                onClick={() =>
                  setModal({ show: false, type: "", action: "", data: null })
                }
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 text-white text-sm font-semibold rounded-full hover:bg-teal-500 shadow-xs cursor-pointer"
              >
                {modal.action === "create" ? "Save Account" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
