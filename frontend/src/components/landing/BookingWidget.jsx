import React, { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";

export default function BookingWidget({ triggerToast }) {
  const { departments, doctors, bookAppointment } = useAdmin();

  // Selected states
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedDocId, setSelectedDocId] = useState("");
  
  // Patient details
  const [formData, setFormData] = useState({
    patientFirstName: "",
    patientLastName: "",
    patientEmail: "",
    patientPhone: "",
    patientGender: "male",
    patientDOB: "",
    date: "",
    time: "09:00"
  });

  // Filtered doctors list based on department selection
  const [availableDocs, setAvailableDocs] = useState([]);

  // Load active departments initially
  const activeDepts = departments.filter((d) => d.isActive);

  useEffect(() => {
    if (activeDepts.length > 0 && !selectedDeptId) {
      setSelectedDeptId(activeDepts[0].id.toString());
    }
  }, [activeDepts]);

  // Update available doctors when department selection changes
  useEffect(() => {
    if (selectedDeptId) {
      const filtered = doctors.filter(
        (doc) => Number(doc.departmentId) === Number(selectedDeptId) && doc.isAvailable
      );
      setAvailableDocs(filtered);
      if (filtered.length > 0) {
        setSelectedDocId(filtered[0].userId.toString());
      } else {
        setSelectedDocId("");
      }
    }
  }, [selectedDeptId, doctors]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    try {
      if (!selectedDocId) {
        throw new Error("Please select a doctor for your appointment.");
      }
      if (!formData.date) {
        throw new Error("Please pick a scheduled date.");
      }

      const bookedObj = bookAppointment({
        ...formData,
        doctorId: Number(selectedDocId),
        departmentId: Number(selectedDeptId)
      });

      triggerToast(`Appointment booked successfully! Status: ${bookedObj.status.toUpperCase()}`);
      
      // Reset form
      setFormData({
        patientFirstName: "",
        patientLastName: "",
        patientEmail: "",
        patientPhone: "",
        patientGender: "male",
        patientDOB: "",
        date: "",
        time: "09:00"
      });
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  return (
    <section id="booking" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Appointment Desk</span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Book an Online Appointment
          </h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Schedule a clinic consult session. Fill out the medical booking form below to secure your consultation slot.
          </p>
        </div>

        <form 
          onSubmit={handleBookingSubmit}
          className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6"
        >
          {/* Patient Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-100 pb-1.5">1. Patient Personal Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">First Name</label>
                <input
                  type="text" required name="patientFirstName"
                  value={formData.patientFirstName}
                  onChange={handleChange}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                  placeholder="e.g. Alice"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Last Name</label>
                <input
                  type="text" required name="patientLastName"
                  value={formData.patientLastName}
                  onChange={handleChange}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                  placeholder="e.g. Vance"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Email Address</label>
                <input
                  type="email" required name="patientEmail"
                  value={formData.patientEmail}
                  onChange={handleChange}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                  placeholder="e.g. alice.vance@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                <input
                  type="text" required name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleChange}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                  placeholder="e.g. 9876543210"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Gender</label>
                <select
                  name="patientGender"
                  value={formData.patientGender}
                  onChange={handleChange}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Date of Birth</label>
                <input
                  type="date" required name="patientDOB"
                  value={formData.patientDOB}
                  onChange={handleChange}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Department and Doctor Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-100 pb-1.5">2. Department & Doctor</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Clinical Department</label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none font-medium"
                >
                  {activeDepts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Available Doctor</label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  disabled={availableDocs.length === 0}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none font-medium disabled:opacity-50"
                >
                  {availableDocs.map((doc) => (
                    <option key={doc.userId} value={doc.userId}>
                      Dr. {doc.firstName} {doc.lastName} ({doc.specialization})
                    </option>
                  ))}
                  {availableDocs.length === 0 && (
                    <option value="">No specialists available in this department</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Date and Time Slot Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase border-b border-gray-100 pb-1.5">3. Appointment Date & Slot</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Preferred Date</label>
                <input
                  type="date" required name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Preferred Time Slot</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
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
            className="w-full mt-4 py-3.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-md transition-colors cursor-pointer text-center text-sm"
          >
            Submit Appointment Request
          </button>
        </form>

      </div>
    </section>
  );
}
