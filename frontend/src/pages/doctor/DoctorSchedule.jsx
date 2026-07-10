import React, { useMemo, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { ClockIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m || 0));
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

// Builds the next 7 calendar days starting today
function getNext7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function DoctorSchedule({ doctor, triggerToast }) {
  const { appointments, patients } = useAdmin();

  const doctorApps = appointments.filter((app) => app.doctorId === 101 || app.doctorId === 1);

  const next7Days = useMemo(() => getNext7Days(), []);
  const availableDaySet = new Set(doctor.availableDays || []);

  // Selected patient for medical record viewing
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleOpenPatientDetails = (patientName) => {
    const match = patients.find(
      (p) => `${p.firstName} ${p.lastName}`.toLowerCase() === patientName.toLowerCase()
    );
    if (match) {
      setSelectedPatient(match);
    } else if (triggerToast) {
      triggerToast("Patient clinical record not found.", "error");
    }
  };

  const appsByDate = useMemo(() => {
    const map = {};
    doctorApps.forEach((app) => {
      if (app.status !== "confirmed" && app.status !== "pending") return;
      const key = new Date(app.date).toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(app);
    });
    Object.values(map).forEach((list) =>
      list.sort((a, b) => a.time.localeCompare(b.time))
    );
    return map;
  }, [doctorApps]);

  return (
    <div className="space-y-6">
      {/* Weekly availability strip */}
      <Card title="Weekly Availability">
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <ClockIcon className="h-4 w-4 text-teal-600" />
          <span>
            {doctor.availableTimeStart && doctor.availableTimeEnd
              ? `${formatTime(doctor.availableTimeStart)} – ${formatTime(doctor.availableTimeEnd)}`
              : "Working hours not set"}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {WEEK_DAYS.map((day) => {
            const active = availableDaySet.has(day);
            return (
              <div
                key={day}
                className={`rounded-lg p-3 text-center border ${
                  active
                    ? "bg-teal-50 border-teal-200 text-teal-700"
                    : "bg-gray-50 border-gray-100 text-gray-350"
                }`}
              >
                <p className="text-xs font-bold uppercase">{day}</p>
                <p className="text-[10px] mt-1 font-medium">
                  {active ? "On Duty" : "Off"}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Next 7 days schedule */}
      <Card title="Upcoming Schedule (Next 7 Days)">
        <div className="space-y-3">
          {next7Days.map((day) => {
            const key = day.toDateString();
            const dayApps = appsByDate[key] || [];
            const isToday = key === new Date().toDateString();
            const dayAbbrev = WEEK_DAYS[day.getDay()];
            const isWorkingDay = availableDaySet.has(dayAbbrev);

            return (
              <div
                key={key}
                className={`rounded-xl border p-4 ${
                  isToday ? "border-teal-300 bg-teal-50/40" : "border-gray-100 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4 text-teal-600" />
                    <span className="text-sm font-semibold text-gray-800">
                      {day.toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {isToday && <Badge text="Today" variant="info" />}
                  </div>
                  {!isWorkingDay && (
                    <span className="text-xs text-gray-400 font-medium italic">Not on duty</span>
                  )}
                </div>

                {dayApps.length > 0 ? (
                  <div className="space-y-2">
                    {dayApps.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-800 w-16">{app.time}</span>
                          <button
                            onClick={() => handleOpenPatientDetails(app.patientName)}
                            className="text-teal-600 hover:text-teal-500 hover:underline font-semibold cursor-pointer"
                          >
                            {app.patientName}
                          </button>
                          <span className="text-gray-400 capitalize text-xs">
                            {app.type.replace("_", " ")}
                          </span>
                        </div>
                        <Badge
                          text={app.status}
                          variant={app.status === "confirmed" ? "info" : "warning"}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No appointments scheduled.</p>
                )}
              </div>
            );
          })}
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