import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiShield,
  FiClock,
  FiFileText,
  FiBarChart2,
  FiFilePlus,
  FiUsers,
  FiEdit3,
  FiCheckCircle,
  FiBell,
  FiCalendar,
  FiPhone,
  FiMail,
  FiHelpCircle,
  FiArrowRight,
  FiAlertCircle,
  FiX,
  FiKey,
  FiSmartphone
} from "react-icons/fi";
import { HiBuildingLibrary } from "react-icons/hi2";
import { FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [passw, setPassw] = useState("");
  const [userId, setUserId] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForceLogin, setShowForceLogin] = useState(false);
  const [showInvalidError, setShowInvalidError] = useState(false);
  const [captchaImage, setCaptchaImage] = useState(
    () => "http://localhost:8080/api/captcha?t=" + Date.now()
  );
  const [forceLogin, setForceLogin] = useState(false);
  const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false);

  // Forgot Password Modal States
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Identifier, 2: OTP & Reset, 3: Success
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotMaskedPhone, setForgotMaskedPhone] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer countdown for Resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const openForgotPassword = () => {
    setForgotStep(1);
    setForgotIdentifier(userId || "");
    setForgotOtp("");
    setForgotNewPassword("");
    setForgotConfirmPassword("");
    setForgotMaskedPhone("");
    setForgotError("");
    setForgotSuccess("");
    setResendTimer(0);
    setShowForgotPasswordModal(true);
  };

  const closeForgotPassword = () => {
    setShowForgotPasswordModal(false);
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    if (!forgotIdentifier.trim()) {
      setForgotError("Please enter your Username or Registered Mobile Number.");
      return;
    }
    setIsSendingOtp(true);
    try {
      const response = await axios.post("http://localhost:8080/api/employees/forgot-password/send-otp", {
        identifier: forgotIdentifier.trim()
      });
      if (response.data && response.data.success) {
        setForgotMaskedPhone(response.data.maskedPhone || "");
        setForgotSuccess(response.data.message || "OTP sent successfully.");
        setForgotStep(2);
        setResendTimer(60);
      } else {
        setForgotError(response.data?.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setForgotError("Network error or server unavailable. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!forgotOtp.trim()) {
      setForgotError("Please enter the 6-digit OTP received on your mobile.");
      return;
    }
    if (!forgotNewPassword) {
      setForgotError("Please enter your new password.");
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError("Password must be at least 6 characters long.");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("New password and confirm password do not match.");
      return;
    }

    setIsResettingPassword(true);
    try {
      const response = await axios.post("http://localhost:8080/api/employees/forgot-password/reset-password", {
        identifier: forgotIdentifier.trim(),
        otp: forgotOtp.trim(),
        newPassword: forgotNewPassword
      });

      if (response.data && response.data.success) {
        setForgotStep(3);
      } else {
        setForgotError(response.data?.message || "Invalid OTP or failed to reset password.");
      }
    } catch (err) {
      setForgotError("Failed to reset password. Please check your network and try again.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const refreshCaptcha = () => {
    setIsRefreshingCaptcha(true);
    setCaptchaImage("http://localhost:8080/api/captcha?t=" + Date.now());
    setTimeout(() => setIsRefreshingCaptcha(false), 400);
  };

  useEffect(() => {
    setCaptcha("");
    refreshCaptcha();
  }, []);

  async function handleLogin() {
    try {
      const url = forceLogin
        ? "http://localhost:8080/api/employees/force-login"
        : "http://localhost:8080/api/employees/login";

      const response = await axios.post(
        url,
        {
          username: userId,
          password: passw,
          captcha: captcha
        },
        {
          withCredentials: true
        }
      );

      if (response.data && response.data.id) {
        setForceLogin(false);
        localStorage.setItem("employeeId", response.data.id);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role.roleName);
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);

        if (response.data.role?.roleName === "ADMIN") {
          localStorage.setItem("userType", "admin");
          navigate("/admin-Dashboard", { replace: true });
        } else if (response.data.role?.roleName === "PAC_MEMBER") {
          localStorage.setItem("userType", "pac");
          navigate("/pac-Dashboard", { replace: true });
        } else if (response.data.role?.roleName === "CHAIRMAN") {
          localStorage.setItem("userType", "chairman");
          navigate("/chairman-dashboard", { replace: true });
        } else {
          localStorage.setItem("userType", "employee");
          navigate("/dashboard", { replace: true });
        }
      } else {
        setCaptcha("");
        refreshCaptcha();
        setShowInvalidError(true);
      }
    } catch (error) {
      setCaptcha("");
      refreshCaptcha();
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Already Logged In"
      ) {
        setShowForceLogin(true);
        return;
      } else {
        setShowInvalidError(true);
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased">
      {/* Hero Section with Blue Gradient & Building Overlay */}
      <section className="relative bg-gradient-to-r from-[#021b3e] via-[#022859] to-[#043e85] text-white py-12 lg:py-16 px-6 lg:px-16 overflow-hidden">
        {/* Background Building Image Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/nic_building.png"
            alt="NIC Building"
            className="absolute right-0 top-0 h-full w-full lg:w-3/5 object-cover opacity-20 mix-blend-luminosity lg:opacity-30 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#021b3e] via-[#021b3e]/90 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Document Icon Box */}
            <div className="w-13 h-13 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg text-blue-300">
              <FiFilePlus className="text-2xl" />
            </div>

            {/* Main Title & Accent */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                PAC Proposal <br className="hidden sm:inline" />
                Management System
              </h1>
              <div className="w-16 h-1 bg-blue-400 rounded-full mt-4"></div>
            </div>

            {/* Subtitle */}
            <p className="text-blue-100/90 text-sm sm:text-base max-w-xl leading-relaxed font-normal">
              A digital platform to streamline the submission, review, approval and management of project proposals for PAC meetings.
            </p>

            {/* 4 Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {/* Feature 1 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 text-xs text-blue-100 flex items-start gap-2.5 hover:bg-white/15 transition-all">
                <FiShield className="text-lg text-blue-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Secure</span>
                  <span className="text-[11px] text-blue-200 leading-tight">
                    Role-based access control
                  </span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 text-xs text-blue-100 flex items-start gap-2.5 hover:bg-white/15 transition-all">
                <FiClock className="text-lg text-blue-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Transparent</span>
                  <span className="text-[11px] text-blue-200 leading-tight">
                    Complete tracking and audit trail
                  </span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 text-xs text-blue-100 flex items-start gap-2.5 hover:bg-white/15 transition-all">
                <FiFileText className="text-lg text-blue-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Efficient</span>
                  <span className="text-[11px] text-blue-200 leading-tight">
                    End-to-end digital workflow
                  </span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 text-xs text-blue-100 flex items-start gap-2.5 hover:bg-white/15 transition-all">
                <FiBarChart2 className="text-lg text-blue-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Accountable</span>
                  <span className="text-[11px] text-blue-200 leading-tight">
                    Better decision making
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Login Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl p-7 lg:p-8 shadow-2xl border border-slate-100 text-slate-800 w-full max-w-[410px]">
              {/* Card Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome Back!
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Sign in to continue to your account
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-4"
              >
                {/* Username Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiUser className="text-blue-600 text-sm" />
                    <span>Username / Employee ID <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Username or Employee ID"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all font-medium"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiLock className="text-blue-600 text-sm" />
                    <span>Password <span className="text-red-500">*</span></span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Account Password"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all font-medium"
                      value={passw}
                      onChange={(e) => setPassw(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base transition-colors cursor-pointer"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {/* CAPTCHA Display & Input Box - Disabled for now */}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={openForgotPassword}
                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Primary Login Button */}
                <button
                  type="submit"
                  disabled={!userId.trim() || !passw.trim()}
                  className={`w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 text-sm ${
                    !userId.trim() || !passw.trim()
                      ? "opacity-60 cursor-not-allowed shadow-none"
                      : "cursor-pointer"
                  }`}
                >
                  <FiLock className="text-base" />
                  <span>Login</span>
                </button>

                {/* Or Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="shrink mx-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    or
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Secondary SSO Login Button */}
                <button
                  type="button"
                  onClick={() => alert("Redirecting to NIC Single Sign-On...")}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <HiBuildingLibrary className="text-blue-700 text-sm" />
                  <span>Login with NIC SSO</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & Announcements Section */}
      <section className="bg-slate-50/80 py-16 px-6 lg:px-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              How It Works
            </h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mt-2"></div>
          </div>

          <div className="flex flex-col xl:flex-row gap-8 items-start">
            {/* Left 5 Process Flow Cards */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col items-center text-center relative group hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
                  <FiFilePlus />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  Submit Proposal
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Employees submit project proposals with relevant documents.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col items-center text-center relative group hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
                  <FiUsers />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  PAC Review
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  PAC Members review, add remarks and request revisions if needed.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col items-center text-center relative group hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
                  <FiEdit3 />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  Revise & Resubmit
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Employees revise the proposal and resubmit based on feedback.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col items-center text-center relative group hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
                  <FiCheckCircle />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  Approve
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  After all PAC Members approve, Chairman gives final approval.
                </p>
              </div>

              {/* Step 5 */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col items-center text-center relative group hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
                  <FiFileText />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  Approval Letter
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Letter is generated for approved proposals in PAC meeting.
                </p>
              </div>
            </div>

            {/* Right Announcements Widget */}
            <div className="w-full xl:w-80 bg-blue-50/60 border border-blue-100/80 rounded-2xl p-5 shadow-xs shrink-0">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-4">
                <FiBell className="text-blue-600 text-base" />
                <span>Announcements</span>
              </div>

              <div className="space-y-3">
                {/* Announcement 1 */}
                <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase">
                      NEW
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      02 May 2024
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-1.5 leading-snug">
                    Next PAC Meeting scheduled on 09 May 2024 at 11:00 AM
                  </p>
                </div>

                {/* Announcement 2 */}
                <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                  <div className="flex items-center gap-2 text-blue-600 text-xs">
                    <FiCalendar />
                    <span className="text-[11px] text-slate-400 font-medium">
                      25 Apr 2024
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-1.5 leading-snug">
                    Last Date for Proposal Submission for May Meeting is 02 May 2024
                  </p>
                </div>
              </div>

              <a
                href="#announcements"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Announcements section view clicked.");
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 mt-4 transition-colors"
              >
                <span>View all announcements</span>
                <FiArrowRight className="text-xs" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white pt-10 pb-6 px-6 lg:px-16 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          {/* Column 1: Security Notice */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <FiShield className="text-blue-600 text-base" />
              <span>Secure | Transparent | Efficient</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Digitizing the proposal management process for better governance.
            </p>
          </div>

          {/* Column 2: Useful Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Useful Links
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <a href="#nic" className="hover:text-blue-600 transition-colors">
                  &rarr; NIC Odisha
                </a>
              </li>
              <li>
                <a href="#guidelines" className="hover:text-blue-600 transition-colors">
                  &rarr; PAC Guidelines
                </a>
              </li>
              <li>
                <a href="#help" className="hover:text-blue-600 transition-colors">
                  &rarr; Help Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Need Help */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Need Help?
            </h4>
            <div className="space-y-1.5 text-slate-600">
              <p className="flex items-center gap-2">
                <FiPhone className="text-blue-600 text-sm" />
                <span>0674-2303075</span>
              </p>
              <p className="flex items-center gap-2">
                <FiMail className="text-blue-600 text-sm" />
                <span>pac-support@nic.in</span>
              </p>
            </div>
          </div>

          {/* Column 4: Follow Us */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Follow Us
            </h4>
            <div className="flex items-center gap-2.5">
              <a
                href="#twitter"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 flex items-center justify-center transition-colors text-sm"
              >
                <FaTwitter />
              </a>
              <a
                href="#linkedin"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 flex items-center justify-center transition-colors text-sm"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="#youtube"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 flex items-center justify-center transition-colors text-sm"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center text-slate-400 gap-2">
          <p>&copy; 2026 NIC Odisha. All Rights Reserved.</p>
          <p>Best viewed in Chrome, Firefox, Edge and latest browsers.</p>
        </div>
      </footer>

      {/* Force Login Modal */}
      {showForceLogin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 lg:p-8 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Session Already Active
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              This account is already logged in on another device or session.
              <br />
              <br />
              Do you want to force terminate the previous session and continue here?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-semibold transition-all"
                onClick={() => setShowForceLogin(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-xs font-semibold transition-all shadow-md shadow-blue-600/20"
                onClick={() => {
                  setShowForceLogin(false);
                  setForceLogin(true);
                  setCaptcha("");
                  setCaptchaImage(
                    "http://localhost:8080/api/captcha?t=" + Date.now()
                  );
                }}
              >
                Continue & Force Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invalid Credentials Pop-up Modal */}
      {showInvalidError && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-slate-100 animate-in fade-in duration-200">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-red-100">
              <FiAlertCircle />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1.5">
              Invalid Credentials
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              The Username or Password entered is incorrect. Please verify your details and try again.
            </p>

            <button
              onClick={() => setShowInvalidError(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 lg:p-7 border border-slate-100 relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                  <FiKey />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    Reset Password
                  </h2>
                  <p className="text-xs text-slate-500">
                    {forgotStep === 1 && "Step 1 of 2: Verify Identity"}
                    {forgotStep === 2 && "Step 2 of 2: Enter OTP & New Password"}
                    {forgotStep === 3 && "Complete"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeForgotPassword}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Error message */}
            {forgotError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-4 flex items-start gap-2">
                <FiAlertCircle className="text-base text-red-500 shrink-0 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            {/* Step 1 Form */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your registered <strong>Username</strong> or <strong>10-digit Mobile Number</strong>. An OTP will be sent to your mobile phone.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiUser className="text-blue-600 text-sm" />
                    <span>Username or Registered Mobile Number <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NIC@PAC001 or 7023158710"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all font-medium"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeForgotPassword}
                    className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingOtp || !forgotIdentifier.trim()}
                    className={`px-5 py-2.5 rounded-xl text-white font-semibold text-xs bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 ${
                      isSendingOtp || !forgotIdentifier.trim()
                        ? "opacity-60 cursor-not-allowed shadow-none"
                        : "cursor-pointer"
                    }`}
                  >
                    {isSendingOtp ? (
                      <>
                        <FiRefreshCw className="animate-spin text-sm" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <FiSmartphone className="text-sm" />
                        <span>Send OTP</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 Form */}
            {forgotStep === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 flex items-center gap-2.5">
                  <FiSmartphone className="text-lg text-blue-600 shrink-0" />
                  <div>
                    <span className="font-bold block">OTP Sent!</span>
                    <span className="text-blue-700 text-[11px]">
                      OTP sent to registered mobile ending with {forgotMaskedPhone}
                    </span>
                  </div>
                </div>

                {/* OTP input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiKey className="text-blue-600 text-sm" />
                    <span>Enter 6-Digit OTP <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all font-mono tracking-widest text-center"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiLock className="text-blue-600 text-sm" />
                    <span>New Password <span className="text-red-500">*</span></span>
                  </label>
                  <div className="relative">
                    <input
                      type={showForgotNewPassword ? "text" : "password"}
                      placeholder="Enter new password (min 6 chars)"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all font-medium"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base transition-colors cursor-pointer"
                    >
                      {showForgotNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiLock className="text-blue-600 text-sm" />
                    <span>Confirm New Password <span className="text-red-500">*</span></span>
                  </label>
                  <div className="relative">
                    <input
                      type={showForgotConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all font-medium"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base transition-colors cursor-pointer"
                    >
                      {showForgotConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {/* Resend OTP bar */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Didn't receive OTP?</span>
                  {resendTimer > 0 ? (
                    <span className="text-blue-600 font-medium">Resend OTP in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Action buttons */}
                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setForgotError("");
                    }}
                    className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isResettingPassword || !forgotOtp.trim() || !forgotNewPassword || !forgotConfirmPassword}
                    className={`px-5 py-2.5 rounded-xl text-white font-semibold text-xs bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 ${
                      isResettingPassword || !forgotOtp.trim() || !forgotNewPassword || !forgotConfirmPassword
                        ? "opacity-60 cursor-not-allowed shadow-none"
                        : "cursor-pointer"
                    }`}
                  >
                    {isResettingPassword ? (
                      <>
                        <FiRefreshCw className="animate-spin text-sm" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="text-sm" />
                        <span>Reset Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success Screen */}
            {forgotStep === 3 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-100">
                  <FiCheckCircle />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Password Reset Successfully!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Your password has been changed. You can now log in using your new credentials.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (forgotIdentifier && !forgotIdentifier.match(/^\d+$/)) {
                      setUserId(forgotIdentifier);
                    }
                    closeForgotPassword();
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;