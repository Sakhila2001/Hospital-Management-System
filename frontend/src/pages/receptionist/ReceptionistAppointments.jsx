import React, { useState } from "react";
import { useReceptionist } from "../../context/receptionist/ReceptionistContext";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { useOutletContext } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function ReceptionistAppointments() {
  const { receptionist, triggerToast } = useOutletContext();
  const { appointments, updateAppointmentStatus } = useReceptionist();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter only confirmed/completed/cancelled appointments (exclude pending since they wait in triage)
  // Optionally filter by receptionist department
  const filteredApps = appointments.filter((app) => {
    if (app.status === "pending") return false;

    // Scoped to receptionist department if receptionist is bound to one
    if (
      receptionist.departmentId &&
      app.departmentId !== receptionist.departmentId
    ) {
      return false;
    }

    const matchesSearch =
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.departmentName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Cancellation modal state
  const [cancelTarget, setCancelTarget] = useState(null); // holds the appointment being cancelled
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCancelModal = (appointment) => {
    setCancelTarget(appointment);
    setCancelReason("");
    setCancelError("");
  };

  const closeCancelModal = () => {
    if (isSubmitting) return; // don't allow closing mid-submit
    setCancelTarget(null);
    setCancelReason("");
    setCancelError("");
  };

  const handleConfirmCancel = async () => {
    const trimmedReason = cancelReason.trim();
    if (!trimmedReason) {
      setCancelError(
        "Please provide a reason for cancelling this appointment.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAppointmentStatus(cancelTarget.id, "cancelled", {
        cancelledReason: trimmedReason,
      });
      triggerToast("Appointment cancelled successfully.");
      closeCancelModal();
    } catch (err) {
      setCancelError(
        err.message || "Failed to cancel appointment. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
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
        <div className="overflow-x-auto scrollbar-hide -mx-6">
          <table className="w-full text-sm text-left text-gray-500 min-w-[700px]">
            <thead className="text-xs text-gray-700 bg-gray-50/75 border-b border-gray-150">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Patient Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Doctor Assigned
                </th>
                <th scope="col" className="px-6 py-3">
                  Department
                </th>
                <th scope="col" className="px-6 py-3">
                  Scheduled Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Time Slot
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
                    {app.patientName}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {app.doctorName}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {app.departmentName}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-650">
                    {app.date}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {app.time}
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
                              : "gray"
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {app.status === "confirmed" ? (
                      <Button
                        variant="outline"
                        onClick={() => openCancelModal(app)}
                        className="py-1 px-3 text-xs border-red-200 text-red-650 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
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
                    No scheduled department visits match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cancellation Reason Modal */}
      <Modal
        isOpen={!!cancelTarget}
        onClose={closeCancelModal}
        title="Cancel Appointment"
        badge="Confirmation Required"
      >
        {cancelTarget && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                You're about to cancel{" "}
                <span className="font-semibold">
                  {cancelTarget.patientName}
                </span>
                's appointment on{" "}
                <span className="font-semibold">{cancelTarget.date}</span> at{" "}
                <span className="font-semibold">{cancelTarget.time}</span>. This
                action cannot be undone.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                Reason for Cancellation <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="3"
                value={cancelReason}
                onChange={(e) => {
                  setCancelReason(e.target.value);
                  if (cancelError) setCancelError("");
                }}
                placeholder="e.g. Doctor unavailable, patient rescheduled, department closure..."
                className={`w-full bg-gray-50 border rounded-lg p-2.5 text-sm focus:bg-white outline-none transition-all ${
                  cancelError
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-teal-500"
                }`}
                autoFocus
              />
              {cancelError && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {cancelError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="secondary"
                onClick={closeCancelModal}
                disabled={isSubmitting}
                className="rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                Keep Appointment
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleConfirmCancel}
                disabled={isSubmitting}
                className="rounded-full bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
