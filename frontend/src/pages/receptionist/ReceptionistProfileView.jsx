import React from "react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import {
  PencilSquareIcon,
  UserIcon,
  BriefcaseIcon,
  PhoneIcon,
  CalendarDaysIcon,
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

const SHIFT_TONE = {
  Morning: "bg-sky-50 text-sky-700 border-sky-200",
  Evening: "bg-orange-50 text-orange-700 border-orange-200",
  Night: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export default function ReceptionistProfileView({
  receptionist,
  departmentName,
  onEdit,
}) {
  return (
    <Card title="Receptionist Profile">
      <div className="space-y-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <p className="text-sm text-gray-500 max-w-lg">
            This is your staff profile on record. Admins and other desks see
            this information for shift coordination.
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
              value={`${receptionist.firstName || ""} ${receptionist.lastName || ""}`.trim()}
            />
            <Field label="Phone" value={receptionist.phone} icon={PhoneIcon} />
            <Field label="Email" value={receptionist.email} />
          </div>
        </SectionCard>

        {/* Work Info */}
        <SectionCard icon={BriefcaseIcon} title="Work Assignment">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Field label="Employee Code" value={receptionist.employeeCode} />
            <Field label="Department" value={departmentName} />
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                Shift
              </p>
              {receptionist.shift ? (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    SHIFT_TONE[receptionist.shift] ||
                    "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {receptionist.shift}
                </span>
              ) : (
                <span className="text-sm text-gray-400 italic">Not set</span>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Tenure */}
        <SectionCard icon={CalendarDaysIcon} title="Tenure">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Field label="Joined Date" value={formatDate(receptionist.joinedDate)} />
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