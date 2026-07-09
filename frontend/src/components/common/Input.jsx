import React from "react";

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error = "",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-teal-500 focus:bg-white outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? "border-red-500 focus:ring-red-500" : ""
        }`}
        {...props}
      />
      {error && (
        <p className="text-[10px] text-red-500 font-semibold">{error}</p>
      )}
    </div>
  );
}
