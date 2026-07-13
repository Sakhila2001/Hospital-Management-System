import React from "react";
import DepartmentsSection from "../../components/landing/DepartmentsSection";
import DoctorsSection from "../../components/landing/DoctorsSection";
import Navbar from "./Navbar";
import Footer from "../../components/landing/Footer";

export default function DepartmentsPage() {
  return (
    <div className="bg-white min-h-screen pt-20">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DepartmentsSection />
        <div className="mt-16 border-t border-gray-100 pt-16">
          <DoctorsSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}
