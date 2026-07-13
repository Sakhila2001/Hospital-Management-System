import React, { useState } from "react";
import Navbar from "../pages/public/Navbar";

// Modular Landing Sections
import HeroSection from "./landing/HeroSection";
import StatsSection from "./landing/StatsSection";
import ServicesSection from "./landing/ServicesSection";
import DepartmentsSection from "./landing/DepartmentsSection";
import AboutSection from "./landing/AboutSection";
import ContactSection from "./landing/ContactSection";
import DoctorsSection from "./landing/DoctorsSection";
import TestimonialsSection from "./landing/TestimonialsSection";
import FaqSection from "./landing/FaqSection";
import Footer from "./landing/Footer";

// Reusable Notification Component
import Toast from "./common/Toast";

export default function LandingPage() {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  return (
    <div className="bg-white min-h-screen font-sans pt-16">
      {/* Toast Relayer */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ show: false, message: "", type: "success" })}
      />

      <Navbar />

      {/* Main Sections Composition */}
      <main className="space-y-0">
        <HeroSection />

        <StatsSection />

        <ServicesSection />

        <DepartmentsSection />

        <AboutSection />

        <DoctorsSection />

        <ContactSection triggerToast={triggerToast} />

        <TestimonialsSection />

        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
