import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Modal({ isOpen, onClose, title, badge, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      {/* Modal Container Card */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[85vh] overflow-hidden transform scale-100 transition-all border border-gray-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200/60 flex items-center justify-between">
          <div>
            {badge && (
              <span className="inline-block rounded-full bg-teal-50 px-3 py-0.5 text-[10px] font-semibold tracking-wide text-teal-600 uppercase">
                {badge}
              </span>
            )}
            <h3 className="text-lg font-bold text-gray-800 mt-1 capitalize">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 text-gray-500 rounded-full transition-colors cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}
