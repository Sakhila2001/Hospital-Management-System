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

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function ReceptionistPatients({
  receptionist,
  patientModal,
  setPatientModal,
  triggerToast,
}) {
  const { patients, addPatient, updatePatient, deletePatient } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");

  // Form state for create/edit modal — mirrors the real patient model
  const emptyForm = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    bloodGroup: "O+",
    maritalStatus: "single",
    city: "",
    address: "",
    allergies: "",
    chronicConditions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
  };
  const [form, setForm] = useState(emptyForm);

  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    const term = searchTerm.toLowerCase();
    return (
      fullName.includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.phone?.includes(searchTerm) ||
      p.city?.toLowerCase().includes(term)
    );
  });

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "-";
    const diff = Date.now() - new Date(dateOfBirth).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setPatientModal({ show: true, action: "create", data: null });
  };

  const openEditModal = (patient) => {
    setForm({
      email: patient.email || "",
      password: "",
      confirmPassword: "",
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      phone: patient.phone || "",
      dateOfBirth: patient.dateOfBirth || "",
      gender: patient.gender || "male",
      bloodGroup: patient.bloodGroup || "O+",
      maritalStatus: patient.maritalStatus || "single",
      city: patient.city || "",
      address: patient.address || "",
      allergies: patient.allergies || "",
      chronicConditions: patient.chronicConditions || "",
      emergencyContactName: patient.emergencyContactName || "",
      emergencyContactPhone: patient.emergencyContactPhone || "",
      emergencyContactRelation: patient.emergencyContactRelation || "",
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

      if (patientModal.action === "create") {
        if (!form.email || !form.password) {
          throw new Error("Please fill in all user login credentials");
        }
        if (form.password !== form.confirmPassword) {
          throw new Error("Passwords do not match");
        }
      }

      if (patientModal.action === "edit" && patientModal.data) {
        const { password, confirmPassword, ...updateData } = form;
        updatePatient(patientModal.data.id, updateData);
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
            placeholder="Search name, email, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full pl-10 pr-4 py-2 focus:ring-teal-500 focus:bg-white outline-none"
          />
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <UserPlusIcon className="h-4 w-4" />
          Register Patient
        </Button>
      </div>

      {/* Patient Registry Table */}
      <Card title="Patient Registry">
        <div className="overflow-x-auto scrollbar-hide -mx-6">
          <table className="w-full text-sm text-left text-gray-500 min-w-[800px]">
            <thead className="text-xs text-gray-700 bg-gray-50/75 border-b border-gray-150">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Patient Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3">
                  Age / Gender
                </th>
                <th scope="col" className="px-6 py-3">
                  Blood Group
                </th>
                <th scope="col" className="px-6 py-3">
                  City
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
                  <td className="px-6 py-4 text-gray-600 font-medium capitalize">
                    {calculateAge(patient.dateOfBirth)} yrs &bull;{" "}
                    {patient.gender}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                      {patient.bloodGroup || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {patient.city || "N/A"}
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
                    colSpan="7"
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
          {/* User Credentials — create only */}
          {patientModal.action === "create" && (
            <div className="bg-teal-50/50 p-3 rounded-lg border border-teal-100/50 space-y-3">
              <p className="text-xs font-bold text-teal-700 uppercase">
                1. User Credentials
              </p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                  />
                  <input
                    type="password"
                    required
                    placeholder="Confirm"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          <p className="text-xs font-bold text-gray-600 uppercase border-b border-gray-100 pb-1">
            {patientModal.action === "create" ? "2." : "1."} Basic Information
          </p>
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

          {/* Contact fields — email only shown here on edit, since create already captured it above */}
          <div
            className={
              patientModal.action === "edit" ? "grid grid-cols-2 gap-3" : ""
            }
          >
            {patientModal.action === "edit" && (
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
            )}
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
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Date of Birth
              </label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) =>
                  setForm({ ...form, dateOfBirth: e.target.value })
                }
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold"
              />
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
                Blood Group
              </label>
              <select
                value={form.bloodGroup}
                onChange={(e) =>
                  setForm({ ...form, bloodGroup: e.target.value })
                }
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Marital Status
              </label>
              <select
                value={form.maritalStatus}
                onChange={(e) =>
                  setForm({ ...form, maritalStatus: e.target.value })
                }
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold"
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                City
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 font-semibold"
              />
            </div>
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

          <p className="text-xs font-bold text-gray-600 uppercase border-b border-gray-100 pb-1 pt-2">
            {patientModal.action === "create" ? "3." : "2."} Medical Information
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Allergies
              </label>
              <textarea
                rows="2"
                placeholder="Penicillin, Peanuts, etc."
                value={form.allergies}
                onChange={(e) =>
                  setForm({ ...form, allergies: e.target.value })
                }
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Chronic Conditions
              </label>
              <textarea
                rows="2"
                placeholder="Asthma, Diabetes, etc."
                value={form.chronicConditions}
                onChange={(e) =>
                  setForm({ ...form, chronicConditions: e.target.value })
                }
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <p className="text-xs font-bold text-gray-600 uppercase border-b border-gray-100 pb-1 pt-2">
            {patientModal.action === "create" ? "4." : "3."} Emergency Contact
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase">
                Name
              </label>
              <input
                type="text"
                value={form.emergencyContactName}
                onChange={(e) =>
                  setForm({ ...form, emergencyContactName: e.target.value })
                }
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase">
                Phone
              </label>
              <input
                type="text"
                value={form.emergencyContactPhone}
                onChange={(e) =>
                  setForm({ ...form, emergencyContactPhone: e.target.value })
                }
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase">
                Relation
              </label>
              <input
                type="text"
                placeholder="Spouse, Parent"
                value={form.emergencyContactRelation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    emergencyContactRelation: e.target.value,
                  })
                }
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-150 pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
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
