import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-550 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const sizeStyle = "px-5 py-2.5 text-sm";

  const variants = {
    primary: "bg-teal-650 hover:bg-teal-600 text-white shadow-sm border border-transparent cursor-pointer",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-transparent cursor-pointer",
    outline: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 cursor-pointer",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-sm border border-transparent cursor-pointer",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 cursor-pointer"
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${sizeStyle} ${currentVariant} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
