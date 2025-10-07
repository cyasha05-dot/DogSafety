// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "../utils/auth"; // implement your logic here

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAdminLoggedIn()) {
    // User is not logged in, redirect to admin login
    return <Navigate to="/admin-register" replace />;
  }

  // User is logged in, render children
  return <>{children}</>;
}
