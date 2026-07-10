import React, { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { useOutletContext } from "react-router-dom";

export default function ReceptionistOverview() {
  const { receptionist, triggerToast } = useOutletContext();
  const { appointments, departments, doctors, updateAppointmentStatus } =
    useAdmin();

  // Active departments and available doctors lists
  const activeDepts = departments.filter((d) => d.isActive);
  const availableDocs = doctors.filter((d) => d.isAvailable);

  // Triage state mapping
  const pendingTriageApps = appointments.filter(
    (app) => app.status === "pending",
  );

  // Selected appointment for routing assignment
  const [selectedApp, setSelectedApp] = useState(null);

  // Assignment form states
  const [routedDeptId, setRoutedDeptId] = useState("");
  const [assignedDocId, setAssignedDocId] = useState("");
  const [triageType, setTriageType] = useState("consultation");
  const [triageReason, setTriageReason] = useState("");

  // Doctor listings filtered by department choice
  const [filteredDocs, setFilteredDocs] = useState([]);

  // Load selected values when modal opens
  useEffect(() => {
    if (selectedApp) {
      // Pre-fill department to receptionist's own department or the first active department
      const initialDeptId =
        receptionist.departmentId ||
        (activeDepts.length > 0 ? activeDepts[0].id : "");
      setRoutedDeptId(initialDeptId.toString());
      setTriageType(selectedApp.type);
      setTriageReason(selectedApp.appointmentReason || "");
    }
  }, [selectedApp]);

  // Update doctor choices when department changes
  useEffect(() => {
    if (routedDeptId) {
      const match = availableDocs.filter(
        (d) => Number(d.departmentId) === Number(routedDeptId),
      );
      setFilteredDocs(match);
      if (match.length > 0) {
        setAssignedDocId(match[0].userId.toString());
      } else {
        setAssignedDocId("");
      }
    }
  }, [routedDeptId]);

  const handleTriageSubmit = (e) => {
    e.preventDefault();
    try {
      if (!routedDeptId) throw new Error("Please assign a department");
      if (!assignedDocId) throw new Error("Please assign an available doctor");

      updateAppointmentStatus(selectedApp.id, "confirmed", {
        departmentId: Number(routedDeptId),
        doctorId: Number(assignedDocId),
        type: triageType,
        appointmentReason: triageReason,
      });

      triggerToast("Appointment triaged and routed successfully!");
      setSelectedApp(null);
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Triage summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Card
          title="Triage Queue"
          value={pendingTriageApps.length}
          subtitle="Patients waiting"
        />
        <Card
          title="Active Specialties"
          value={activeDepts.length}
          subtitle="Operating departments"
        />
      </div>

      {/* Pending Triage Table */}
      <Card title="Pending Appointments Desk">
        <div className="overflow-x-auto scrollbar-hide -mx-6">
          <table className="w-full text-sm text-left text-gray-500 min-w-[700px]">
            <thead className="text-xs text-gray-700 bg-gray-50/75 border-b border-gray-150">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Patient Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Requested Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Time Slot
                </th>
                <th scope="col" className="px-6 py-3">
                  Triage Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Symptoms / Reason
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
              {pendingTriageApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {app.patientName}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {app.date}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {app.time}
                  </td>
                  <td className="px-6 py-4 capitalize font-semibold text-gray-550">
                    {app.type.replace("_", " ")}
                  </td>
                  <td
                    className="px-6 py-4 text-gray-550 max-w-3 truncate"
                    title={app.appointmentReason}
                  >
                    {app.appointmentReason || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge text={app.status} variant="warning" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="primary"
                      onClick={() => setSelectedApp(app)}
                      className="whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Assign
                    </Button>
                  </td>
                </tr>
              ))}
              {pendingTriageApps.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-gray-400 font-medium bg-white"
                  >
                    Triage Queue is empty. No pending appointment requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Triage Assignment Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        badge="Triage & Department Assignment"
        title="Route Triage Request"
      >
        {selectedApp && (
          <form onSubmit={handleTriageSubmit} className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 text-xs text-gray-600 space-y-1.5">
              <p>
                <b>Patient:</b> {selectedApp.patientName}
              </p>
              <p>
                <b>Preferred Slot:</b> {selectedApp.date} at {selectedApp.time}
              </p>
            </div>

            {/* Department */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Assign Clinical Department
              </label>
              <select
                value={routedDeptId}
                onChange={(e) => setRoutedDeptId(e.target.value)}
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold"
                required
              >
                <option value="" disabled>
                  Select department
                </option>
                {activeDepts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Assign available Doctor
              </label>
              <select
                value={assignedDocId}
                onChange={(e) => setAssignedDocId(e.target.value)}
                disabled={filteredDocs.length === 0}
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold disabled:opacity-50"
                required
              >
                {filteredDocs.map((doc) => (
                  <option key={doc.userId} value={doc.userId}>
                    Dr. {doc.firstName} {doc.lastName} ({doc.specialization})
                  </option>
                ))}
                {filteredDocs.length === 0 && (
                  <option value="">
                    No available doctors in this department
                  </option>
                )}
              </select>
            </div>

            {/* Triage type */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Triage Category
              </label>
              <select
                value={triageType}
                onChange={(e) => setTriageType(e.target.value)}
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold"
              >
                <option value="consultation">General Consultation</option>
                <option value="new_patient">First Time Checkup</option>
                <option value="follow_up">Follow Up Session</option>
                <option value="emergency">Emergency Trauma</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Symptom details / Medical Notes
              </label>
              <textarea
                rows="3"
                value={triageReason}
                onChange={(e) => setTriageReason(e.target.value)}
                placeholder="Inspect or add clinical triage notes..."
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-150 pt-4 mt-6">
              <Button variant="outline" onClick={() => setSelectedApp(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={filteredDocs.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Confirm Appointment Slot
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
