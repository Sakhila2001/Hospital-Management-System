import { useState } from "react";
import loginBanner from "../../assets/images/hms login banner.jpg";
import { Link } from "react-router-dom";

const ROLES = [
  { value: "doctor", label: "Doctor" },
  { value: "receptionist", label: "Receptionist" },
  { value: "patient", label: "Patient" },
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
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

    // formData already matches the expected payload shape:
    // { email, firstName, lastName, role, password, confirmPassword }
    console.log("Staff register payload:", formData);
    // TODO: call your register API here, e.g.
    // await api.post("/auth/staff-register", formData);
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${loginBanner})` }}
    >
      {/* Dark overlay so the form card stays readable over the photo */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="md:w-136 w-104 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-8 py-10"
        >
          <span className="inline-block rounded-full bg-teal-50 px-4 py-1 text-xs font-semibold tracking-wide text-teal-600 uppercase">
            Staff Access
          </span>
          <h2 className="text-4xl text-gray-900 font-medium mt-4">
            Create staff account
          </h2>
          <p className="text-sm text-gray-500/90 mt-3 text-center">
            Register as a doctor or receptionist to access the hospital
            dashboard
          </p>

          {error && (
            <p className="w-full text-sm text-red-500 mt-5 -mb-2 text-left">
              {error}
            </p>
          )}

          <div className="flex gap-3 w-full mt-6">
            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 1.5c-3.11 0-7 1.567-7 3.5v1.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V13c0-1.933-3.89-3.5-7-3.5Z"
                  fill="#6B7280"
                />
              </svg>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>

            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>
          </div>

          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg
              width="16"
              height="11"
              viewBox="0 0 16 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email id"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          {/* Role selector */}
          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 1.5 1 4v4c0 3.5 2.5 6.6 6 7.5 3.5-.9 6-4 6-7.5V4zM7 7.75a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Zm3.25 3.4c0 .58-1.46 1.35-3.25 1.35s-3.25-.77-3.25-1.35c0-.9 1.46-1.65 3.25-1.65s3.25.75 3.25 1.65Z"
                fill="#6B7280"
              />
            </svg>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full pr-6"
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

          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-8 w-full h-11 rounded-full text-white bg-teal-500 hover:opacity-90 transition-opacity"
          >
            Create staff account
          </button>
          <p className="text-gray-500/90 text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-500 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
