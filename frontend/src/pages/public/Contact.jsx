import React, { useState } from "react";
import ContactSection from "../../components/landing/ContactSection";
import Toast from "../../components/common/Toast";
import Navbar from "./Navbar";
import Footer from "../../components/landing/Footer";

export default function ContactPage() {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      <Navbar />
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ show: false, message: "", type: "success" })}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ContactSection triggerToast={triggerToast} />
      </div>
      <Footer />
    </div>
  );
}
