import React from "react";
import {
  BuildingOffice2Icon,
  HeartIcon,
  UserGroupIcon,
  BoltIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function ServicesSection() {
  const services = [
    {
      title: "Cardiology",
      desc: "Specialized heart healthcare, advanced echocardiograms, and state-of-the-art cath labs.",
      icon: HeartIcon,
    },
    {
      title: "Pediatrics",
      desc: "Comprehensive outpatient checkups, immunizations, and round-the-clock neonatal care.",
      icon: UserGroupIcon,
    },
    {
      title: "Neurology",
      desc: "Expert treatment of neuro-degenerative disorders, brain injury recovery, and epilepsy management.",
      icon: BuildingOffice2Icon,
    },
    {
      title: "Emergency Care",
      desc: "Equipped trauma center with rapid-response ambulances and dedicated critical care teams.",
      icon: BoltIcon,
    },
    {
      title: "Laboratory & Imaging",
      desc: "High-precision MRI scans, CT scans, blood pathology analysis, and digital X-rays.",
      icon: ClipboardDocumentCheckIcon,
    },
    {
      title: "Intensive Care (ICU)",
      desc: "Advanced life support systems, ventilator setups, and 1:1 patient care monitoring.",
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <section id="services">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
            Our Medical Scope
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Dedicated Clinical Departments
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            City Care Hospital houses diverse clinical divisions supported by
            leading specialists and modern medical diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-teal-200 transition-all duration-300 group"
              >
                <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                  {svc.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-2.5">
                  {svc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
