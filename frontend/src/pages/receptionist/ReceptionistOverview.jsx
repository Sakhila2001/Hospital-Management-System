import React, { useState, useEffect } from "react";
import { useReceptionist } from "../../context/receptionist/ReceptionistContext";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { useOutletContext } from "react-router-dom";

export default function ReceptionistOverview() {
  const { receptionist, triggerToast } = useOutletContext();
  const {
    appointments,
    departments = [],
    doctors = [],
    updateAppointmentStatus,
    assignDoctorAndDepartment,
    proposeReschedule,
  } = useReceptionist();

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

  // Reschedule proposal states
  const [isProposal, setIsProposal] = useState(false);
  const [proposedDate, setProposedDate] = useState("");
  const [proposedTime, setProposedTime] = useState("09:00");
  const [rescheduleReason, setRescheduleReason] = useState("");

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
      setProposedDate(selectedApp.date || "");
      setProposedTime(selectedApp.time || "09:00");
      setRescheduleReason("");
      setIsProposal(false);
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

  const handleTriageSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!routedDeptId) throw new Error("Please assign a department");
      if (!assignedDocId) throw new Error("Please assign an available doctor");

      if (isProposal) {
        // Send reschedule change proposal request
        await proposeReschedule(selectedApp.id, {
          proposedDate,
          proposedTime,
          proposedDoctorId: Number(assignedDocId),
          proposedDepartmentId: Number(routedDeptId),
          rescheduleReason:
            rescheduleReason ||
            "Unavailability of the doctor on requested slot",
        });
        triggerToast("Reschedule proposal submitted to patient successfully!");
      } else {
        // Direct confirmation
        await assignDoctorAndDepartment(selectedApp.id, {
          departmentId: Number(routedDeptId),
          doctorId: Number(assignedDocId),
          appointmentReason: triageReason,
        });
        triggerToast("Appointment triaged and routed successfully!");
      }
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
                    <Badge
                      text={
                        app.rescheduleRequested ? "proposed slot" : app.status
                      }
                      variant={app.rescheduleRequested ? "info" : "warning"}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant={
                        app.rescheduleRequested ? "secondary" : "primary"
                      }
                      onClick={() => setSelectedApp(app)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      {app.rescheduleRequested ? "Change Proposal" : "Assign"}
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

            {/* Toggle to suggest a reschedule */}
            <div className="flex items-center gap-2 py-1 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
              <input
                type="checkbox"
                id="isProposalCheck"
                checked={isProposal}
                onChange={(e) => setIsProposal(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-550"
              />
              <label
                htmlFor="isProposalCheck"
                className="text-xs font-semibold text-amber-900 cursor-pointer"
              >
                Propose different slot/reschedule (Doctor slot conflict)?
              </label>
            </div>

            {isProposal && (
              <div className="space-y-3 p-3 bg-teal-50/40 rounded-lg border border-teal-100 animate-fadeIn">
                <h5 className="text-[10px] font-extrabold text-teal-800 uppercase tracking-wide">
                  Reschedule Change Proposal
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase">
                      Proposed Date
                    </label>
                    <input
                      type="date"
                      value={proposedDate}
                      onChange={(e) => setProposedDate(e.target.value)}
                      className="mt-1 w-full bg-white border border-gray-300 rounded-lg p-1.5 text-xs focus:ring-teal-500 font-semibold"
                      required={isProposal}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase">
                      Proposed Time Slot
                    </label>
                    <select
                      value={proposedTime}
                      onChange={(e) => setProposedTime(e.target.value)}
                      className="mt-1 w-full bg-white border border-gray-300 rounded-lg p-1.5 text-xs focus:ring-teal-500 font-semibold"
                      required={isProposal}
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase">
                    Reschedule Reason
                  </label>
                  <textarea
                    rows="2"
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    placeholder="e.g. Doctor is not available on Thursdays, fits better in afternoon slot..."
                    className="mt-1 w-full bg-white border border-gray-300 rounded-lg p-1.5 text-xs focus:ring-teal-500 outline-none"
                    required={isProposal}
                  />
                </div>
              </div>
            )}

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
                {isProposal
                  ? "Propose Reschedule to Patient"
                  : "Confirm Appointment Slot"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
