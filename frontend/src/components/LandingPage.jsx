import React, { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";

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

const navigation = [
  { name: "Services", href: "#services" },
  { name: "Departments", href: "#departments" },
  { name: "About Us", href: "#about" },
  { name: "Contact Desk", href: "#contact" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const { user } = useAuth();

  const roleRoutes = {
    admin: "/admin",
    doctor: "/doctor",
    receptionist: "/receptionist",
    patient: "/patient",
  };
  const dashboardPath = user ? roleRoutes[user.roles] || "/" : "/login";
  const bookingPath = user ? "/user/appointment" : "/login";

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Toast Relayer */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ show: false, message: "", type: "success" })}
      />

      {/* Main Header / Navigation */}
      <header className="fixed inset-x-0 top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-150">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto"
        >
          {/* Logo brand */}
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2.5">
              <img src={Logo} alt="City Care Logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-gray-900 text-sm font-extrabold tracking-wide uppercase">
                  City Care
                </h1>
                <p className="text-[10px] text-teal-600 font-bold -mt-1 leading-none uppercase">
                  Hospital Center
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-semibold text-gray-700 hover:text-teal-600 transition-colors cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
            <Link
              to={dashboardPath}
              className="text-sm font-semibold text-gray-955 hover:text-teal-600 transition-colors mr-2"
            >
              {user ? "Dashboard" : "Login Portal"}
            </Link>
            <Link
              to={bookingPath}
              className="rounded-full bg-teal-600 px-4.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 transition-all cursor-pointer text-center"
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
                <img src={Logo} alt="City Care Logo" className="h-10 w-auto" />
                <span className="text-sm font-extrabold text-gray-955 tracking-wide uppercase">
                  City Care
                </span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="-mx-3 block w-full text-left rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
                <div className="py-6 space-y-2">
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {user ? "Dashboard" : "Login Portal"}
                  </Link>
                  <Link
                    to={bookingPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block w-full text-center rounded-lg bg-teal-600 px-3 py-2.5 text-base font-semibold text-white hover:bg-teal-500 cursor-pointer"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

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
