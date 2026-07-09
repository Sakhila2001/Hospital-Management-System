import React, { useState } from "react";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function ContactSection({ triggerToast }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      triggerToast("Please fill in all required inquiry fields.", "error");
      return;
    }
    triggerToast("Thank you! Your message has been received. We will contact you shortly.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-white border-t border-gray-150">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Connect With Us</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Contact Hospital Desk
          </h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Have questions about clinical sessions, visiting routines, or treatments? Send us an inquiry message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Side 1: Contact Info Details */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">Hospital Address & Contacts</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Physical Location</h4>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">789 Healthcare Dr, Metro City Center</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                    <PhoneIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Phone Helplines</h4>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5"><b>Frontdesk:</b> +1 (555) 019-900</p>
                    <p className="text-xs sm:text-sm text-red-500 mt-0.5"><b>Emergency trauma:</b> +1 (555) 019-911</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                    <EnvelopeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Email Address</h4>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">support@citycarehospital.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinic Schedule */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-3">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Outpatient Department Hours</h4>
              <div className="divide-y divide-gray-200/60 text-xs sm:text-sm text-gray-500">
                <div className="py-2.5 flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold text-gray-700">08:00 AM - 08:00 PM</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold text-gray-700">09:00 AM - 05:00 PM</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Sunday & Public Holidays</span>
                  <span className="text-red-500 font-semibold">Trauma / Emergency Only</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side 2: Mock Message Form */}
          <form 
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-4"
          >
            <h3 className="text-base font-bold text-gray-800 mb-2">Send Inquiry Message</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Your Name *</label>
              <input
                type="text" required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none"
                placeholder="Marcus"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Email Address *</label>
              <input
                type="email" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none"
                placeholder="marcus@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none"
                placeholder="Inquiry about general cardiology checkup"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Your Message *</label>
              <textarea
                rows="4" required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none"
                placeholder="Write your details here..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer text-center"
            >
              Submit Message
            </button>
          </form>

        </div>

      </div>
    </section>
  );
}
