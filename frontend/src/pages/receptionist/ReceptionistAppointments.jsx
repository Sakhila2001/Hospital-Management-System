import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function ReceptionistAppointments({ receptionist, triggerToast }) {
  const { appointments, updateAppointmentStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter only confirmed/completed/cancelled appointments (exclude pending since they wait in triage)
  // Optionally filter by receptionist department
  const filteredApps = appointments.filter((app) => {
    if (app.status === "pending") return false;
    
    // Scoped to receptionist department if receptionist is bound to one
    if (receptionist.departmentId && app.departmentId !== receptionist.departmentId) {
      return false;
    }

    const matchesSearch =
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesSearch;
  });

  const handleCancelAppointment = (id) => {
    if (window.confirm("Are you sure you want to cancel this scheduled consultation?")) {
      updateAppointmentStatus(id, "cancelled");
      triggerToast("Appointment cancelled successfully.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient, doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full pl-10 pr-4 py-2 focus:ring-teal-500 focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Roster Table */}
      <Card title="Scheduled Consultations Log">
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm text-left text-gray-500 min-w-[700px]">
            <thead className="text-xs text-gray-700 bg-gray-50/75 border-b border-gray-150">
              <tr>
                <th scope="col" className="px-6 py-3">Patient Name</th>
                <th scope="col" className="px-6 py-3">Doctor Assigned</th>
                <th scope="col" className="px-6 py-3">Department</th>
                <th scope="col" className="px-6 py-3">Scheduled Date</th>
                <th scope="col" className="px-6 py-3">Time Slot</th>
                <th scope="col" className="px-6 py-3 text-center">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{app.patientName}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{app.doctorName}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{app.departmentName}</td>
                  <td className="px-6 py-4 font-medium text-gray-650">{app.date}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{app.time}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      text={app.status}
                      variant={
                        app.status === "confirmed" ? "info" :
                        app.status === "completed" ? "success" :
                        app.status === "cancelled" ? "danger" :
                        "gray"
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {app.status === "confirmed" ? (
                      <Button
                        variant="outline"
                        onClick={() => handleCancelAppointment(app.id)}
                        className="py-1 px-3 text-xs border-red-200 text-red-650 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400 font-medium bg-white">
                    No scheduled department visits match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
