import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

export default function DoctorAppointments({ doctor, triggerToast }) {
  const { appointments, patients, updateAppointmentStatus } = useAdmin();

  // Filter appointments assigned to this doctor
  const doctorApps = appointments.filter((app) => app.doctorId === 101 || app.doctorId === 1);

  // Selected patient for medical record viewing
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleOpenPatientDetails = (patientName) => {
    // Find patient record by name
    const match = patients.find(
      (p) => `${p.firstName} ${p.lastName}`.toLowerCase() === patientName.toLowerCase()
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
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm text-left text-gray-500 min-w-[700px]">
            <thead className="text-xs text-gray-700 bg-gray-50/75 border-b border-gray-150">
              <tr>
                <th scope="col" className="px-6 py-3">Patient Name</th>
                <th scope="col" className="px-6 py-3">Scheduled Date</th>
                <th scope="col" className="px-6 py-3">Time Slot</th>
                <th scope="col" className="px-6 py-3">Triage Type</th>
                <th scope="col" className="px-6 py-3">Triage Reason</th>
                <th scope="col" className="px-6 py-3 text-center">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {doctorApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    <button
                      onClick={() => handleOpenPatientDetails(app.patientName)}
                      className="text-teal-600 hover:text-teal-500 hover:underline font-bold text-left cursor-pointer"
                    >
                      {app.patientName}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">{app.date}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{app.time}</td>
                  <td className="px-6 py-4 capitalize text-gray-550 font-semibold">{app.type.replace("_", " ")}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium max-w-xs truncate" title={app.appointmentReason}>
                    {app.appointmentReason || "N/A"}
                  </td>
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
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    {app.status === "confirmed" ? (
                      <>
                        <Button
                          variant="primary"
                          onClick={() => handleUpdateStatus(app.id, "completed")}
                          className="py-1 px-3 text-xs"
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
                      <span className="text-xs text-gray-400 font-medium">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {doctorApps.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400 font-medium bg-white">
                    No scheduled patient consults are assigned to you at the moment.
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
        title={selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : "Patient History"}
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase">Personal details</span>
              <Badge text={`Blood: ${selectedPatient.bloodGroup}`} variant="info" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <p><b>Email:</b> {selectedPatient.email}</p>
              <p><b>Phone:</b> {selectedPatient.phone}</p>
              <p><b>Gender:</b> <span className="capitalize">{selectedPatient.gender}</span></p>
              <p><b>DOB:</b> {selectedPatient.dateOfBirth}</p>
            </div>

            <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-4 text-xs">
              <div className="bg-red-50/50 p-2.5 rounded-lg border border-red-100">
                <p className="font-semibold text-red-800">Allergies:</p>
                <p className="text-red-700 mt-1 font-medium">{selectedPatient.allergies || "None declared."}</p>
              </div>
              <div className="bg-yellow-50/50 p-2.5 rounded-lg border border-yellow-100">
                <p className="font-semibold text-yellow-800">Chronic Conditions:</p>
                <p className="text-yellow-700 mt-1 font-medium">{selectedPatient.chronicConditions || "None declared."}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <p className="text-sm font-semibold text-gray-800">Emergency Contact Info:</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <p><b>Contact:</b> {selectedPatient.emergencyContactName}</p>
                <p><b>Phone:</b> {selectedPatient.emergencyContactPhone}</p>
                <p><b>Relation:</b> {selectedPatient.emergencyContactRelation}</p>
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
