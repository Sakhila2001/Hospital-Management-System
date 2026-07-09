import { useState } from "react";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StaffRegister from "./pages/auth/StaffRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AdminProvider } from "./context/AdminContext";
import BookingWidget from "./components/landing/BookingWidget";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";

function App() {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/staff" element={<StaffRegister />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/patient/appointment" element={<BookingWidget />} />
        <Route path="/doctor/*" element={<DoctorDashboard />} />
        <Route path="receptionist/*" element={<ReceptionistDashboard />} />
        <Route path="patient/*" element={<PatientDashboard />} />
      </Routes>
    </AdminProvider>
  );
}

export default App;
