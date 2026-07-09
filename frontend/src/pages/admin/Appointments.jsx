import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Appointments({ triggerToast }) {
  const { appointments, updateAppointmentStatus, deleteAppointment } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch =
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      
      {/* Filtering Bar */}
      <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient, doctor, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full pl-10 pr-4 py-2.5 focus:ring-teal-500 focus:border-teal-500 focus:bg-white outline-none transition-all"
          />
        </div>

        <div className="flex gap-3 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 p-2.5 outline-none font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50/75 border-b border-gray-200">
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
          <tbody className="divide-y divide-gray-200">
            {filteredAppointments.map((app) => (
              <tr key={app.id} className="bg-white hover:bg-gray-50/50">
                <th scope="row" className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                  {app.patientName}
                </th>
                <td className="px-6 py-4">{app.doctorName}</td>
                <td className="px-6 py-4">{app.departmentName}</td>
                <td className="px-6 py-4 font-medium text-gray-600">{app.date}</td>
                <td className="px-6 py-4 text-gray-600">{app.time}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block ${
                    app.status === "confirmed" ? "bg-blue-50 text-blue-700" :
                    app.status === "completed" ? "bg-green-50 text-green-700" :
                    app.status === "cancelled" ? "bg-red-50 text-red-700" :
                    "bg-yellow-50 text-yellow-700"
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <select
                    value={app.status}
                    onChange={(e) => { updateAppointmentStatus(app.id, e.target.value); triggerToast("Appointment status updated"); }}
                    className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg p-1.5 outline-none font-medium focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => { if (window.confirm("Are you sure you want to delete this appointment?")) { deleteAppointment(app.id); triggerToast("Appointment deleted"); } }}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 cursor-pointer"
                    title="Delete Appointment"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAppointments.length === 0 && (
          <div className="p-10 text-center text-gray-400 font-medium bg-white">
            No matching appointments found.
          </div>
        )}
      </div>
    </div>
  );
}
