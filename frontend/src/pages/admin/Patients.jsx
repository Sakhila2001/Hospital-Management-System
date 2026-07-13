import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function Patients() {
  const { onOpenCreateModal, onOpenEditModal, onOpenViewModal, triggerToast } =
    useOutletContext();
  const { patients, patientsLoading, deletePatient } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeletePatient = async (userId, name) => {
    if (window.confirm(`Are you sure you want to delete patient ${name}?`)) {
      try {
        await deletePatient(userId);
        triggerToast("Patient profile deleted successfully");
      } catch (err) {
        triggerToast(err.message, "error");
      }
    }
  };

  const filteredPatients = patients.filter((pat) => {
    const name = `${pat.firstName || ""} ${pat.lastName || ""}`.toLowerCase();
    const city = (pat.city || "").toLowerCase();
    const phone = (pat.phone || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || phone.includes(term) || city.includes(term);
  });

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient name, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-full pl-10 pr-4 py-2.5 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
          />
        </div>

        <button
          onClick={() => onOpenCreateModal("patient")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" />
          Register Patient
        </button>
      </div>

      {patientsLoading && (
        <div className="text-center py-8 text-gray-500 text-sm">
          Loading patients...
        </div>
      )}

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm text-left text-gray-500 table-fixed min-w-[800px]">
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[13%]" />
              <col className="w-[10%]" />
              <col className="w-[17%]" />
              <col className="w-[14%]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/75 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">Patient Name</th>
                <th scope="col" className="px-6 py-3">Phone</th>
                <th scope="col" className="px-6 py-3">Blood Group</th>
                <th scope="col" className="px-6 py-3">Gender / DOB</th>
                <th scope="col" className="px-6 py-3">City</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.map((pat) => (
                <tr key={pat.id} className="bg-white hover:bg-gray-50/50">
                  <th scope="row" className="px-6 py-4 font-semibold text-gray-900">
                    {pat.firstName} {pat.lastName}
                  </th>
                  <td className="px-6 py-4">{pat.phone || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                      {pat.bloodGroup || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 capitalize text-xs">
                    {pat.gender || "N/A"} &bull; {pat.dateOfBirth || "N/A"}
                  </td>
                  <td className="px-6 py-4">{pat.city || "N/A"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenViewModal("patient", pat)}
                        className="p-1 text-gray-600 hover:bg-gray-150 rounded-lg border border-gray-100 cursor-pointer"
                        title="View Clinical Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onOpenEditModal("patient", pat)}
                        className="p-1 text-teal-600 hover:bg-teal-50 rounded-lg border border-gray-100 cursor-pointer"
                        title="Edit Profile"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeletePatient(
                            pat.userId,
                            `${pat.firstName} ${pat.lastName}`,
                          )
                        }
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg border border-gray-100 cursor-pointer"
                        title="Delete patient record"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!patientsLoading && filteredPatients.length === 0 && (
          <div className="p-10 text-center text-gray-400 font-medium">
            No matching patients found.
          </div>
        )}
      </div>
    </div>
  );
}