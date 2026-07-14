import React from "react";

export default function StatsSection() {
  const stats = [
    { label: "Expert Doctors", value: "50+" },
    { label: "Active Departments", value: "20+" },
    { label: "Successful Treatments", value: "15,000+" },
    { label: "Emergency Beds", value: "120+" },
    { label: "Patient Satisfaction", value: "99.2%" }
  ];

  return (
    <div className="bg-teal-600 py-12 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white blur-xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-medium text-teal-100 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
