import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="relative bg-white pt-24 overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-100 blur-3xl" />
        <div className="absolute top-60 -left-20 w-80 h-80 rounded-full bg-sky-100 blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-24 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left text column */}
        <div className="text-left space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-600 uppercase tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
            24/7 Emergency & Trauma Center Active
          </span>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            Compassionate Care, <br />
            <span className="text-teal-600">Close to Home</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
            Welcome to City Care Hospital. We bring together dedicated medical experts, advanced treatment facilities, and round-the-clock clinical support to keep you and your family healthy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/login"
              className="rounded-full bg-teal-600 hover:bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all cursor-pointer text-center"
            >
              Book an Appointment
            </Link>
            <a
              href="tel:+1555019911"
              className="rounded-full border border-gray-300 hover:bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 flex items-center justify-center gap-2 transition-all"
            >
              Emergency Call: +1 (555) 019-911
            </a>
          </div>
        </div>

        {/* Right side graphical card */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-6 space-y-6 relative">
            
            {/* Quick checkups card badge */}
            <div className="absolute -top-3 -right-3 bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              Open 365 Days
            </div>

            <h3 className="text-lg font-bold text-gray-900">Hospital Check-in Guidelines</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Select Department & Doctor</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Choose from our list of available specialists in Cardiology, Pediatrics, or General Medicine.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Pick Date & Time Slot</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Select a morning or evening clinic session that matches your schedule.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Get Booking Pass</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Receive your patient booking code instantly. Present it at the reception counter upon arrival.</p>
                </div>
              </div>
            </div>

            <Link
              to="/login"
              className="block w-full py-2.5 bg-gray-50 border border-gray-300 hover:bg-gray-100 text-gray-850 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
            >
              Get Started Now &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
