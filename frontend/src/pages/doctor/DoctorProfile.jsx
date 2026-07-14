import React, { useState } from "react";
import { useDoctor } from "../../context/doctor/DoctorContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import DoctorProfileView from "./DoctorProfileView";
import { useOutletContext } from "react-router-dom";

// FIX: lowercase values to match backend ENUM validation
const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];
const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DoctorProfile() {
  const { triggerToast } = useOutletContext();

  // Use DoctorContext — NOT AdminContext. AdminContext is admin-only and
  // doesn't fetch departments/profile for non-admin users.
  const { profile: doctor, updateProfile, departments = [] } = useDoctor();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const buildFormFields = () => ({
    firstName: doctor?.firstName || "",
    lastName: doctor?.lastName || "",
    specialization: doctor?.specialization || "",
    qualification: doctor?.qualification || "",
    experienceYears: doctor?.experienceYears ?? "",
    licenseNumber: doctor?.licenseNumber || "",
    phone: doctor?.phone || "",
    // Normalize gender to lowercase to match ENUM values
    gender: doctor?.gender ? doctor.gender.toLowerCase() : "",
    dateOfBirth: doctor?.dateOfBirth
      ? String(doctor.dateOfBirth).slice(0, 10)
      : "",
    address: doctor?.address || "",
    availableDays: doctor?.availableDays || [],
    availableTimeStart: doctor?.availableTimeStart || "",
    availableTimeEnd: doctor?.availableTimeEnd || "",
    bio: doctor?.bio || "",
    departmentId: doctor?.departmentId || "",
  });

  const [formFields, setFormFields] = useState(buildFormFields);

  const updateField = (key) => (e) =>
    setFormFields((prev) => ({ ...prev, [key]: e.target.value }));

  const toggleDay = (day) => {
    setFormFields((prev) => {
      const has = prev.availableDays.includes(day);
      return {
        ...prev,
        availableDays: has
          ? prev.availableDays.filter((d) => d !== day)
          : [...prev.availableDays, day],
      };
    });
  };

  const handleEditClick = () => {
    setFormFields(buildFormFields());
    setFormError("");
    setIsEditModalOpen(true);
  };

  const handleCancel = () => {
    setFormFields(buildFormFields());
    setFormError("");
    setIsEditModalOpen(false);
  };

  // FIX: async so we can await the API call and catch real errors
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      await updateProfile({
        ...formFields,
        experienceYears:
          formFields.experienceYears === ""
            ? undefined
            : Number(formFields.experienceYears),
        departmentId: formFields.departmentId
          ? Number(formFields.departmentId)
          : undefined,
        // Send empty string as undefined so backend ignores the field
        gender: formFields.gender || undefined,
      });
      triggerToast("Profile updated successfully!", "success");
      setIsEditModalOpen(false);
    } catch (err) {
      // Show the backend validation error inside the modal
      setFormError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!doctor) {
    return (
      <p className="text-sm text-gray-400 text-center py-10">
        Loading profile...
      </p>
    );
  }

  return (
    <>
      <DoctorProfileView doctor={doctor} departments={departments} onEdit={handleEditClick} />

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancel}
        title="Edit Doctor Profile"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inline validation error banner */}
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
              {formError}
            </div>
          )}

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
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formFields.dateOfBirth}
                  onChange={updateField("dateOfBirth")}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Gender
                </label>
                {/* FIX: values are lowercase — matching backend ENUM */}
                <select
                  value={formFields.gender}
                  onChange={updateField("gender")}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
                >
                  <option value="">Select...</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Phone"
                value={formFields.phone}
                onChange={updateField("phone")}
              />
              <Input
                label="Address"
                value={formFields.address}
                onChange={updateField("address")}
              />
            </div>
          </div>

          {/* Professional Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-700 uppercase border-b border-gray-100 pb-1">
              2. Professional Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Specialization"
                value={formFields.specialization}
                onChange={updateField("specialization")}
              />
              <Input
                label="Qualification"
                value={formFields.qualification}
                onChange={updateField("qualification")}
              />
              <Input
                label="Experience (years)"
                type="number"
                min="0"
                value={formFields.experienceYears}
                onChange={updateField("experienceYears")}
              />
              <Input
                label="License Number"
                value={formFields.licenseNumber}
                onChange={updateField("licenseNumber")}
              />
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Department
                </label>
                {/* FIX: now populated from DoctorContext departments (GET /departments) */}
                <select
                  value={formFields.departmentId}
                  onChange={updateField("departmentId")}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
                >
                  <option value="">Select department...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {departments.length === 0 && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    No departments available
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                Bio
              </label>
              <textarea
                rows="3"
                value={formFields.bio}
                onChange={updateField("bio")}
                placeholder="A short professional summary patients will see..."
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-700 uppercase border-b border-gray-100 pb-1">
              3. Availability &amp; Schedule
            </h4>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">
                Available Days
              </label>
              <div className="flex flex-wrap gap-2">
                {DAY_OPTIONS.map((day) => {
                  const active = formFields.availableDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                        active
                          ? "bg-teal-600 border-teal-600 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Available From
                </label>
                <input
                  type="time"
                  value={formFields.availableTimeStart}
                  onChange={updateField("availableTimeStart")}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Available Until
                </label>
                <input
                  type="time"
                  value={formFields.availableTimeEnd}
                  onChange={updateField("availableTimeEnd")}
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
              disabled={saving}
              className="rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
