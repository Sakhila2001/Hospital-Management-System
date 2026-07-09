import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function ReceptionistPatients({
  receptionist,
  patientModal,
  setPatientModal,
  triggerToast,
}) {
  const { patients, addPatient, updatePatient, deletePatient } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");

  // Form state for create/edit modal
  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "male",
    address: "",
  };
  const [form, setForm] = useState(emptyForm);

  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm)
    );
  });

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setPatientModal({ show: true, action: "create", data: null });
  };

  const openEditModal = (patient) => {
    setForm({
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      email: patient.email || "",
      phone: patient.phone || "",
      dob: patient.dob || "",
      gender: patient.gender || "male",
      address: patient.address || "",
    });
    setPatientModal({ show: true, action: "edit", data: patient });
  };

  const closeModal = () => {
    setPatientModal({ show: false, action: "", data: null });
    setForm(emptyForm);
  };

  const handleDelete = (patient) => {
    if (
      window.confirm(
        `Remove ${patient.firstName} ${patient.lastName} from the patient registry?`,
      )
    ) {
      deletePatient(patient.id);
      triggerToast("Patient record removed successfully.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (!form.firstName || !form.lastName) {
        throw new Error("First and last name are required");
      }
      if (!form.phone) {
        throw new Error("Contact phone number is required");
      }

      if (patientModal.action === "edit" && patientModal.data) {
        updatePatient(patientModal.data.id, form);
        triggerToast("Patient details updated successfully!");
      } else {
        addPatient({
          ...form,
          registeredBy: receptionist?.userId,
        });
        triggerToast("New patient registered successfully!");
      }

      closeModal();
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search + Register bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full pl-10 pr-4 py-2 focus:ring-teal-500 focus:bg-white outline-none"
          />
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          className="flex items-center gap-2 justify-center"
        >
          <UserPlusIcon className="h-4 w-4" />
          Register Patient
        </Button>
      </div>

      {/* Patient Registry Table */}
      <Card title="Patient Registry">
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm text-left text-gray-500 min-w-[700px]">
            <thead className="text-xs text-gray-700 bg-gray-50/75 border-b border-gray-150">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Patient Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3">
                  Age
                </th>
                <th scope="col" className="px-6 py-3">
                  Gender
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    <div>{patient.phone}</div>
                    <div className="text-xs text-gray-400">{patient.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {calculateAge(patient.dob)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium capitalize">
                    {patient.gender}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      text={patient.isActive === false ? "inactive" : "active"}
                      variant={patient.isActive === false ? "gray" : "success"}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openEditModal(patient)}
                        className="py-1 px-2.5 text-xs flex items-center gap-1"
                      >
                        <PencilSquareIcon className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(patient)}
                        className="py-1 px-2.5 text-xs border-red-200 text-red-650 hover:bg-red-50 flex items-center gap-1"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-gray-400 font-medium bg-white"
                  >
                    No patient records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Patient Modal */}
      <Modal
        isOpen={patientModal.show}
        onClose={closeModal}
        badge={
          patientModal.action === "edit" ? "Edit Record" : "New Registration"
        }
        title={
          patientModal.action === "edit"
            ? "Update Patient Details"
            : "Register New Patient"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                First Name
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Last Name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Date of Birth
              </label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase">
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase">
              Home Address
            </label>
            <textarea
              rows="2"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Street, city, ward..."
              className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-150 pt-4 mt-6">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {patientModal.action === "edit"
                ? "Save Changes"
                : "Register Patient"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
