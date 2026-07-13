import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function FullPageLoader() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-gray-50">
      <div className="h-10 w-10 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
      <p className="text-sm font-medium text-gray-500">
        Loading your dashboard…
      </p>
    </div>
  );
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.roles)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
