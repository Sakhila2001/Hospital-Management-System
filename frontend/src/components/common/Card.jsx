import React from "react";

export default function Card({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  onClick, 
  children, 
  className = "" 
}) {
  const isStatCard = value !== undefined;

  if (isStatCard) {
    return (
      <div 
        onClick={onClick}
        className={`bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between transition-all ${
          onClick ? "hover:shadow-md hover:border-teal-200 cursor-pointer" : ""
        } ${className}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </span>
          {Icon && <Icon className="h-5 w-5 text-teal-600/70" />}
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold text-gray-800">{value}</span>
          {subtitle && (
            <span className="text-xs text-gray-500 font-medium">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-xl border border-gray-200 shadow-xs transition-all ${
        onClick ? "hover:shadow-md hover:border-teal-200 cursor-pointer" : ""
      } ${className}`}
    >
      {title && (
        <div className="border-b border-gray-100 pb-3 mb-4 flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h3>
          {Icon && <Icon className="h-5 w-5 text-teal-600/70" />}
        </div>
      )}
      {children}
    </div>
  );
}
