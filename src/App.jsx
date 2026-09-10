import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProposalPage from "./pages/ProposalPage";
import AboutPage from "./pages/AboutPage";
import RegisterPage from "./pages/RegisterPage";
import PacDashboard from "./pages/PacDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReviewHistoryPage from "./pages/ReviewHistoryPage";
import ChairmanDashboard from "./pages/ChairmanDashboard";
import { GuestRoute, ProtectedRoute } from "./components/AuthGuards";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-white to-green-100">
      <Header />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Guest Routes - Redirect logged-in users away from Login & Register */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        {/* Protected Routes - Redirect unauthenticated users to Login */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proposal"
          element={
            <ProtectedRoute>
              <ProposalPage setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pac-Dashboard"
          element={
            <ProtectedRoute allowedRoles={["PAC_MEMBER", "pac"]}>
              <PacDashboard setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-Dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "admin"]}>
              <AdminDashboard setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chairman-dashboard"
          element={
            <ProtectedRoute allowedRoles={["CHAIRMAN", "chairman"]}>
              <ChairmanDashboard setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}

export default App;