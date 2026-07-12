import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import Logo from "../../assets/images/logo.png";
//import { useNavigate } from "react-router-dom";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

// Centralized components
import Toast from "../../components/common/Toast";
import Modal from "../../components/common/Modal";

import {
  HomeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  IdentificationIcon,
  ArrowLeftOnRectangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function ReceptionistDashboard() {
  const { receptionists, departments } = useAdmin();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Active tab: "overview", "appointments", "patients", "profile"
  const location = useLocation();
  const activeTab = location.pathname.split("/")[2] || "overview";

  // Simulated logged-in receptionist: Alice Smith (userId = 201)
  const currentReceptionist =
    receptionists.find((r) => r.userId === 201) || receptionists[0];

  // Toast notification
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Shared Receptionist Edit Modals for Patients
  // { show: false, action: "create" | "edit", data: null }
  const [patientModal, setPatientModal] = useState({
    show: false,
    action: "",
    data: null,
  });

  const getDeptName = (id) => {
    const dept = departments.find((d) => d.id === Number(id));
    return dept ? dept.name : "General Desk";
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out from the portal?")) {
      return;
    }

    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
    }

    logout(); // clears user + accessToken from AuthContext
    navigate("/login");
  };

  const TAB_TITLES = {
    overview: "Triage Queue",
    appointments: "Scheduled Consults",
    patients: "Patient Registry",
    profile: "My Profile",
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

      <div className="flex flex-1 h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex">
          <div>
            <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-3">
              <img src={Logo} alt="Logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-sm font-semibold text-gray-800 tracking-wide uppercase">
                  City Care
                </h1>
                <p className="text-xs text-teal-650 font-medium -mt-1">
                  Reception Portal
                </p>
              </div>
            </div>

            <nav className="p-4 space-y-1">
              <button
                onClick={() => navigate("/receptionist/overview")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <HomeIcon className="h-5 w-5" />
                Triage Desk
              </button>

              <button
                onClick={() => navigate("/receptionist/appointments")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "appointments"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <CalendarDaysIcon className="h-5 w-5" />
                Confirmed Logs
              </button>

              <button
                onClick={() => navigate("/receptionist/patients")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "patients"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <UserGroupIcon className="h-5 w-5" />
                Patient Files
              </button>

              <button
                onClick={() => navigate("/receptionist/profile")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <IdentificationIcon className="h-5 w-5" />
                My Profile
              </button>
            </nav>
          </div>

          {/* Profile footer with logout */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => navigate("/receptionist/profile")}
              className="flex items-center gap-2.5 cursor-pointer text-left"
              title="View my profile"
            >
              <div className="h-9 w-9 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-sm uppercase">
                RC
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {currentReceptionist?.firstName}{" "}
                  {currentReceptionist?.lastName}
                </p>
                <p className="text-[10px] text-gray-400 font-medium">
                  {getDeptName(currentReceptionist?.departmentId)} Desk
                </p>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-550 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50 relative">
          <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20">
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              {TAB_TITLES[activeTab]}
            </h2>

            {/* Mobile Tab Selector */}
            <div className="md:hidden flex gap-2">
              <select
                value={activeTab}
                onChange={(e) => navigate(`/receptionist/${e.target.value}`)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-1.5 focus:ring-teal-500"
              >
                <option value="overview">Triage Queue</option>
                <option value="appointments">Confirmed Logs</option>
                <option value="patients">Patient Files</option>
                <option value="profile">My Profile</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              <ClockIcon className="h-4 w-4 text-teal-600" />
              <span>
                Today:{" "}
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </header>

          <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
            <Outlet
              context={{
                receptionist: currentReceptionist,
                triggerToast,
                patientModal,
                setPatientModal,
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
