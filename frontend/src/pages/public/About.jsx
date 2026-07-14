import React from "react";
import AboutSection from "../../components/landing/AboutSection";
import FaqSection from "../../components/landing/FaqSection";
import StatsSection from "../../components/landing/StatsSection";
import Navbar from "./Navbar";
import Footer from "../../components/landing/Footer";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pt-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AboutSection />
      </div>

      <div className="w-full">
        <StatsSection />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 mt-8">
        <FaqSection />
      </div>

      <Footer />
    </div>
  );
}
