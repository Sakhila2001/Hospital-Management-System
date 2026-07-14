import React from "react";
import Navbar from "../../pages/public/Navbar";
import Footer from "./Footer";
import BookingWidget from "./BookingWidget";

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
      <Navbar />
      <main>
        <BookingWidget />
      </main>
      <Footer />
    </div>
  );
}
