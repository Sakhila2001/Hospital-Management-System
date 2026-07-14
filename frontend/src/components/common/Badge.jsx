import React from "react";

export default function Badge({ text, variant = "gray", className = "" }) {
  const baseStyle = "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block select-none";

  const variants = {
    success: "bg-green-50 text-green-700 border border-green-150",
    danger: "bg-red-50 text-red-700 border border-red-150",
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-150",
    info: "bg-blue-50 text-blue-700 border border-blue-150",
    gray: "bg-gray-100 text-gray-700 border border-gray-200"
  };

  const currentVariant = variants[variant] || variants.gray;

  return (
    <span className={`${baseStyle} ${currentVariant} ${className}`}>
      {text}
    </span>
  );
}
