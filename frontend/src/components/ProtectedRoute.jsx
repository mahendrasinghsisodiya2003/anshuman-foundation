import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // if not logged in, redirect to login
    return <Navigate to="/" replace />;
  }

  return children;
}
