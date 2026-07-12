import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";

import { Route, Routes, Navigate } from "react-router-dom";
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
// Admin sub-views
import Overview from "./pages/admin/Overview";
import Appointments from "./pages/admin/Appointments";
import Departments from "./pages/admin/Departments";
import Doctors from "./pages/admin/Doctors";
import Receptionists from "./pages/admin/Receptionists";
import Patients from "./pages/admin/Patients";

// Doctor sub-views
import DoctorOverview from "./pages/doctor/DoctorOverview";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";
import DoctorProfile from "./pages/doctor/DoctorProfile";

// Patient sub-views
import PatientOverview from "./pages/patient/PatientOverview";
import PatientBookAppointment from "./pages/patient/PatientBookAppointment";
import PatientProfile from "./pages/patient/PatientProfile";

// Receptionist sub-views
import ReceptionistOverview from "./pages/receptionist/ReceptionistOverview";
import ReceptionistAppointments from "./pages/receptionist/ReceptionistAppointments";
import ReceptionistPatients from "./pages/receptionist/ReceptionistPatients";
import ReceptionistProfile from "./pages/receptionist/ReceptionistProfile";

function App() {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/staff" element={<StaffRegister />} />
        {/* Admin sub-views */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="departments" element={<Departments />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="receptionists" element={<Receptionists />} />
          <Route path="patients" element={<Patients />} />
        </Route>
        <Route path="/user/appointment" element={<BookingWidget />} />
        {/* Doctor sub-views */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DoctorOverview />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>

        <Route
          path="receptionist/*"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ReceptionistOverview />} />
          <Route path="appointments" element={<ReceptionistAppointments />} />
          <Route path="patients" element={<ReceptionistPatients />} />
          <Route path="profile" element={<ReceptionistProfile />} />
        </Route>
        {/* Patient sub-views */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<PatientOverview />} />
          <Route path="book" element={<PatientBookAppointment />} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>
      </Routes>
    </AdminProvider>
  );
}

export default App;
