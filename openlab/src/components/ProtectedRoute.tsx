import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactElement;
  role?: "lab" | "student";
}) {
  const { auth } = useAuth();

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const allowed =
      auth.role === "master"
        ? auth.currentMode === role
        : auth.role === role;

    if (!allowed) {
      // unauthorized
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
