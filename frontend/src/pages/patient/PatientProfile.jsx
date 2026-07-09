import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function PatientProfile({ patient, triggerToast }) {
  const { updatePatient } = useAdmin();

  const [formFields, setFormFields] = useState({
    phone: patient.phone || "",
    address: patient.address || "",
    city: patient.city || "",
    allergies: patient.allergies || "",
    chronicConditions: patient.chronicConditions || "",
    emergencyContactName: patient.emergencyContactName || "",
    emergencyContactPhone: patient.emergencyContactPhone || "",
    emergencyContactRelation: patient.emergencyContactRelation || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      updatePatient(patient.userId, formFields);
      triggerToast("Medical profile updated successfully!");
    } catch (err) {
      triggerToast(err.message, "error");
    }
  };

  return (
    <Card title="Manage Medical File & Records">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact info */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-teal-700 uppercase border-b border-gray-100 pb-1">
            1. Contact & Residential Info
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Phone Number"
              value={formFields.phone}
              onChange={(e) =>
                setFormFields({ ...formFields, phone: e.target.value })
              }
            />
            <Input
              label="City"
              value={formFields.city}
              onChange={(e) =>
                setFormFields({ ...formFields, city: e.target.value })
              }
            />
            <Input
              label="Full Address"
              value={formFields.address}
              onChange={(e) =>
                setFormFields({ ...formFields, address: e.target.value })
              }
            />
          </div>
        </div>

        {/* Clinical History */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-teal-700 uppercase border-b border-gray-100 pb-1">
            2. Clinical Allergy & Chronic Records
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                Allergies
              </label>
              <textarea
                rows="3"
                value={formFields.allergies}
                onChange={(e) =>
                  setFormFields({ ...formFields, allergies: e.target.value })
                }
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
                onChange={(e) =>
                  setFormFields({
                    ...formFields,
                    chronicConditions: e.target.value,
                  })
                }
                placeholder="Diabetes, Asthma, Hypertension, etc..."
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Emergency contact */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-teal-700 uppercase border-b border-gray-100 pb-1">
            3. Emergency Guardian Contact
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Contact Name"
              value={formFields.emergencyContactName}
              onChange={(e) =>
                setFormFields({
                  ...formFields,
                  emergencyContactName: e.target.value,
                })
              }
            />
            <Input
              label="Contact Phone"
              value={formFields.emergencyContactPhone}
              onChange={(e) =>
                setFormFields({
                  ...formFields,
                  emergencyContactPhone: e.target.value,
                })
              }
            />
            <Input
              label="Relationship"
              placeholder="e.g. Spouse, Sister"
              value={formFields.emergencyContactRelation}
              onChange={(e) =>
                setFormFields({
                  ...formFields,
                  emergencyContactRelation: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Save Medical Profile
          </Button>
        </div>
      </form>
    </Card>
  );
}
