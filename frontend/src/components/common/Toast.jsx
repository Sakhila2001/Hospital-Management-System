import React, { useEffect } from "react";

export default function Toast({ message, type = "success", show, onClose }) {
  useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl animate-bounce transition-all duration-300 border bg-white" 
      style={{ minWidth: "250px" }}
    >
      {type === "success" ? (
        <div className="h-2 w-2 rounded-full bg-teal-500 ring-4 ring-teal-100" />
      ) : type === "error" ? (
        <div className="h-2 w-2 rounded-full bg-red-500 ring-4 ring-red-100" />
      ) : (
        <div className="h-2 w-2 rounded-full bg-yellow-500 ring-4 ring-yellow-100" />
      )}
      <span className={`text-sm font-medium ${
        type === "success" ? "text-teal-800" : type === "error" ? "text-red-800" : "text-yellow-800"
      }`}>
        {message}
      </span>
    </div>
  );
}
