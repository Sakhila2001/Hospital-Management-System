import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Doctors() {
  const { onOpenCreateModal, onOpenEditModal, onOpenViewModal, triggerToast } =
    useOutletContext();
    
  
  const { doctors, departments, deleteDoctor } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  const getDeptName = (id) => {
    const dept = departments.find((d) => d.id === Number(id));
    return dept ? dept.name : "N/A";
  };

  const handleDeleteDoctor = (userId, name) => {
    if (window.confirm(`Are you sure you want to delete Dr. ${name}?`)) {
      deleteDoctor(userId);
      triggerToast("Doctor profile deleted successfully");
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const fullName = `${doc.firstName} ${doc.lastName}`.toLowerCase();
    const spec = doc.specialization.toLowerCase();
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || spec.includes(term);
  });

  return (
    <div className="space-y-4">
      
      {/* Search / Add Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors by name or spec..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-full pl-10 pr-4 py-2.5 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
          />
        </div>

        <button
          onClick={() => onOpenCreateModal("doctor")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" />
          Register Doctor
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between space-y-4">
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-800">Dr. {doc.firstName} {doc.lastName}</h3>
                  <p className="text-xs text-teal-600 font-semibold">{doc.specialization} &bull; {getDeptName(doc.departmentId)}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  doc.isAvailable ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-650"
                }`}>
                  {doc.isAvailable ? "Available" : "Away"}
                </span>
              </div>

              {/* Info Rows */}
              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <p><b>License:</b> {doc.licenseNumber}</p>
                <p><b>Experience:</b> {doc.experienceYears} Years</p>
                <p><b>Days:</b> {doc.availableDays.join(", ") || "Not set"}</p>
                <p><b>Hours:</b> {doc.availableTimeStart} - {doc.availableTimeEnd}</p>
              </div>
            </div>

            {/* Card Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4">
              <button
                onClick={() => onOpenViewModal("doctor", doc)}
                className="text-xs text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <EyeIcon className="h-4 w-4" />
                View Profile
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onOpenEditModal("doctor", doc)}
                  className="p-1 text-teal-600 hover:bg-teal-50 rounded-lg border border-gray-100 cursor-pointer"
                  title="Edit Profile"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteDoctor(doc.userId, `${doc.firstName} ${doc.lastName}`)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-lg border border-gray-100 cursor-pointer"
                  title="Delete Doctor"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="p-10 text-center text-gray-400 font-medium bg-white rounded-xl border border-gray-200">
          No matching doctors found.
        </div>
      )}

    </div>
  );
}
