import React from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { UserIcon } from "@heroicons/react/24/outline";

export default function DoctorsSection() {
  const { doctors, departments } = useAdmin();

  const getDeptName = (id) => {
    const dept = departments.find((d) => d.id === Number(id));
    return dept ? dept.name : "General Medicine";
  };

  return (
    <section id="doctors" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Medical Staff</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Meet Our Medical Specialists
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            Consult with highly certified clinical practitioners and surgeons committed to delivering patient-first recovery care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {doctors
            .filter((d) => d.isAvailable)
            .map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  {/* Doctor Avatar Placeholder */}
                  <div className="h-40 w-full rounded-xl bg-gray-100/70 text-gray-400 flex items-center justify-center relative overflow-hidden">
                    <UserIcon className="h-16 w-16 opacity-40 text-teal-600" />
                    <span className="absolute bottom-2 right-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Available
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">Dr. {doc.firstName} {doc.lastName}</h3>
                    <p className="text-xs text-teal-600 font-semibold">{doc.specialization} &bull; {getDeptName(doc.departmentId)}</p>
                  </div>

                  <div className="space-y-1 text-xs text-gray-500 border-t border-gray-50 pt-2.5">
                    <p><b>Qualification:</b> {doc.qualification || "MD"}</p>
                    <p><b>Hours:</b> {doc.availableTimeStart} - {doc.availableTimeEnd}</p>
                    <p><b>Days:</b> {doc.availableDays.join(", ") || "Mon-Fri"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">Exp: {doc.experienceYears} Years</span>
                  <Link 
                    to="/login" 
                    className="text-teal-600 hover:text-teal-500 font-bold hover:underline"
                  >
                    Request Appointment
                  </Link>
                </div>
              </div>
            ))}
        </div>

        {doctors.filter((d) => d.isAvailable).length === 0 && (
          <div className="p-8 text-center text-gray-450 border border-dashed border-gray-200 rounded-2xl">
            No doctors are currently listed as available.
          </div>
        )}
      </div>
    </section>
  );
}
