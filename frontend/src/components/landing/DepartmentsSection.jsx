import React from "react";
import { useAdmin } from "../../context/AdminContext";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

const STATIC_DEPARTMENTS = [
  {
    id: 1,
    name: "General Practice",
    description:
      "Your first point of contact for non-emergency conditions. Comprehensive health assessments, routine check-ups, and family health guidance.",
    isActive: true,
  },
  {
    id: 2,
    name: "Cardiology Unit",
    description:
      "Expert cardiac diagnostics, echocardiograms, coronary care, and heart failure treatments supervised by experienced clinical cardiologists.",
    isActive: true,
  },
  {
    id: 3,
    name: "Neurology Wards",
    description:
      "Providing treatment for central nervous system disorders, nerve injury recovery, chronic headache management, and seizure disorders.",
    isActive: true,
  },
  {
    id: 4,
    name: "Pediatric Clinic",
    description:
      "Compassionate child healthcare, newborn screenings, childhood immunizations, and monitoring of growth milestones from infancy to adolescence.",
    isActive: true,
  },
];

export default function DepartmentsSection() {
  let departments = [];
  try {
    const adminContext = useAdmin();
    departments = adminContext?.departments || [];
  } catch (e) {
    // Suppress context error for public visitors who aren't logged in as Admin
  }

  // Filter only active departments
  const activeDepts = departments.filter((d) => d.isActive);
  const displayDepts =
    activeDepts.length > 0 ? activeDepts : STATIC_DEPARTMENTS;

  return (
    <section id="departments" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
            Departments
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Our Active Medical Specialties
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            City Care Hospital provides expert treatments across multiple
            branches of medicine. Explore our key active divisions below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {displayDepts.map((dept) => (
            <div
              key={dept.id}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-teal-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <BuildingOfficeIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2 line-clamp-3">
                    {dept.description ||
                      "Our specialists offer comprehensive consults, medical diagnostics, and treatment plans."}
                  </p>
                </div>
              </div>

              <div className=" pt-3 mt-4 flex justify-between items-center text-xs">
                <span className="text-teal-600 font-semibold uppercase tracking-wider">
                  Clinical Care
                </span>
                <span className="text-gray-400">Department Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
