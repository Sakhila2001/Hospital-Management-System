import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Receptionists() {
  const { onOpenCreateModal, onOpenEditModal, triggerToast } =
    useOutletContext();
  const { receptionists, departments, deleteReceptionist } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  const getDeptName = (id) => {
    const dept = departments.find((d) => d.id === Number(id));
    return dept ? dept.name : "N/A";
  };

  const handleDeleteReceptionist = (userId, name) => {
    if (window.confirm(`Are you sure you want to delete receptionist ${name}?`)) {
      deleteReceptionist(userId);
      triggerToast("Receptionist profile deleted successfully");
    }
  };

  const filteredReceptionists = receptionists.filter(rec => {
    const name = `${rec.firstName} ${rec.lastName}`.toLowerCase();
    const code = rec.employeeCode.toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || code.includes(term);
  });

  return (
    <div className="space-y-4">
      
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search receptionists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-full pl-10 pr-4 py-2.5 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
          />
        </div>

        <button
          onClick={() => onOpenCreateModal("receptionist")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" />
          Register Receptionist
        </button>
      </div>

      {/* Receptionists List Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/75 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Employee Code</th>
                <th scope="col" className="px-6 py-3">Department</th>
                <th scope="col" className="px-6 py-3">Shift</th>
                <th scope="col" className="px-6 py-3">Phone</th>
                <th scope="col" className="px-6 py-3">Joined Date</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReceptionists.map((rec) => (
                <tr key={rec.id} className="bg-white hover:bg-gray-50/50">
                  <th scope="row" className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    {rec.firstName} {rec.lastName}
                  </th>
                  <td className="px-6 py-4 font-mono text-xs">{rec.employeeCode}</td>
                  <td className="px-6 py-4">{getDeptName(rec.departmentId)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      rec.shift === "Morning" ? "bg-sky-50 text-sky-700" :
                      rec.shift === "Evening" ? "bg-orange-50 text-orange-700" :
                      "bg-indigo-50 text-indigo-700"
                    }`}>
                      {rec.shift}
                    </span>
                  </td>
                  <td className="px-6 py-4">{rec.phone || "N/A"}</td>
                  <td className="px-6 py-4">{rec.joinedDate}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => onOpenEditModal("receptionist", rec)}
                      className="p-1 text-teal-600 hover:bg-teal-50 rounded-lg border border-transparent hover:border-teal-100 cursor-pointer"
                      title="Edit receptionist"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteReceptionist(rec.userId, `${rec.firstName} ${rec.lastName}`)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 cursor-pointer"
                      title="Delete receptionist"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredReceptionists.length === 0 && (
          <div className="p-10 text-center text-gray-400 font-medium">
            No matching receptionists found.
          </div>
        )}
      </div>

    </div>
  );
}
