import React from "react";
import { ShieldCheckIcon, TrophyIcon, HeartIcon } from "@heroicons/react/24/outline";

export default function AboutSection() {
  const highlights = [
    {
      title: "Patient-Centered Philosophy",
      desc: "Every clinical strategy we execute is designed with patient ease, comfort, and direct wellness in mind.",
      icon: HeartIcon
    },
    {
      title: "Certified Practitioners",
      desc: "Our board-certified consultants and surgeons hold leading medical credentials and licensing.",
      icon: ShieldCheckIcon
    },
    {
      title: "Recognized Quality Care",
      desc: "City Care has been accredited for outstanding inpatient services and clinical hygiene standards.",
      icon: TrophyIcon
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 border-t border-gray-150">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
        
        {/* Main Header / Tagline split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">About Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              Leading Medical Standards for Our Community
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Founded on the pillars of compassionate medical care and scientific diligence, City Care Hospital provides comprehensive, integrated therapies under a single roof. Our primary goal is supporting speedy recovery and clinical precision.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-4">
            <h3 className="text-lg font-bold text-teal-600">Our Strategic Vision</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              To be the most trusted healthcare provider in the region, known for deploying state-of-the-art diagnostic facilities and ensuring empathy-led treatment guidelines.
            </p>
            <div className="h-px bg-gray-100" />
            <div className="flex gap-4 text-xs font-semibold text-gray-500">
              <span>&bull; Empathy First</span>
              <span>&bull; Clinical Precision</span>
              <span>&bull; 24/7 Availability</span>
            </div>
          </div>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          {highlights.map((hl, idx) => {
            const Icon = hl.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-gray-900">{hl.title}</h4>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{hl.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
