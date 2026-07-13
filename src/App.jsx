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
function App() {


const [isLoggedIn, setIsLoggedIn] = useState(() => {

    return localStorage.getItem("isLoggedIn") === "true";

});;

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-white to-green-100">

      <Header />

      {
  !isLoggedIn &&
 <Navbar />
}

     <Routes>

    <Route
        path="/"
        element={<LandingPage />}
    />

    <Route
        path="/login"
        element={
            <LoginPage
                setIsLoggedIn={setIsLoggedIn}
            />
        }
    />

    <Route
        path="/register"
        element={<RegisterPage />}
    />

    <Route
        path="/dashboard"
        element={
            <DashboardPage
                setIsLoggedIn={setIsLoggedIn}
            />
        }
    />

    <Route
        path="/proposal"
        element={
            <ProposalPage
                setIsLoggedIn={setIsLoggedIn}
            />
        }
    />

    <Route
        path="/pac-Dashboard"
        element={
            <PacDashboard
                setIsLoggedIn={setIsLoggedIn}
            />
        }
    />

    <Route
        path="/admin-Dashboard"
        element={
            <AdminDashboard
                setIsLoggedIn={setIsLoggedIn}
            />
        }
    />

   
    <Route
        path="/about"
        element={<AboutPage />}
    />

</Routes>

    </div>
  );
}

export default App;