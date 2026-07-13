import React, { useState } from "react";
import { useReceptionist } from "../../context/receptionist/ReceptionistContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import ReceptionistProfileView from "./ReceptionistProfileView";
import { useOutletContext } from "react-router-dom";

const SHIFT_OPTIONS = ["Morning", "Evening", "Night"];

export default function ReceptionistProfile() {
    const { receptionist, triggerToast } = useOutletContext();
  // FIX: use useReceptionist().updateProfile → PUT /receptionists/me/profile
  // NOT useAdmin().updateReceptionist → PUT /receptionists/:userId (admin only)
  const { updateProfile, departments = [] } = useReceptionist();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const getDeptName = (id) => {
    const dept = departments.find((d) => d.id === Number(id));
    return dept ? dept.name : "N/A";
  };

  const buildFormFields = () => ({
    firstName: receptionist?.firstName || "",
    lastName: receptionist?.lastName || "",
    email: receptionist?.email || "",
    phone: receptionist?.phone || "",
    departmentId: receptionist?.departmentId || "",
    employeeCode: receptionist?.employeeCode || "",
    shift: receptionist?.shift || "Morning",
    joinedDate: receptionist?.joinedDate
      ? String(receptionist.joinedDate).slice(0, 10)
      : "",
  });

  const [formFields, setFormFields] = useState(buildFormFields);

  if (!receptionist) {
    return (
      <p className="text-sm text-gray-400 text-center py-10">
        Loading profile...
      </p>
    );
  }

  const updateField = (key) => (e) =>
    setFormFields({ ...formFields, [key]: e.target.value });

  const handleEditClick = () => {
    setFormFields(buildFormFields());
    setIsEditModalOpen(true);
  };

  const handleCancel = () => {
    setFormFields(buildFormFields());
    setIsEditModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await updateProfile({
        ...formFields,
        departmentId: formFields.departmentId
          ? Number(formFields.departmentId)
          : undefined,
      });
      triggerToast("Profile updated successfully!", "success");
      setIsEditModalOpen(false);
    } catch (err) {
      setFormError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ReceptionistProfileView
        receptionist={receptionist}
        departmentName={getDeptName(receptionist.departmentId)}
        onEdit={handleEditClick}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancel}
        badge="Edit Record"
        title="Update Receptionist Profile"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-700 uppercase border-b border-gray-100 pb-1">
              1. Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="First Name"
                value={formFields.firstName}
                onChange={updateField("firstName")}
              />
              <Input
                label="Last Name"
                value={formFields.lastName}
                onChange={updateField("lastName")}
              />
              <Input
                label="Phone"
                value={formFields.phone}
                onChange={updateField("phone")}
              />
              <Input
                label="Email"
                type="email"
                value={formFields.email}
                onChange={updateField("email")}
              />
            </div>
          </div>

          {/* Work Assignment */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-700 uppercase border-b border-gray-100 pb-1">
              2. Work Assignment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Employee Code"
                value={formFields.employeeCode}
                onChange={updateField("employeeCode")}
              />
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Department
                </label>
                <select
                  value={formFields.departmentId}
                  onChange={updateField("departmentId")}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
                >
                  <option value="">Select...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Shift
                </label>
                <select
                  value={formFields.shift}
                  onChange={updateField("shift")}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
                >
                  {SHIFT_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tenure */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-700 uppercase border-b border-gray-100 pb-1">
              3. Tenure
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Joined Date
                </label>
                <input
                  type="date"
                  value={formFields.joinedDate}
                  onChange={updateField("joinedDate")}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
