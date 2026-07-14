import React, { useState } from "react";
import { usePatient } from "../../context/patient/PatientContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import Logo from "../../assets/images/logo.png";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Toast from "../../components/common/Toast";

import {
  HomeIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function PatientDashboard() {
  const { profile: currentPatient, profileLoading } = usePatient();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const activeTab = location.pathname.split("/")[2] || "overview";

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
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
    logout();
    navigate("/login");
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading patient portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
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
                  Patient Portal
                </p>
              </div>
            </div>

            <nav className="p-4 space-y-1">
              <button
                onClick={() => navigate("/patient/overview")}
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
                onClick={() => navigate("/patient/book")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "book"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <CalendarDaysIcon className="h-5 w-5" />
                Book Appointment
              </button>

              <button
                onClick={() => navigate("/patient/profile")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <UserCircleIcon className="h-5 w-5" />
                Medical Profile
              </button>
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-sm uppercase">
                {currentPatient?.firstName?.[0] || "P"}
                {currentPatient?.lastName?.[0] || "T"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {currentPatient?.firstName} {currentPatient?.lastName}
                </p>
                <p className="text-[10px] text-gray-400 font-medium">Patient</p>
              </div>
            </div>

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
              {activeTab === "overview"
                ? "Patient Home"
                : activeTab === "book"
                  ? "New Clinic Request"
                  : "Medical Records"}
            </h2>

            <div className="md:hidden flex gap-2">
              <select
                value={activeTab}
                onChange={(e) => navigate(`/patient/${e.target.value}`)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-1.5 focus:ring-teal-500"
              >
                <option value="overview">Overview</option>
                <option value="book">Book Appointment</option>
                <option value="profile">Medical Profile</option>
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
            <Outlet context={{ patient: currentPatient, triggerToast }} />
          </div>
        </main>
      </div>
    </div>
  );
}
