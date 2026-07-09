import React from "react";
import { useAdmin } from "../../context/AdminContext";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import { CalendarIcon, ClockIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function PatientOverview({ patient, setActiveTab, triggerToast }) {
  const { appointments, updateAppointmentStatus } = useAdmin();

  // Filter appointments for current patient
  const patientApps = appointments.filter((app) => app.patientId === patient.userId);

  const pendingApps = patientApps.filter((a) => a.status === "pending");
  const confirmedApps = patientApps.filter((a) => a.status === "confirmed");

  const handleCancelAppointment = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment request?")) {
      updateAppointmentStatus(id, "cancelled");
      triggerToast("Appointment cancelled successfully.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 -mr-10 -mt-10" />
        <h3 className="text-xl font-bold">Hello, {patient.firstName}!</h3>
        <p className="text-xs text-teal-100 mt-1 max-w-md">
          Welcome to your City Care portal. Check your clinic schedules, view doctor routing triage details, or request a new consultation session.
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
              {patientApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{app.date}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{app.time}</td>
                  <td className="px-6 py-4 capitalize text-gray-550 font-semibold">{app.type.replace("_", " ")}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{app.departmentName}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{app.doctorName}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      text={app.status}
                      variant={
                        app.status === "confirmed" ? "info" :
                        app.status === "completed" ? "success" :
                        app.status === "cancelled" ? "danger" :
                        "warning"
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {app.status === "pending" ? (
                      <Button
                        variant="danger"
                        onClick={() => handleCancelAppointment(app.id)}
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
              {patientApps.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400 font-medium bg-white">
                    You have no scheduled consultations. Click "Book Appointment" above to submit a triage request.
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
