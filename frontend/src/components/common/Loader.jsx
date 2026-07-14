import React from "react";

export default function Loader({ fullScreen = false, size = "md", className = "" }) {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  };

  const currentSize = sizes[size] || sizes.md;

  const spinner = (
    <div 
      className={`animate-spin rounded-full border-t-transparent border-teal-650 ${currentSize} ${className}`}
      role="status"
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-xs">
        {spinner}
      </div>
    );
  }

  return spinner;
}
