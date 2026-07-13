import React, { useEffect } from "react";

export default function Toast({ message, type = "success", show, onClose }) {
  useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const colors = {
    success: "text-teal-800 border-teal-800",
    error: "text-red-800 border-red-800",
    warning: "text-yellow-800 border-yellow-800",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl transition-all duration-300 border bg-white ${
        colors[type] || colors.success
      }`}
      style={{ minWidth: "250px" }}
    >
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
