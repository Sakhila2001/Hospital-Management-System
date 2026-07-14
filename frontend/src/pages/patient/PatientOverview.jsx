import React, { useState } from "react";
import { usePatient } from "../../context/patient/PatientContext";
import { useOutletContext } from "react-router-dom";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import {
  CalendarIcon,
  ClockIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function PatientOverview() {
  // patient and triggerToast come from PatientDashboard via Outlet context
  const { patient, triggerToast } = useOutletContext();

  // appointments and cancel action come from PatientContext (real API)
  const {
    appointments,
    appointmentsLoading,
    updateAppointmentStatus,
    acceptReschedule,
    rejectReschedule,
  } = usePatient();

  const pendingApps = appointments.filter((a) => a.status === "pending");
  const confirmedApps = appointments.filter((a) => a.status === "confirmed");

  // Cancellation modal state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCancelModal = (appointment) => {
    setCancelTarget(appointment);
    setCancelReason("");
    setCancelError("");
  };

  const closeCancelModal = () => {
    if (isSubmitting) return;
    setCancelTarget(null);
    setCancelReason("");
    setCancelError("");
  };

  const handleConfirmCancel = async () => {
    const trimmedReason = cancelReason.trim();
    if (!trimmedReason) {
      setCancelError("Please provide a reason for cancelling this appointment.");
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
        err.message || "Failed to cancel appointment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const proposals = appointments.filter((a) => a.rescheduleRequested);

  const handleAcceptProposal = async (id) => {
    try {
      await acceptReschedule(id);
      triggerToast("Reschedule proposal accepted! Appointment is now confirmed.", "success");
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  const handleRejectProposal = async (id) => {
    try {
      await rejectReschedule(id);
      triggerToast("Reschedule proposal rejected. Returning back to desk.", "success");
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  if (appointmentsLoading) {
    return (
      <p className="text-sm text-gray-400 text-center py-10">
        Loading your appointments...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 -mr-10 -mt-10" />
        <h3 className="text-xl font-bold">
          Hello, {patient?.firstName || "Patient"}!
        </h3>
        <p className="text-xs text-teal-100 mt-1 max-w-md">
          Welcome to your City Care portal. Check your clinic schedules, view
          doctor routing triage details, or request a new consultation session.
        </p>
      </div>

      {/* Reschedule Proposals Block */}
      {proposals.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            ⚠️ Attention Required: Reschedule Requests
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {proposals.map((app) => (
              <div
                key={app.id}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-900 uppercase">
                    Proposed Change for Triage Request ({app.type?.replace("_", " ")})
                  </p>
                  <p className="text-xs text-gray-700">
                    The receptionist requested changes for your slot on <span className="font-semibold text-gray-900">{app.date}</span> at <span className="font-semibold text-gray-900">{app.time}</span>.
                  </p>
                  <div className="text-xs bg-white/80 p-2 rounded border border-amber-100 mt-2 space-y-1">
                    <p className="text-teal-900 font-semibold">
                      👉 Proposed Slot: <span className="font-bold">{app.proposedDate}</span> at <span className="font-bold">{app.proposedTime}</span>
                    </p>
                    <p className="text-gray-650 font-medium">
                      👉 Department: <span className="font-semibold text-gray-800">{app.proposedDepartmentName}</span> | Doctor: <span className="font-semibold text-gray-800">{app.proposedDoctorName}</span>
                    </p>
                    {app.rescheduleReason && (
                      <p className="text-gray-500 italic mt-1">
                        Reason: "{app.rescheduleReason}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleRejectProposal(app.id)}
                    className="px-4 py-2 bg-white hover:bg-red-50 text-red-650 hover:text-red-700 border border-red-200 text-xs font-bold rounded-full transition-all cursor-pointer"
                  >
                    Reject Proposal
                  </button>
                  <button
                    onClick={() => handleAcceptProposal(app.id)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-full shadow-xs transition-all cursor-pointer"
                  >
                    Accept & Confirm
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card
          title="Total Requested"
          value={appointments.length}
          subtitle="Visits log"
          icon={CalendarIcon}
        />
        <Card
          title="Pending Triage"
          value={pendingApps.length}
          subtitle="Awaiting routing"
          icon={ArrowPathIcon}
        />
        <Card
          title="Confirmed Visits"
          value={confirmedApps.length}
          subtitle="Ready sessions"
          icon={ClockIcon}
        />
      </div>

      {/* Appointments List */}
      <Card title="Your Clinic Bookings">
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm text-left text-gray-500 min-w-[600px]">
            <thead className="text-xs text-gray-700 bg-gray-50/75 border-b border-gray-150">
              <tr>
                <th scope="col" className="px-6 py-3">Preferred Date</th>
                <th scope="col" className="px-6 py-3">Time Slot</th>
                <th scope="col" className="px-6 py-3">Triage Type</th>
                <th scope="col" className="px-6 py-3">Routed Department</th>
                <th scope="col" className="px-6 py-3">Assigned Doctor</th>
                <th scope="col" className="px-6 py-3 text-center">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {app.date}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {app.time}
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-550 font-semibold">
                    {app.type?.replace("_", " ") || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {app.departmentName || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {app.doctorName || "—"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      text={app.rescheduleRequested ? "slot proposal" : app.status}
                      variant={
                        app.rescheduleRequested
                          ? "warning"
                          : app.status === "confirmed"
                          ? "info"
                          : app.status === "completed"
                          ? "success"
                          : app.status === "cancelled"
                          ? "danger"
                          : "warning"
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {app.status === "pending" ? (
                      <Button
                        variant="danger"
                        onClick={() => openCancelModal(app)}
                        className="py-1 px-3 text-xs"
                      >
                        Cancel
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-gray-400 font-medium bg-white"
                  >
                    You have no scheduled consultations. Click "Book Appointment"
                    above to submit a triage request.
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
                You're about to cancel your appointment on{" "}
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
                placeholder="e.g. Schedule conflict, feeling better, found another provider..."
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
