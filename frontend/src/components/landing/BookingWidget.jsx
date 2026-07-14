import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function BookingWidget() {
  const { user, loading: authLoading } = useAuth();

  const isLoggedInPatient =
    !authLoading && user && user.roles === "patient";

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const [submitting, setSubmitting] = useState(false);

  const [publicForm, setPublicForm] = useState({
    patientFirstName: "",
    patientLastName: "",
    patientEmail: "",
    patientPhone: "",
    patientGender: "male",
    patientDOB: "",
    date: "",
    time: "09:00",
    type: "consultation",
    reason: "",
  });

  const [patientForm, setPatientForm] = useState({
    date: "",
    time: "09:00",
    type: "consultation",
    reason: "",
  });

  useEffect(() => {
    if (isLoggedInPatient && user) {
      setPublicForm((prev) => ({
        ...prev,
        patientFirstName: user.firstName || "",
        patientLastName: user.lastName || "",
        patientEmail: user.email || "",
      }));
    }
  }, [isLoggedInPatient, user]);

  const handlePublicChange = (e) => {
    setPublicForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePatientChange = (e) => {
    setPatientForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePublicSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!publicForm.date) {
        throw new Error("Please pick a scheduled date.");
      }

      const payload = {
        firstName: publicForm.patientFirstName,
        lastName: publicForm.patientLastName,
        email: publicForm.patientEmail,
        phone: publicForm.patientPhone,
        gender: publicForm.patientGender,
        dateOfBirth: publicForm.patientDOB,
        appointmentDate: publicForm.date,
        appointmentTime: publicForm.time,
        type: publicForm.type,
        appointmentReason: publicForm.reason,
      };

      const res = await api.post("/appointments/public", payload);

      triggerToast(
        `Appointment booked successfully! Status: ${res.data.data.appointment.status.toUpperCase()}`,
      );

      setPublicForm({
        patientFirstName: "",
        patientLastName: "",
        patientEmail: "",
        patientPhone: "",
        patientGender: "male",
        patientDOB: "",
        date: "",
        time: "09:00",
        type: "consultation",
        reason: "",
      });
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to book appointment";
      triggerToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!patientForm.date) {
        throw new Error("Please pick a scheduled date.");
      }

      const res = await api.post("/appointments", {
        appointmentDate: patientForm.date,
        appointmentTime: patientForm.time,
        type: patientForm.type,
        appointmentReason: patientForm.reason,
      });

      triggerToast(
        `Appointment booked successfully! Status: ${res.data.data.appointment.status.toUpperCase()}`,
      );

      setPatientForm({
        date: "",
        time: "09:00",
        type: "consultation",
        reason: "",
      });
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to book appointment";
      triggerToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
            Appointment Desk
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Book an Online Appointment
          </h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            {isLoggedInPatient
              ? "Schedule a clinic consult session. Fill out the form below to secure your consultation slot."
              : "Schedule a clinic consult session. Fill out the medical booking form below to secure your consultation slot."}
          </p>
        </div>

        {isLoggedInPatient ? (
          <form
            onSubmit={handlePatientSubmit}
            className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-100 pb-1.5">
                Appointment Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    name="date"
                    value={patientForm.date}
                    onChange={handlePatientChange}
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Preferred Time Slot
                  </label>
                  <select
                    name="time"
                    value={patientForm.time}
                    onChange={handlePatientChange}
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none font-medium"
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
                <label className="block text-xs font-bold text-gray-500 uppercase">
                  Appointment Type
                </label>
                <select
                  name="type"
                  value={patientForm.type}
                  onChange={handlePatientChange}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none font-medium"
                >
                  <option value="new_patient">New Patient</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="consultation">Consultation</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">
                  Reason for Visit
                </label>
                <textarea
                  name="reason"
                  value={patientForm.reason}
                  onChange={handlePatientChange}
                  rows={3}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none resize-none"
                  placeholder="Briefly describe the reason for this appointment (optional)"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 py-3.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-md transition-colors cursor-pointer text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Appointment Request"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handlePublicSubmit}
            className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-100 pb-1.5">
                1. Patient Personal Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    name="patientFirstName"
                    value={publicForm.patientFirstName}
                    onChange={handlePublicChange}
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                    placeholder="e.g. Alice"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    name="patientLastName"
                    value={publicForm.patientLastName}
                    onChange={handlePublicChange}
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                    placeholder="e.g. Vance"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    name="patientEmail"
                    value={publicForm.patientEmail}
                    onChange={handlePublicChange}
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                    placeholder="e.g. alice.vance@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    name="patientPhone"
                    value={publicForm.patientPhone}
                    onChange={handlePublicChange}
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                    placeholder="e.g. 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Gender
                  </label>
                  <select
                    name="patientGender"
                    value={publicForm.patientGender}
                    onChange={handlePublicChange}
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    name="patientDOB"
                    value={publicForm.patientDOB}
                    onChange={handlePublicChange}
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-100 pb-1.5">
                2. Appointment Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Appointment Type
                  </label>
                  <select
                    name="type"
                    value={publicForm.type}
                    onChange={handlePublicChange}
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none font-medium"
                  >
                    <option value="new_patient">New Patient</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="consultation">Consultation</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">
                  Reason for Visit
                </label>
                <textarea
                  name="reason"
                  value={publicForm.reason}
                  onChange={handlePublicChange}
                  rows={3}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none resize-none"
                  placeholder="Briefly describe the reason for this appointment (optional)"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-100 pb-1.5">
                3. Appointment Date & Slot
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    name="date"
                    value={publicForm.date}
                    onChange={handlePublicChange}
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Preferred Time Slot
                  </label>
                  <select
                    name="time"
                    value={publicForm.time}
                    onChange={handlePublicChange}
                    className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none font-medium"
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
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 py-3.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-md transition-colors cursor-pointer text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Appointment Request"}
            </button>
          </form>
        )}

        {toast.show && (
          <div
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-sm font-medium z-50 ${
              toast.type === "error"
                ? "bg-red-600 text-white"
                : "bg-teal-600 text-white"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </section>
  );
}
