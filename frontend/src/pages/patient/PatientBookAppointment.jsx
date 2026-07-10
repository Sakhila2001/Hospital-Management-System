import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useOutletContext } from "react-router-dom";

const TYPES = [
  { value: "consultation", label: "General Consultation" },
  { value: "new_patient", label: "First Time Checkup" },
  { value: "follow_up", label: "Follow Up Session" },
  { value: "emergency", label: "Emergency Trauma (Triage priority)" },
];

export default function PatientBookAppointment() {
  const { patient, triggerToast } = useOutletContext();
  const { bookAppointment } = useAdmin();

  const [formData, setFormData] = useState({
    date: "",
    time: "09:00",
    type: "consultation",
    appointmentReason: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    try {
      if (!formData.date) {
        throw new Error("Please select a preferred date.");
      }
      if (!formData.appointmentReason.trim()) {
        throw new Error("Please describe the reason for your visit.");
      }

      bookAppointment({
        patientFirstName: patient.firstName,
        patientLastName: patient.lastName,
        patientEmail: patient.email,
        patientPhone: patient.phone,
        patientGender: patient.gender,
        patientDOB: patient.dateOfBirth,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        appointmentReason: formData.appointmentReason,
      });

      triggerToast(
        "Your triage appointment request has been submitted to the front desk!",
      );
      setActiveTab("overview");
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  return (
    <Card title="Request Triage Appointment">
      <p className="text-xs text-gray-500 mb-6 leading-relaxed">
        Specify your preferred schedule, select a triage type, and explain your
        symptoms. A receptionist will inspect your request, assign the
        appropriate specialist and department, and confirm your slot.
      </p>

      <form onSubmit={handleBookingSubmit} className="space-y-5">
        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Preferred Date"
            name="date"
            type="date"
            required
            value={formData.date}
            onChange={handleChange}
          />

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              Preferred Time Slot
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none font-medium"
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

        {/* Triage type */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
            Triage Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none font-semibold text-gray-700"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
            Reason / Symptoms *
          </label>
          <textarea
            rows="4"
            name="appointmentReason"
            value={formData.appointmentReason}
            onChange={handleChange}
            placeholder="Please write details about your symptoms or purpose of checkup..."
            className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
            required
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
          <Button variant="outline" onClick={() => setActiveTab("overview")}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Request Appointment
          </Button>
        </div>
      </form>
    </Card>
  );
}
