import React from "react";
import { useDoctor } from "../../context/doctor/DoctorContext";
import Card from "../../components/common/Card";
import { CalendarIcon, CheckCircleIcon, PlayIcon } from "@heroicons/react/24/outline";
import { useNavigate, useOutletContext } from "react-router-dom";
export default function DoctorOverview() {
  const { doctor, triggerToast } = useOutletContext();
  const navigate = useNavigate();
  const { appointments, toggleAvailability } = useDoctor();

  // The backend already scopes GET /appointments to only this doctor's own appointments
  const doctorApps = appointments;

  const pendingApps = doctorApps.filter((a) => a.status === "confirmed" || a.status === "pending");
  const completedApps = doctorApps.filter((a) => a.status === "completed");

  const handleToggleDuty = async () => {
    try {
      await toggleAvailability();
      triggerToast(`Availability status updated!`);
    } catch (err) {
      triggerToast(err.message || "Failed to update availability", "error");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Practitioner Card */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 -mr-10 -mt-10" />
        <h3 className="text-xl font-bold">Welcome Back, Dr. {doctor.firstName}!</h3>
        <p className="text-xs text-teal-100 mt-1 max-w-md">
          Check your consultation desk rosters, inspect patient triage notes, and log clinical treatment status markers.
        </p>
      </div>

      {/* Roster Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card
          title="Total Assigned"
          value={doctorApps.length}
          subtitle="Consultation log"
          icon={CalendarIcon}
        />
        <Card
          title="Active Sessions"
          value={pendingApps.length}
          subtitle="Unfinished visits"
          icon={PlayIcon}
        />
        <Card
          title="Completed"
          value={completedApps.length}
          subtitle="Success checkups"
          icon={CheckCircleIcon}
        />
      </div>

      {/* Duty Status Switcher Card */}
      <Card title="Roster Duty Configuration">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-gray-800">Practitioner Visibility</h4>
            <p className="text-xs text-gray-500">
              When toggled Off-Duty, your profile is hidden from active frontdesk triage assignments.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${doctor.isAvailable ? "text-green-600" : "text-red-500"}`}>
              {doctor.isAvailable ? "Active (On-Duty)" : "Off-Duty"}
            </span>
            <button
              onClick={handleToggleDuty}
              className={`w-12 h-6 rounded-full transition-all relative ${
                doctor.isAvailable ? "bg-green-550" : "bg-gray-300"
              } cursor-pointer`}
            >
              <div 
                className={`h-5 w-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-all ${
                  doctor.isAvailable ? "left-6.5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

    </div>
  );
}
