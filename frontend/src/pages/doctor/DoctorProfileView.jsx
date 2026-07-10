import React from "react";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import {
  PencilSquareIcon,
  UserIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const DAY_LABELS = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

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

function formatTime(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m || 0));
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export default function DoctorProfileView({ doctor, onEdit }) {
  return (
    <Card title="Doctor Profile">
      <div className="space-y-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500 max-w-lg">
              This is your professional profile on record. Patients and
              reception see this information when booking with you.
            </p>
          </div>
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
              value={`Dr. ${doctor.firstName || ""} ${doctor.lastName || ""}`.trim()}
            />
            <Field label="Gender" value={doctor.gender} />
            <Field label="Date of Birth" value={formatDate(doctor.dateOfBirth)} />
            <Field label="Phone" value={doctor.phone} icon={PhoneIcon} />
            <Field label="Address" value={doctor.address} />
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                Duty Status
              </p>
              <Badge
                text={doctor.isAvailable ? "On-Duty" : "Off-Duty"}
                variant={doctor.isAvailable ? "success" : "danger"}
              />
            </div>
          </div>
        </SectionCard>

        {/* Professional Info */}
        <SectionCard icon={BriefcaseIcon} title="Professional Information">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Field label="Specialization" value={doctor.specialization} />
            <Field label="Qualification" value={doctor.qualification} />
            <Field
              label="Experience"
              value={
                doctor.experienceYears !== undefined && doctor.experienceYears !== null
                  ? `${doctor.experienceYears} yrs`
                  : null
              }
            />
            <Field label="License Number" value={doctor.licenseNumber} />
            <Field label="Department" value={doctor.departmentName || doctor.Department?.name} />
          </div>
          {doctor.bio && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                Bio
              </p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {doctor.bio}
              </p>
            </div>
          )}
        </SectionCard>

        {/* Availability */}
        <SectionCard icon={CalendarDaysIcon} title="Availability & Schedule">
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">
                Available Days
              </p>
              {doctor.availableDays?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {doctor.availableDays.map((day) => (
                    <span
                      key={day}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-teal-50 text-teal-700 border-teal-200"
                    >
                      {DAY_LABELS[day] || day}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400 italic">Not set</span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <Field label="Available From" value={formatTime(doctor.availableTimeStart)} />
              <Field label="Available Until" value={formatTime(doctor.availableTimeEnd)} />
            </div>
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
          <span className="capitalize">{value}</span>
        ) : (
          <span className="text-gray-400 italic font-normal">Not provided</span>
        )}
      </div>
    </div>
  );
}