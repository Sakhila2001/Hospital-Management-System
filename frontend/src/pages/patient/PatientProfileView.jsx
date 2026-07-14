import React from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  PencilSquareIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  UserGroupIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function calculateAge(dateStr) {
  if (!dateStr) return null;
  const dob = new Date(dateStr);
  if (isNaN(dob.getTime())) return null;
  const diff = Date.now() - dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export default function PatientProfileView({ patient, onEdit }) {
  const age = calculateAge(patient.dateOfBirth);

  return (
    <Card title="Manage Medical File & Records">
      <div className="space-y-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <p className="text-sm text-gray-500 max-w-lg">
            This is your medical file on record. Keep it up to date so our
            care team always has accurate information.
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={onEdit}
            className="shrink-0 flex items-center justify-center gap-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Personal Info */}
        <SectionCard icon={UserIcon} title="Personal Information">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Field
              label="Full Name"
              value={
                patient.firstName || patient.lastName
                  ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim()
                  : null
              }
            />
            <Field
              label="Date of Birth"
              value={
                patient.dateOfBirth
                  ? `${formatDate(patient.dateOfBirth)}${
                      age !== null ? ` (${age} yrs)` : ""
                    }`
                  : null
              }
            />
            <Field label="Gender" value={patient.gender} />
            <Field label="Blood Group" value={patient.bloodGroup} />
            <Field label="Marital Status" value={patient.maritalStatus} />
          </div>
        </SectionCard>

        {/* Contact info */}
        <SectionCard icon={MapPinIcon} title="Contact & Residential Info">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Field label="Phone Number" value={patient.phone} />
            <Field label="City" value={patient.city} />
            <Field label="Full Address" value={patient.address} />
          </div>
        </SectionCard>

        {/* Clinical History */}
        <SectionCard icon={HeartIcon} title="Clinical Allergy & Chronic Records">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <PillField
              label="Allergies"
              value={patient.allergies}
              tone="amber"
              icon={ExclamationTriangleIcon}
            />
            <PillField
              label="Chronic Conditions"
              value={patient.chronicConditions}
              tone="teal"
            />
          </div>
        </SectionCard>

        {/* Emergency contact */}
        <SectionCard icon={UserGroupIcon} title="Emergency Guardian Contact">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Field label="Contact Name" value={patient.emergencyContactName} />
            <Field
              label="Contact Phone"
              value={patient.emergencyContactPhone}
              icon={PhoneIcon}
            />
            <Field
              label="Relationship"
              value={patient.emergencyContactRelation}
            />
          </div>
        </SectionCard>
      </div>
    </Card>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-teal-50 text-teal-600">
          <Icon className="h-4 w-4" />
        </span>
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, icon: Icon = null }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
        {Icon && value && <Icon className="h-3.5 w-3.5 text-gray-400 shrink-0" />}
        {value ? (
          <span>{value}</span>
        ) : (
          <span className="text-gray-400 italic font-normal">Not provided</span>
        )}
      </div>
    </div>
  );
}

// Splits comma-separated values (e.g. "Penicillin, Peanuts") into pill badges
function PillField({ label, value, tone = "gray", icon: Icon = null }) {
  const toneClasses = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const items = value
    ? value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

  return (
    <div>
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">
        {label}
      </p>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${toneClasses[tone]}`}
            >
              {Icon && <Icon className="h-3 w-3" />}
              {item}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-sm text-gray-400 italic">Not provided</span>
      )}
    </div>
  );
}