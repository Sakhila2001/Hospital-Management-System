import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const ROLES = [
  { value: "doctor", label: "Doctor" },
  { value: "receptionist", label: "Receptionist" },
];

export default function StaffRegister() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.role) {
      setError("Please select a role");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5900/api/auth/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          roles: formData.role, // this is the only real difference from patient Register — role comes from the dropdown instead of being hardcoded
        },
        { withCredentials: true },
      );

      setSuccess(res.data.message);
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left Column - Branding Card (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-teal-600 to-teal-800 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Soft background shape */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        {/* Header Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <img
            src={Logo}
            alt="Logo"
            className="h-10 w-auto brightness-200 invert"
          />
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest leading-none">
              City Care
            </h1>
            <span className="text-[10px] text-teal-200 font-semibold uppercase tracking-wider">
              Clinical Workspace
            </span>
          </div>
        </div>

        {/* Branding Info */}
        <div className="space-y-6 relative z-10 max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-teal-100 uppercase tracking-wider">
            Workspace Enrollment
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Empowering Clinical Teams With Modern Systems.
          </h2>
          <p className="text-sm text-teal-100/90 leading-relaxed">
            Create your practitioner account to gain access to the clinical
            admin panels, department scheduling widgets, and real-time patient
            charts.
          </p>

          <div className="pt-4 space-y-3 text-sm text-teal-150">
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-300" />
              Integrated patient record sheets
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-300" />
              Roster shift configurations
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-300" />
              Dynamic clinical diagnostics log
            </p>
          </div>
        </div>

        {/* Footer info link */}
        <div className="text-xs text-teal-200/80 relative z-10">
          Need to schedule a medical visit?{" "}
          <Link to="/" className="text-white font-bold hover:underline">
            Go to Patient Homepage &rarr;
          </Link>
        </div>
      </div>

      {/* Right Column - Registration Form (Full Width on Mobile) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Header titles */}
          <div className="space-y-2 text-left">
            <span className="inline-block rounded-full bg-teal-50 px-3.5 py-1 text-xs font-semibold tracking-wide text-teal-600 uppercase">
              Staff Portal
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create staff account
            </h2>
            <p className="text-xs text-gray-500">
              Register as a doctor or receptionist to access the hospital
              portals.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-semibold">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Sarah"
                  className="mt-1 w-full bg-gray-50 border border-gray-300/80 rounded-lg p-2.5 text-xs focus:ring-teal-500 focus:bg-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Connor"
                  className="mt-1 w-full bg-gray-50 border border-gray-300/80 rounded-lg p-2.5 text-xs focus:ring-teal-500 focus:bg-white outline-none"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. sarah.connor@citycare.com"
                className="mt-1 w-full bg-gray-50 border border-gray-300/80 rounded-lg p-2.5 text-xs focus:ring-teal-500 focus:bg-white outline-none"
                required
              />
            </div>

            {/* Role selection dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Hospital Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full bg-gray-50 border border-gray-300/80 rounded-lg p-2.5 text-xs focus:ring-teal-500 focus:bg-white outline-none font-semibold text-gray-700"
                required
              >
                <option value="" disabled>
                  Select role
                </option>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password (min 6 characters)"
                  className="w-full bg-gray-50 border border-gray-300/80 rounded-lg p-2.5 pr-10 text-xs focus:ring-teal-500 focus:bg-white outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-teal-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Verify password"
                  className="w-full bg-gray-50 border border-gray-300/80 rounded-lg p-2.5 pr-10 text-xs focus:ring-teal-500 focus:bg-white outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-teal-600 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-md transition-colors cursor-pointer text-center text-xs"
            >
              Register Staff Account
            </button>
          </form>

          {/* Redirection link */}
          <p className="text-gray-500 text-xs text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-600 font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
