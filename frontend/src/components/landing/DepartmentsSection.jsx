import React from "react";
import { useAdmin } from "../../context/AdminContext";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

export default function DepartmentsSection() {
  const { departments } = useAdmin();

  // Filter only active departments
  const activeDepts = departments.filter((d) => d.isActive);

  return (
    <section id="departments" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-12">
        
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Departments</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Our Active Medical Specialties
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            City Care Hospital provides expert treatments across multiple branches of medicine. Explore our key active divisions below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {activeDepts.map((dept) => (
            <div 
              key={dept.id} 
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-teal-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <BuildingOfficeIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{dept.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2 line-clamp-3">
                    {dept.description || "Our specialists offer comprehensive consults, medical diagnostics, and treatment plans."}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 mt-4 flex justify-between items-center text-xs">
                <span className="text-teal-600 font-semibold uppercase tracking-wider">Clinical Care</span>
                <span className="text-gray-400">Department Active</span>
              </div>
            </div>
          ))}
        </div>

        {activeDepts.length === 0 && (
          <div className="p-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
            No departments are active at the moment.
          </div>
        )}

      </div>
    </section>
  );
}
