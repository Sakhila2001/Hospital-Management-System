import React, { useState, useMemo } from "react";
import { usePatient } from "../../context/patient/PatientContext";
import { useOutletContext } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import { adToBS, formatBS } from "../../utils/nepaliDate";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const TYPES = [
  { value: "consultation", label: "General Consultation" },
  { value: "new_patient", label: "First Time Checkup" },
  { value: "follow_up", label: "Follow Up Session" },
  { value: "emergency", label: "Emergency Trauma (Triage priority)" },
];

export default function PatientBookAppointment() {
  const { triggerToast } = useOutletContext();
  const { appointments, bookAppointment } = usePatient();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    time: "09:00",
    type: "consultation",
    appointmentReason: "",
  });

  const appointmentsByDate = useMemo(() => {
    const map = {};
    appointments.forEach((app) => {
      if (!map[app.date]) {
        map[app.date] = [];
      }
      map[app.date].push(app);
    });
    return map;
  }, [appointments]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthWeeks = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const weeks = [];
    let currentWeek = Array(7).fill(null);

    // Fill preceding month's empty slots
    for (let i = 0; i < firstDayIndex; i++) {
      currentWeek[i] = null;
    }

    let colIndex = firstDayIndex;
    for (let d = 1; d <= daysInMonth; d++) {
      if (colIndex === 7) {
        weeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
        colIndex = 0;
      }
      currentWeek[colIndex] = new Date(year, month, d);
      colIndex++;
    }
    if (currentWeek.some((val) => val !== null)) {
      weeks.push(currentWeek);
    }
    return weeks;
  }, [year, month]);

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleDateClick = (date) => {
    if (!date) return;

    const todayStr = new Date().toISOString().split("T")[0];
    const clickedStr = date.toISOString().split("T")[0];

    // Check if clicked date has appointments (past or present)
    const dateApps = appointmentsByDate[clickedStr] || [];

    if (dateApps.length > 0) {
      // Show details of the existing appointment
      setSelectedAppointment(dateApps[0]);
      return;
    }

    if (clickedStr < todayStr) {
      triggerToast("Cannot request appointments on past dates.", "error");
      return;
    }

    setSelectedDateStr(clickedStr);
    setIsBookingOpen(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDateStr) return;
    if (!formData.appointmentReason.trim()) {
      triggerToast("Please enter a reason for the appointment.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await bookAppointment({
        date: selectedDateStr,
        time: formData.time,
        type: formData.type,
        appointmentReason: formData.appointmentReason,
      });
      triggerToast("Appointment requested successfully!", "success");
      setIsBookingOpen(false);
      setFormData({
        time: "09:00",
        type: "consultation",
        appointmentReason: "",
      });
    } catch (err) {
      triggerToast(err.message || "Failed to book appointment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const monthNameAD = currentDate.toLocaleString("default", { month: "long" });
  const bsHeaderStart = adToBS(new Date(year, month, 1));
  const bsHeaderEnd = adToBS(new Date(year, month + 1, 0));

  return (
    <div className="space-y-6">
      <Card title="Appointment Planner & Booking Calendar">
        <p className="text-xs text-gray-500 mb-4">
          Click on any upcoming day (highlighted) to request a new triage
          appointment. Dates with existing bookings (past or future) contain
          colored badge dots; click them to view detailed appointment
          information.
        </p>

        {/* Calendar Header Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all border border-gray-250 cursor-pointer"
            >
              <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all border border-gray-250 cursor-pointer"
            >
              <ChevronRightIcon className="h-4 w-4 text-gray-600" />
            </button>
            <h3 className="text-lg font-bold text-gray-800 ml-2">
              {monthNameAD} {year}
            </h3>
          </div>

          <div className="bg-teal-50 border border-teal-200 text-teal-800 text-xs px-3 py-1.5 rounded-lg font-semibold shadow-xs">
            🇳🇵 BS Calendar:{" "}
            {bsHeaderStart
              ? `${bsHeaderStart.monthName} ${bsHeaderStart.year}`
              : ""}
            {bsHeaderEnd && bsHeaderStart?.monthName !== bsHeaderEnd.monthName
              ? ` / ${bsHeaderEnd.monthName}`
              : ""}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-500 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2 bg-gray-50/50 rounded">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {monthWeeks.map((week, wIdx) =>
            week.map((date, dIdx) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${wIdx}-${dIdx}`}
                    className="min-h-[90px] bg-gray-50/20 border border-dashed border-gray-100 rounded-xl"
                  />
                );
              }

              const dateStr = date.toISOString().split("T")[0];
              const todayStr = new Date().toISOString().split("T")[0];
              const isToday = dateStr === todayStr;
              const isPast = dateStr < todayStr;
              const dateApps = appointmentsByDate[dateStr] || [];
              const bsDate = adToBS(date);

              return (
                <button
                  key={dateStr}
                  onClick={() => handleDateClick(date)}
                  className={`min-h-[95px] flex flex-col justify-between p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                    isToday
                      ? "bg-teal-50/40 border-teal-400 shadow-xs"
                      : isPast
                        ? "bg-gray-50/40 border-gray-200"
                        : "bg-white border-gray-200 hover:border-teal-500 hover:shadow-xs"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    {/* AD Date Day Number */}
                    <span
                      className={`text-sm font-bold ${
                        isToday
                          ? "text-teal-700"
                          : isPast
                            ? "text-gray-400"
                            : "text-gray-700"
                      }`}
                    >
                      {date.getDate()}
                    </span>

                    {/* BS Date (Day Number) */}
                    {bsDate && (
                      <span className="text-[10px] text-gray-400 font-medium">
                        {bsDate.day}
                      </span>
                    )}
                  </div>

                  {/* Appointments indicator tags */}
                  <div className="w-full space-y-1 mt-1">
                    {dateApps.map((app) => (
                      <div
                        key={app.id}
                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold truncate ${
                          app.status === "confirmed"
                            ? "bg-teal-100 text-teal-800"
                            : app.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : app.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {app.status === "confirmed"
                          ? `Dr. ${app.doctorName?.replace("Dr. ", "")}`
                          : app.status}
                      </div>
                    ))}

                    {/* Hint to book when empty & future */}
                    {!isPast && dateApps.length === 0 && (
                      <span className="text-[9px] text-gray-300 group-hover:text-teal-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        + Request
                      </span>
                    )}
                  </div>
                </button>
              );
            }),
          )}
        </div>
      </Card>

      {/* Appointment Detail View Modal */}
      <Modal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        title="Appointment Summary Details"
        badge="Clinic Visit Log"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  text={selectedAppointment.status}
                  variant={
                    selectedAppointment.status === "confirmed"
                      ? "info"
                      : selectedAppointment.status === "completed"
                        ? "success"
                        : selectedAppointment.status === "cancelled"
                          ? "danger"
                          : "warning"
                  }
                />
                <span className="text-[10px] font-bold text-gray-450 uppercase">
                  ID: #{selectedAppointment.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-medium text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>
                    <b>Date (AD):</b> {selectedAppointment.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>
                    <b>Date (BS):</b>{" "}
                    {adToBS(new Date(selectedAppointment.date))
                      ? formatBS(adToBS(new Date(selectedAppointment.date)))
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>
                    <b>Time Slot:</b> {selectedAppointment.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardDocumentListIcon className="h-4 w-4 text-teal-600 shrink-0" />
                  <span className="capitalize">
                    <b>Triage Type:</b>{" "}
                    {selectedAppointment.type?.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200/60 pt-2 text-xs">
                <p className="text-gray-500">
                  <b>Routed Department:</b>{" "}
                  {selectedAppointment.departmentName ||
                    "Awaiting front desk review"}
                </p>
                <p className="text-gray-500 mt-1">
                  <b>Assigned Provider:</b>{" "}
                  {selectedAppointment.doctorName || "Awaiting assignment"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-450 uppercase mb-1">
                Your Symptom Description Notes
              </p>
              <div className="text-xs text-gray-700 bg-white border border-gray-200 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">
                {selectedAppointment.appointmentReason ||
                  "No details provided."}
              </div>
            </div>

            {selectedAppointment.status === "cancelled" &&
              selectedAppointment.cancelledReason && (
                <div className="bg-red-50/50 border border-red-100 rounded-lg p-3 text-xs text-red-800">
                  <p className="font-bold">Cancellation Reason:</p>
                  <p className="mt-1 font-medium">
                    {selectedAppointment.cancelledReason}
                  </p>
                </div>
              )}

            <div className="flex justify-end pt-3 border-t border-gray-150">
              <Button
                variant="secondary"
                onClick={() => setSelectedAppointment(null)}
              >
                Close View
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Appointment Booking Request Form Modal */}
      <Modal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        title="Request Consultation Triage"
        badge="New Session"
      >
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-150 text-xs">
            <div>
              <span className="text-gray-400 font-medium">
                AD Calendar Date:
              </span>
              <p className="font-bold text-gray-750">{selectedDateStr}</p>
            </div>
            <div>
              <span className="text-gray-400 font-medium">
                Bikram Sambat Date:
              </span>
              <p className="font-bold text-teal-700">
                {selectedDateStr
                  ? formatBS(adToBS(new Date(selectedDateStr)))
                  : ""}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-550 uppercase mb-1">
              Select Preferred Time
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:ring-teal-500 outline-none"
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

          <div>
            <label className="block text-[10px] font-bold text-gray-550 uppercase mb-1">
              Triage Classification Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:ring-teal-500 outline-none"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-550 uppercase mb-1">
              Reason / Symptom Log *
            </label>
            <textarea
              name="appointmentReason"
              value={formData.appointmentReason}
              onChange={handleChange}
              rows="4"
              placeholder="Describe your current status or symptoms..."
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-150">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsBookingOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit Triage Request"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
