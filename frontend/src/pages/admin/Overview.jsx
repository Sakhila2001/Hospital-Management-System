import React from "react";
import { useAdmin } from "../../context/AdminContext";
import StatCard from "../../components/StatCard";
import {
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
  UserGroupIcon,
  IdentificationIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function Overview({ onOpenCreateModal, setActiveTab, triggerToast }) {
  const {
    appointments,
    departments,
    doctors,
    receptionists,
    patients,
    updateAppointmentStatus
  } = useAdmin();

  const pendingAppointmentsCount = appointments.filter(a => a.status === 'pending').length;
  const activeDeptsCount = departments.filter(d => d.isActive).length;
  const availableDocsCount = doctors.filter(d => d.isAvailable).length;

  return (
    <div className="space-y-6">
      
      {/* Metrics Row using reusable StatCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          title="Total Appointments"
          value={appointments.length}
          subtitle={`(${pendingAppointmentsCount} pending)`}
          icon={CalendarIcon}
          onClick={() => setActiveTab("appointments")}
        />
        <StatCard
          title="Active Departments"
          value={activeDeptsCount}
          subtitle={`/ ${departments.length} total`}
          icon={BuildingOfficeIcon}
          onClick={() => setActiveTab("departments")}
        />
        <StatCard
          title="Available Doctors"
          value={availableDocsCount}
          subtitle={`/ ${doctors.length} registered`}
          icon={UserIcon}
          onClick={() => setActiveTab("doctors")}
        />
        <StatCard
          title="Active Receptionists"
          value={receptionists.length}
          subtitle="Shift managers"
          icon={UserGroupIcon}
          onClick={() => setActiveTab("receptionists")}
        />
        <StatCard
          title="Patients Registered"
          value={patients.length}
          subtitle="Record files"
          icon={IdentificationIcon}
          onClick={() => setActiveTab("patients")}
        />
      </div>

      {/* Quick Admin Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 tracking-wide uppercase">Quick Administration Commands</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onOpenCreateModal("department")}
            className="flex flex-col items-center justify-center p-4 bg-teal-50/50 hover:bg-teal-50 border border-teal-100 hover:border-teal-200 rounded-lg text-teal-700 transition-all font-medium text-sm gap-2 text-center cursor-pointer"
          >
            <BuildingOfficeIcon className="h-6 w-6" />
            Create Department
          </button>
          <button
            onClick={() => onOpenCreateModal("doctor")}
            className="flex flex-col items-center justify-center p-4 bg-teal-50/50 hover:bg-teal-50 border border-teal-100 hover:border-teal-200 rounded-lg text-teal-700 transition-all font-medium text-sm gap-2 text-center cursor-pointer"
          >
            <UserIcon className="h-6 w-6" />
            Create Doctor Account
          </button>
          <button
            onClick={() => onOpenCreateModal("receptionist")}
            className="flex flex-col items-center justify-center p-4 bg-teal-50/50 hover:bg-teal-50 border border-teal-100 hover:border-teal-200 rounded-lg text-teal-700 transition-all font-medium text-sm gap-2 text-center cursor-pointer"
          >
            <UserGroupIcon className="h-6 w-6" />
            Create Receptionist
          </button>
          <button
            onClick={() => onOpenCreateModal("patient")}
            className="flex flex-col items-center justify-center p-4 bg-teal-50/50 hover:bg-teal-50 border border-teal-100 hover:border-teal-200 rounded-lg text-teal-700 transition-all font-medium text-sm gap-2 text-center cursor-pointer"
          >
            <IdentificationIcon className="h-6 w-6" />
            Register New Patient
          </button>
        </div>
      </div>

      {/* Split details view: Recent Appointments & Departments Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Appointments */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800">Recent Appointments Waiting Status Update</h3>
            <button onClick={() => setActiveTab("appointments")} className="text-xs text-teal-600 font-semibold hover:underline cursor-pointer">
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {appointments.slice(0, 4).map((app) => (
              <div key={app.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{app.patientName}</p>
                  <p className="text-xs text-gray-500">
                    {app.doctorName} &bull; {app.departmentName} &bull; {app.date} at {app.time}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    app.status === "confirmed" ? "bg-blue-50 text-blue-700" :
                    app.status === "completed" ? "bg-green-50 text-green-700" :
                    app.status === "cancelled" ? "bg-red-50 text-red-700" :
                    "bg-yellow-50 text-yellow-700"
                  }`}>
                    {app.status}
                  </span>

                  {app.status === "pending" && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => { updateAppointmentStatus(app.id, "confirmed"); triggerToast("Appointment Confirmed"); }}
                        className="p-1 hover:bg-green-50 text-green-600 rounded-full border border-green-100 cursor-pointer"
                        title="Confirm"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { updateAppointmentStatus(app.id, "cancelled"); triggerToast("Appointment Cancelled"); }}
                        className="p-1 hover:bg-red-50 text-red-600 rounded-full border border-red-100 cursor-pointer"
                        title="Cancel"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Departments Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800">Departments Activity Status</h3>
            <button onClick={() => setActiveTab("departments")} className="text-xs text-teal-600 font-semibold hover:underline cursor-pointer">
              Manage
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {departments.map((dept) => {
              const doctorsCount = doctors.filter(d => d.departmentId === dept.id).length;
              const receptionistCount = receptionists.filter(r => r.departmentId === dept.id).length;
              return (
                <div key={dept.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-800">{dept.name}</h4>
                      <span className={`h-2.5 w-2.5 rounded-full ${dept.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-1">{dept.description}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-2">
                    <span>Doctors: <b>{doctorsCount}</b></span>
                    <span>Staff: <b>{receptionistCount}</b></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
