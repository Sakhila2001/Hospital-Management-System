import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
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

export default function PatientOverview({
  patient,
  setActiveTab,
  triggerToast,
}) {
  const { appointments, updateAppointmentStatus } = useAdmin();

  // Filter appointments for current patient
  const patientApps = appointments.filter(
    (app) => app.patientId === patient.userId,
  );

  const pendingApps = patientApps.filter((a) => a.status === "pending");
  const confirmedApps = patientApps.filter((a) => a.status === "confirmed");

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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 -mr-10 -mt-10" />
        <h3 className="text-xl font-bold">Hello, {patient.firstName}!</h3>
        <p className="text-xs text-teal-100 mt-1 max-w-md">
          Welcome to your City Care portal. Check your clinic schedules, view
          doctor routing triage details, or request a new consultation session.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card
          title="Total Requested"
          value={patientApps.length}
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
                <th scope="col" className="px-6 py-3">
                  Preferred Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Time Slot
                </th>
                <th scope="col" className="px-6 py-3">
                  Triage Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Routed Department
                </th>
                <th scope="col" className="px-6 py-3">
                  Assigned Doctor
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
              {patientApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {app.date}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {app.time}
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-550 font-semibold">
                    {app.type.replace("_", " ")}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {app.departmentName}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {app.doctorName}
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
                      <span className="text-xs text-gray-400 font-medium">
                        -
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {patientApps.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-gray-400 font-medium bg-white"
                  >
                    You have no scheduled consultations. Click "Book
                    Appointment" above to submit a triage request.
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
