import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

export function getDashboardPath() {
  const role = localStorage.getItem("role");
  const userType = localStorage.getItem("userType");

  if (role === "ADMIN" || userType === "admin") return "/admin-Dashboard";
  if (role === "PAC_MEMBER" || userType === "pac") return "/pac-Dashboard";
  if (role === "CHAIRMAN" || userType === "chairman") return "/chairman-dashboard";
  return "/dashboard";
}

export function GuestRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    return <Navigate to={getDashboardPath()} replace />;
  }

  return children ? children : <Outlet />;
}

export function ProtectedRoute({ children, allowedRoles }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");
  const userType = localStorage.getItem("userType");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(
      (r) => r === role || r === userType
    );
    if (!hasRole) {
      return <Navigate to={getDashboardPath()} replace />;
    }
  }

  return children ? children : <Outlet />;
}
