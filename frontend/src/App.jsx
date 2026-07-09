import { useState } from "react";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StaffRegister from "./pages/auth/StaffRegister";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/staff" element={<StaffRegister />} />
      </Routes>
    </>
  );
}

export default App;
