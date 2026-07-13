import React from "react";
import ServicesSection from "../../components/landing/ServicesSection";
import StatsSection from "../../components/landing/StatsSection";
import TestimonialsSection from "../../components/landing/TestimonialsSection";
import Navbar from "./Navbar";
import Footer from "../../components/landing/Footer";

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen pt-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ServicesSection />
      </div>

      <div className="w-full">
        <StatsSection />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <TestimonialsSection />
      </div>

      <Footer />
    </div>
  );
}
