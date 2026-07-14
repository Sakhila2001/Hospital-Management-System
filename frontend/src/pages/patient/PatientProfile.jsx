import React, { useState } from "react";
import { usePatient } from "../../context/patient/PatientContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import PatientProfileView from "./PatientProfileView";
import { useOutletContext } from "react-router-dom";

// FIX: lowercase values to match backend ENUM validation
const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const MARITAL_STATUS_OPTIONS = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
  { label: "Divorced", value: "divorced" },
  { label: "Widowed", value: "widowed" },
];

export default function PatientProfile() {
  const { patient, triggerToast } = useOutletContext();
  // FIX: use usePatient() which calls PUT /patients/me/profile (patient role)
  // NOT useAdmin() which calls PUT /patients/:userId (admin only → 403)
  const { updateProfile } = usePatient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const buildFormFields = () => ({
    firstName: patient?.firstName || "",
    lastName: patient?.lastName || "",
    dateOfBirth: patient?.dateOfBirth
      ? String(patient.dateOfBirth).slice(0, 10)
      : "",
    // Normalize to lowercase to match backend ENUMs
    gender: patient?.gender ? patient.gender.toLowerCase() : "",
    bloodGroup: patient?.bloodGroup || "",
    maritalStatus: patient?.maritalStatus ? patient.maritalStatus.toLowerCase() : "",
    phone: patient?.phone || "",
    address: patient?.address || "",
    city: patient?.city || "",
    allergies: patient?.allergies || "",
    chronicConditions: patient?.chronicConditions || "",
    emergencyContactName: patient?.emergencyContactName || "",
    emergencyContactPhone: patient?.emergencyContactPhone || "",
    emergencyContactRelation: patient?.emergencyContactRelation || "",
  });

  const [formFields, setFormFields] = useState(buildFormFields);

  const updateField = (key) => (e) =>
    setFormFields({ ...formFields, [key]: e.target.value });

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

  // FIX: async so API errors are properly caught and shown
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await updateProfile(formFields);
      triggerToast("Medical profile updated successfully!", "success");
      setIsEditModalOpen(false);
    } catch (err) {
      setFormError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PatientProfileView patient={patient} onEdit={handleEditClick} />

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancel}
        badge="Edit Record"
        title="Update Medical Profile"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inline error banner */}
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
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Blood Group
                </label>
                <select
                  value={formFields.bloodGroup}
                  onChange={updateField("bloodGroup")}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
                >
                  <option value="">Select...</option>
                  {BLOOD_GROUP_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Marital Status
                </label>
                <select
                  value={formFields.maritalStatus}
                  onChange={updateField("maritalStatus")}
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
                >
                  <option value="">Select...</option>
                  {MARITAL_STATUS_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-700 uppercase border-b border-gray-100 pb-1">
              2. Contact & Residential Info
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Phone Number"
                value={formFields.phone}
                onChange={updateField("phone")}
              />
              <Input
                label="City"
                value={formFields.city}
                onChange={updateField("city")}
              />
              <Input
                label="Full Address"
                value={formFields.address}
                onChange={updateField("address")}
              />
            </div>
          </div>

          {/* Clinical History */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-700 uppercase border-b border-gray-100 pb-1">
              3. Clinical Allergy & Chronic Records
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Allergies
                </label>
                <textarea
                  rows="3"
                  value={formFields.allergies}
                  onChange={updateField("allergies")}
                  placeholder="Penicillin, Peanuts, Pollen, etc..."
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  Chronic Conditions
                </label>
                <textarea
                  rows="3"
                  value={formFields.chronicConditions}
                  onChange={updateField("chronicConditions")}
                  placeholder="Diabetes, Asthma, Hypertension, etc..."
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Emergency contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-700 uppercase border-b border-gray-100 pb-1">
              4. Emergency Guardian Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Contact Name"
                value={formFields.emergencyContactName}
                onChange={updateField("emergencyContactName")}
              />
              <Input
                label="Contact Phone"
                value={formFields.emergencyContactPhone}
                onChange={updateField("emergencyContactPhone")}
              />
              <Input
                label="Relationship"
                placeholder="e.g. Spouse, Sister"
                value={formFields.emergencyContactRelation}
                onChange={updateField("emergencyContactRelation")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {saving ? "Saving..." : "Save Medical Profile"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
