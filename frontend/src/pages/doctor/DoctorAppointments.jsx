import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

const STATUS_FILTERS = [
  { value: "all", label: "All Statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No Show" },
];

const DATE_FILTERS = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
];

function isSameDay(dateStr, ref) {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

export default function DoctorAppointments({ doctor, triggerToast }) {
  const { appointments, patients, updateAppointmentStatus } = useAdmin();

  // Filter appointments assigned to this doctor
  const doctorApps = appointments.filter(
    (app) => app.doctorId === 101 || app.doctorId === 1,
  );

  // Selected patient for medical record viewing
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredApps = useMemo(() => {
    const today = new Date();
    return doctorApps.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;

      if (dateFilter === "today" && !isSameDay(app.date, today)) return false;
      if (
        dateFilter === "upcoming" &&
        new Date(app.date) < new Date(today.toDateString())
      )
        return false;
      if (
        dateFilter === "past" &&
        new Date(app.date) >= new Date(today.toDateString())
      )
        return false;

      if (
        search.trim() &&
        !app.patientName.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [doctorApps, statusFilter, dateFilter, search]);

  const handleOpenPatientDetails = (patientName) => {
    const match = patients.find(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase() ===
        patientName.toLowerCase(),
    );
    if (match) {
      setSelectedPatient(match);
    } else {
      triggerToast("Patient clinical record not found.", "error");
    }
  };

  const handleUpdateStatus = (appId, nextStatus) => {
    updateAppointmentStatus(appId, nextStatus);
    triggerToast(`Appointment status updated to ${nextStatus.toUpperCase()}.`);
  };

  return (
    <div className="space-y-6">
      <Card title="Patient Consultation Slots">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 pb-5 border-b border-gray-100">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-4 w-4 text-gray-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-teal-500 outline-none"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-teal-500 outline-none"
            >
              {DATE_FILTERS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm text-left text-gray-500 min-w-[700px]">
            <thead className="text-xs text-gray-700 bg-gray-50/75 border-b border-gray-150">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Patient Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Scheduled Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Time Slot
                </th>
                <th scope="col" className="px-6 py-3">
                  Triage Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Triage Reason
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    <button
                      onClick={() => handleOpenPatientDetails(app.patientName)}
                      className="text-teal-600 hover:text-teal-500 hover:underline font-bold text-left cursor-pointer"
                    >
                      {app.patientName}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {app.date}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {app.time}
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-550 font-semibold">
                    {app.type.replace("_", " ")}
                  </td>
                  <td
                    className="px-6 py-4 text-gray-500 font-medium max-w-xs truncate"
                    title={app.appointmentReason}
                  >
                    {app.appointmentReason || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      text={app.status}
                      variant={
                        app.status === "confirmed"
                          ? "info"
                          : app.status === "completed"
                            ? "success"
                            : app.status === "cancelled"
                              ? "danger"
                              : "warning"
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    {app.status === "confirmed" ? (
                      <>
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleUpdateStatus(app.id, "completed")
                          }
                          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          Complete
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleUpdateStatus(app.id, "no_show")}
                          className="py-1 px-3 text-xs hover:border-red-200 hover:text-red-600"
                        >
                          No Show
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">
                        -
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-gray-400 font-medium bg-white"
                  >
                    {doctorApps.length === 0
                      ? "No scheduled patient consults are assigned to you at the moment."
                      : "No appointments match your current filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Patient Clinical Background Record Modal */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        badge="Clinical History"
        title={
          selectedPatient
            ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
            : "Patient History"
        }
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase">
                Personal details
              </span>
              <Badge
                text={`Blood: ${selectedPatient.bloodGroup}`}
                variant="info"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <p>
                <b>Email:</b> {selectedPatient.email}
              </p>
              <p>
                <b>Phone:</b> {selectedPatient.phone}
              </p>
              <p>
                <b>Gender:</b>{" "}
                <span className="capitalize">{selectedPatient.gender}</span>
              </p>
              <p>
                <b>DOB:</b> {selectedPatient.dateOfBirth}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-4 text-xs">
              <div className="bg-red-50/50 p-2.5 rounded-lg border border-red-100">
                <p className="font-semibold text-red-800">Allergies:</p>
                <p className="text-red-700 mt-1 font-medium">
                  {selectedPatient.allergies || "None declared."}
                </p>
              </div>
              <div className="bg-yellow-50/50 p-2.5 rounded-lg border border-yellow-100">
                <p className="font-semibold text-yellow-800">
                  Chronic Conditions:
                </p>
                <p className="text-yellow-700 mt-1 font-medium">
                  {selectedPatient.chronicConditions || "None declared."}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <p className="text-sm font-semibold text-gray-800">
                Emergency Contact Info:
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <p>
                  <b>Contact:</b> {selectedPatient.emergencyContactName}
                </p>
                <p>
                  <b>Phone:</b> {selectedPatient.emergencyContactPhone}
                </p>
                <p>
                  <b>Relation:</b> {selectedPatient.emergencyContactRelation}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                variant="secondary"
                onClick={() => setSelectedPatient(null)}
              >
                Close Record
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
