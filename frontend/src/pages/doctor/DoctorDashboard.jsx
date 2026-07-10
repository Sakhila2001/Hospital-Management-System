import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import Logo from "../../assets/images/logo.png";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
// Centralized components
import Toast from "../../components/common/Toast";

import {
  HomeIcon,
  CalendarDaysIcon,
  ClockIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function DoctorDashboard() {
  const { doctors } = useAdmin();
  const navigate = useNavigate();

  // Active tab: "overview", "appointments", "schedule", "profile"
  const location = useLocation();
  const activeTab = location.pathname.split("/")[2] || "overview";

  // Simulated logged-in doctor: Dr. John Doe (userId = 101)
  const currentDoctor = doctors.find((d) => d.userId === 101) || doctors[0];

  // Toast notification
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/");
    }
  };

  const TAB_LABELS = {
    overview: "Practice Overview",
    appointments: "Assigned Consultations",
    schedule: "My Schedule",
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
                  Doctor Portal
                </p>
              </div>
            </div>

            <nav className="p-4 space-y-1">
              <button
                onClick={() => navigate("/doctor/overview")}
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
                onClick={() => navigate("/doctor/appointments")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "appointments"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <CalendarDaysIcon className="h-5 w-5" />
                Assigned Slots
              </button>

              <button
                onClick={() => navigate("/doctor/schedule")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "schedule"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <ClockIcon className="h-5 w-5" />
                My Schedule
              </button>

              <button
                onClick={() => navigate("/doctor/profile")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-teal-55/70 text-teal-800 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <UserCircleIcon className="h-5 w-5" />
                My Profile
              </button>
            </nav>
          </div>

          {/* Profile footer with logout */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-sm uppercase">
                {currentDoctor?.firstName?.[0] || "D"}
                {currentDoctor?.lastName?.[0] || "R"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  Dr. {currentDoctor?.firstName} {currentDoctor?.lastName}
                </p>
                <p className="text-[10px] text-gray-400 font-medium">
                  {currentDoctor?.specialization}
                </p>
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
              {TAB_LABELS[activeTab]}
            </h2>

            {/* Mobile Tab Selector */}
            <div className="md:hidden flex gap-2">
              <select
                value={activeTab}
                onChange={(e) => navigate(`/doctor/${e.target.value}`)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-1.5 focus:ring-teal-500"
              >
                <option value="overview">Overview</option>
                <option value="appointments">Assigned Slots</option>
                <option value="schedule">My Schedule</option>
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
            <Outlet context={{ doctor: currentDoctor, triggerToast }} />
          </div>
        </main>
      </div>
    </div>
  );
}
