import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Departments() {
  const { onOpenCreateModal, onOpenEditModal, triggerToast } =
    useOutletContext();
  const {
    departments,
    departmentsLoading,
    toggleDepartmentStatus,
    deleteDepartment,
  } = useAdmin();
  const [showInactiveDepts, setShowInactiveDepts] = useState(true);

  const handleDeleteDepartment = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete the "${name}" department?`,
      )
    ) {
      try {
        await deleteDepartment(id);
        triggerToast("Department deleted successfully");
      } catch (err) {
        triggerToast(err.message, "error");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleDepartmentStatus(id);
      triggerToast(`Department status toggled`);
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  const filteredDepts = departments.filter(
    (dept) => showInactiveDepts || dept.isActive,
  );

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showInactiveDepts}
              onChange={(e) => setShowInactiveDepts(e.target.checked)}
              className="h-4 w-4 rounded-sm text-teal-600 focus:ring-teal-500 border-gray-300 cursor-pointer"
            />
            Show Deactivated / Inactive Departments
          </label>
        </div>

        <button
          onClick={() => onOpenCreateModal("department")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusIcon className="h-5 w-5" />
          New Department
        </button>
      </div>
      {departmentsLoading && (
        <div className="text-center py-8 text-gray-500 text-sm">
          Loading departments...
        </div>
      )}
      {/* Departments Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/75 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Department Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDepts.map((dept) => (
                <tr
                  key={dept.id}
                  className={`bg-white hover:bg-gray-50/50 ${!dept.isActive ? "bg-gray-50/20" : ""}`}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap"
                  >
                    {dept.name}
                  </th>
                  <td className="px-6 py-4 max-w-sm leading-relaxed">
                    {dept.description || "No description provided."}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block ${
                        dept.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {dept.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleStatus(dept.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 border border-transparent cursor-pointer"
                      title="Toggle Status"
                    >
                      Toggle Status
                    </button>

                    <button
                      onClick={() => onOpenEditModal("department", dept)}
                      className="p-1 text-teal-600 hover:bg-teal-50 rounded-lg border border-transparent hover:border-teal-100 cursor-pointer"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 cursor-pointer"
                      title="Soft Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
