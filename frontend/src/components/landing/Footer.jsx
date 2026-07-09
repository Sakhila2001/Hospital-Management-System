import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Hospital Brand & Intro */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <img src={Logo} alt="Logo" className="h-10 w-auto brightness-200 invert" />
            <div>
              <h2 className="text-white text-base font-bold tracking-wide uppercase">City Care</h2>
              <p className="text-xs text-teal-400 font-semibold -mt-0.5">Hospital Center</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-500">
            Dedicated to providing compassion-filled medical therapy and critical clinical support to our community.
          </p>
        </div>

        {/* Quick Navigation Links */}
        <div className="space-y-4">
          <h3 className="text-white text-sm font-bold uppercase tracking-wider">Patient Links</h3>
          <ul className="space-y-2 text-xs">
            <li><a href="#services" className="hover:text-white transition-colors">Our Services</a></li>
            <li><a href="#departments" className="hover:text-white transition-colors">Departments</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact Desk</a></li>
            <li><Link to="/login" className="hover:text-white transition-colors text-teal-400 font-semibold">Book Appointment</Link></li>
          </ul>
        </div>

        {/* Portal access links */}
        <div className="space-y-4">
          <h3 className="text-white text-sm font-bold uppercase tracking-wider">Hospital Staff</h3>
          <ul className="space-y-2 text-xs">
            <li><Link to="/register/staff" className="hover:text-white transition-colors">Register as Staff</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Staff Portal Login</Link></li>
            <li><Link to="/admin" className="hover:text-white transition-colors">Administrator Panel</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-white text-sm font-bold uppercase tracking-wider">Contact Desk</h3>
          <ul className="space-y-2 text-xs text-gray-500 leading-relaxed">
            <li className="text-gray-400"><b>Address:</b> 789 Healthcare Dr, Metro City</li>
            <li><b>Helpline:</b> +1 (555) 019-900</li>
            <li><b>Emergency Dispatch:</b> +1 (555) 019-911</li>
            <li><b>Support Email:</b> care@citycarehospital.com</li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} City Care Hospital. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
