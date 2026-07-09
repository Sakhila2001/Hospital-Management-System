import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    // Since this is frontend-only, we mock a successful patient login:
    // If the email is "admin@citycare.com", we redirect to admin panel! That is extremely smart!
    // Otherwise, we redirect to patient home or show a mock success message.
    console.log("Login payload:", formData);
    if (formData.email.toLowerCase() === "admin@citycare.com") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      
      {/* Left Column - Branding Card (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-teal-600 to-teal-800 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Soft background shape */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        
        {/* Header Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <img src={Logo} alt="Logo" className="h-10 w-auto brightness-200 invert" />
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest leading-none">City Care</h1>
            <span className="text-[10px] text-teal-200 font-semibold uppercase tracking-wider">Patient Portal</span>
          </div>
        </div>

        {/* Branding Info */}
        <div className="space-y-6 relative z-10 max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-teal-100 uppercase tracking-wider">
            Patient Services
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Your Health Portal, Managed Online.
          </h2>
          <p className="text-sm text-teal-100/90 leading-relaxed">
            Log in to manage your appointments, request prescription renewals, consult with specialists online, and download your clinical pathology reports.
          </p>

          <div className="pt-4 space-y-3 text-sm text-teal-150">
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-300" />
              Schedule and reschedule appointments
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-300" />
              Access lab reports and prescriptions
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-300" />
              Direct communication with doctors
            </p>
          </div>
        </div>

        {/* Footer info link */}
        <div className="text-xs text-teal-200/80 relative z-10">
          Are you a hospital employee?{" "}
          <Link to="/register/staff" className="text-white font-bold hover:underline">
            Staff Access Portal &rarr;
          </Link>
        </div>
      </div>

      {/* Right Column - Sign-in Form (Full Width on Mobile) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-6">
          
          {/* Header titles */}
          <div className="space-y-2 text-left">
            <span className="inline-block rounded-full bg-teal-50 px-3.5 py-1 text-xs font-semibold tracking-wide text-teal-600 uppercase">
              Secure Sign In
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Sign in to City Care
            </h2>
            <p className="text-xs text-gray-500">
              Welcome back! Please enter your email and password to log in.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. robert@example.com"
                className="mt-1 w-full bg-gray-50 border border-gray-300/80 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="mt-1 w-full bg-gray-50 border border-gray-300/80 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none"
                required
              />
            </div>

            {/* Remember me & Forgot Pass */}
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded-sm border-gray-300 text-teal-650" />
                Remember me
              </label>
              <a href="#" className="hover:underline text-teal-600">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-md transition-colors cursor-pointer text-center text-xs"
            >
              Sign In
            </button>
          </form>

          {/* Redirection link */}
          <p className="text-gray-500 text-xs text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-teal-600 font-bold hover:underline">
              Create account
            </Link>
          </p>

          {/* Quick Admin Access Hint */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-[10px] text-gray-500 text-center leading-normal">
            <b>Prototype Access:</b> To enter the administrative dashboard directly, you can log in using <b>admin@citycare.com</b>.
          </div>

        </div>
      </div>

    </div>
  );
}