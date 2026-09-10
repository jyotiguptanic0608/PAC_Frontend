import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLock,
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
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiDownload,
  FiLayers,
  FiTrendingUp,
  FiSearch,
  FiUserCheck,
  FiAward,
  FiBriefcase
} from "react-icons/fi";
import { HiBuildingLibrary } from "react-icons/hi2";
import { FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";

function LandingPage() {
  const navigate = useNavigate();
  const [activeRoleTab, setActiveRoleTab] = useState("employee");
  const [openFaq, setOpenFaq] = useState(null);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("role");

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const getDashboardRoute = () => {
    if (!isLoggedIn) return "/login";
    if (userRole === "ADMIN") return "/admin-Dashboard";
    if (userRole === "PAC_MEMBER") return "/pac-Dashboard";
    if (userRole === "CHAIRMAN") return "/chairman-dashboard";
    return "/dashboard";
  };

  const roleDetails = {
    employee: {
      title: "Employee / Project Officer Portal",
      icon: <FiUser className="text-2xl text-blue-600" />,
      color: "bg-blue-50 border-blue-200 text-blue-900",
      accent: "bg-blue-600",
      description: "Designed for department officers to prepare, validate, and submit project proposals for PAC consideration.",
      features: [
        "Create and draft new project proposals with custom parameters",
        "Upload required supporting documents and cost estimation sheets",
        "Track real-time review progress and committee feedback",
        "Revise proposals promptly upon PAC query or remarks",
        "Download final Chairman-approved sanction letters"
      ],
      route: "/login",
      btnText: "Access Employee Portal"
    },
    pac: {
      title: "PAC Committee Member Portal",
      icon: <FiUsers className="text-2xl text-amber-600" />,
      color: "bg-amber-50 border-amber-200 text-amber-900",
      accent: "bg-amber-600",
      description: "Empowers PAC committee members to evaluate technical specifications, financial estimates, and provide expert review remarks.",
      features: [
        "Access technical proposal documents submitted across departments",
        "Add granular evaluation comments, observations, and scoring",
        "Request clarifications or proposal revisions directly from officers",
        "Vote and recommend proposals for Chairman final decision",
        "View historical review logs and previous meeting agendas"
      ],
      route: "/login",
      btnText: "Access PAC Review Portal"
    },
    chairman: {
      title: "PAC Chairman Decision Portal",
      icon: <FiCheckCircle className="text-2xl text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-200 text-emerald-900",
      accent: "bg-emerald-600",
      description: "High-level executive overview for the PAC Chairman to grant final sanctions, approve proposals, and issue official letters.",
      features: [
        "Review committee recommendations and consolidated member feedback",
        "Grant final executive approval or return proposals with directives",
        "Authorize generation of official PAC sanction letters",
        "Monitor overall meeting agendas, pending queues, and statistics",
        "Digital signature authorization for approved project proposals"
      ],
      route: "/login",
      btnText: "Access Chairman Portal"
    },
    admin: {
      title: "System Administrator Portal",
      icon: <FiShield className="text-2xl text-purple-600" />,
      color: "bg-purple-50 border-purple-200 text-purple-900",
      accent: "bg-purple-600",
      description: "Complete administration suite to manage user accounts, committee rosters, system configurations, and security audit logs.",
      features: [
        "Manage employee, PAC member, and chairman user accounts",
        "Configure meeting schedules, submission deadlines, and master settings",
        "Monitor system audit logs, access security, and session management",
        "Generate overall system analytics and performance reports",
        "Perform force session terminations and account password resets"
      ],
      route: "/login",
      btnText: "Access Admin Portal"
    }
  };

  const faqs = [
    {
      q: "What is the PAC Proposal Management System?",
      a: "The PAC Proposal Management System is a centralized digital governance platform created for submitting, reviewing, tracking, and approving project proposals considered in Project Approval Committee (PAC) meetings."
    },
    {
      q: "How do I submit a new proposal as an employee?",
      a: "First, sign in with your employee credentials or NIC SSO. Navigate to your dashboard, click on 'New Proposal', fill in the project metadata, attach required PDF/DOC documents, and submit it for PAC review."
    },
    {
      q: "Can I revise a proposal after it has been submitted?",
      a: "If PAC Committee Members review your proposal and request modifications, the status will change to 'Revision Requested'. You can then edit the details, upload updated documents, and resubmit."
    },
    {
      q: "How are approved sanction letters issued?",
      a: "Once all PAC Committee Members review and endorse a proposal, the Chairman grants final approval. The system automatically generates a digitally verifiable Approval Letter available for download on the submitter's dashboard."
    },
    {
      q: "Who do I contact if I encounter login or technical issues?",
      a: "For technical assistance or credential support, contact the NIC helpdesk at 0674-2303075 or send an email to pac-support@nic.in."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased">
      {/* 1. Hero Section matching LoginPage style */}
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
            {/* Top Online Portal Tag */}
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <FiShield className="text-blue-400 text-sm" />
              <span>Digital Governance Portal</span>
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
              A modern, paperless platform engineered to streamline proposal submissions, multi-tier committee evaluations, real-time tracking, and automated Chairman approval letters.
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

          {/* Right Column: Portal Access Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl p-7 lg:p-8 shadow-2xl border border-slate-100 text-slate-800 w-full max-w-[420px]">
              {/* Card Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl font-bold border border-blue-100 shadow-2xs">
                  <FiFilePlus />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {isLoggedIn ? "Welcome Back!" : "Portal Access Gateway"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isLoggedIn
                    ? "You are logged in to your account"
                    : "Sign in to access your role-based dashboard"}
                </p>
              </div>

              <div className="space-y-4">
                {/* Primary Action Button */}
                <button
                  onClick={() => navigate(getDashboardRoute())}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <FiLock className="text-base" />
                  <span>{isLoggedIn ? "Go to Dashboard" : "Login to Your Account"}</span>
                  <FiArrowRight className="text-base ml-1" />
                </button>

                {/* Secondary Registration Button */}
                {!isLoggedIn && (
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <FiUser className="text-blue-600 text-sm" />
                    <span>New Employee Registration</span>
                  </button>
                )}

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="shrink mx-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Quick Role Access
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Quick Role Portal Buttons Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => navigate("/login")}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-200 rounded-xl text-left flex items-center gap-2.5 transition-all text-slate-700 hover:text-blue-700 cursor-pointer"
                  >
                    <div className="p-1.5 bg-blue-100/70 text-blue-700 rounded-lg shrink-0">
                      <FiUser />
                    </div>
                    <div>
                      <span className="font-semibold block text-[12px] leading-snug">Employee</span>
                      <span className="text-[10px] text-slate-400 block leading-none">Submit</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="p-2.5 bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-200 rounded-xl text-left flex items-center gap-2.5 transition-all text-slate-700 hover:text-amber-700 cursor-pointer"
                  >
                    <div className="p-1.5 bg-amber-100/70 text-amber-700 rounded-lg shrink-0">
                      <FiUsers />
                    </div>
                    <div>
                      <span className="font-semibold block text-[12px] leading-snug">PAC Member</span>
                      <span className="text-[10px] text-slate-400 block leading-none">Review</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="p-2.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-200 rounded-xl text-left flex items-center gap-2.5 transition-all text-slate-700 hover:text-emerald-700 cursor-pointer"
                  >
                    <div className="p-1.5 bg-emerald-100/70 text-emerald-700 rounded-lg shrink-0">
                      <FiCheckCircle />
                    </div>
                    <div>
                      <span className="font-semibold block text-[12px] leading-snug">Chairman</span>
                      <span className="text-[10px] text-slate-400 block leading-none">Sanction</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="p-2.5 bg-slate-50 hover:bg-purple-50/70 border border-slate-200 hover:border-purple-200 rounded-xl text-left flex items-center gap-2.5 transition-all text-slate-700 hover:text-purple-700 cursor-pointer"
                  >
                    <div className="p-1.5 bg-purple-100/70 text-purple-700 rounded-lg shrink-0">
                      <FiShield />
                    </div>
                    <div>
                      <span className="font-semibold block text-[12px] leading-snug">Admin</span>
                      <span className="text-[10px] text-slate-400 block leading-none">Manage</span>
                    </div>
                  </button>
                </div>

                {/* System Status Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-medium text-slate-700">System Status: Online</span>
                  </div>
                  <span className="text-slate-400">PAC Cycle Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Operational Metrics Bar */}
      <section className="bg-white border-b border-slate-200 py-8 px-6 lg:px-16 shadow-2xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
              <FiTrendingUp className="text-xl" />
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">1,250+</span>
            </div>
            <p className="text-xs font-medium text-slate-500">Proposals Processed</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
              <FiAward className="text-xl" />
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">98.4%</span>
            </div>
            <p className="text-xs font-medium text-slate-500">On-Time Evaluation Rate</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center justify-center gap-2 text-amber-600 mb-1">
              <FiUsers className="text-xl" />
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">45+</span>
            </div>
            <p className="text-xs font-medium text-slate-500">Active Committee Members</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center justify-center gap-2 text-purple-600 mb-1">
              <FiShield className="text-xl" />
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</span>
            </div>
            <p className="text-xs font-medium text-slate-500">Paperless & Audit Ready</p>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section (Exact Match to LoginPage process flow + announcements) */}
      <section className="bg-slate-50/80 py-16 px-6 lg:px-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              A structured 5-step digital workflow from initial project proposal creation to final approval letter issuance.
            </p>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mt-3"></div>
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
                  1. Submit Proposal
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
                  2. PAC Review
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
                  3. Revise & Resubmit
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
                  4. Approve
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
                  5. Approval Letter
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

      {/* 4. Core Platform Capabilities Grid */}
      <section className="bg-white py-16 px-6 lg:px-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Platform Features & Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              Empowering government committees with security, speed, and end-to-end digital auditability.
            </p>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center text-xl font-bold mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FiFilePlus />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Digital Proposal Submission
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Intuitive forms with standardized metadata fields, attachment validation, and instant draft saving for officers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center text-xl font-bold mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <FiUsers />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Multi-Tier Committee Review
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Granular feedback loops allowing committee members to leave line-by-line remarks, scoring, and revision requests.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl font-bold mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FiCheckCircle />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Chairman Sanction Engine
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Executive final authorization screen for the Committee Chairman with automated approval letter PDF generation.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center text-xl font-bold mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FiShield />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Role-Based Access & Security
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Strict permissions mapping for Employees, PAC Members, Chairman, and Admin with CAPTCHA and SSO support.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center text-xl font-bold mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <FiClock />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Complete Audit Trail & Logs
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Full timeline history tracking every proposal revision, remark, timestamp, and user action for complete transparency.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center text-xl font-bold mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FiBell />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Meeting Agendas & Alerts
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Automated reminders for PAC meeting schedules, submission cutoff dates, and pending query resolution updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Role Workflows Interactive Tab Section */}
      <section className="bg-slate-50/80 py-16 px-6 lg:px-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Workflows Tailored for Every Role
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Select a role below to preview specific responsibilities and portal tools.
            </p>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mt-3"></div>
          </div>

          {/* Role Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveRoleTab("employee")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                activeRoleTab === "employee"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <FiUser />
              <span>Employee</span>
            </button>

            <button
              onClick={() => setActiveRoleTab("pac")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                activeRoleTab === "pac"
                  ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <FiUsers />
              <span>PAC Member</span>
            </button>

            <button
              onClick={() => setActiveRoleTab("chairman")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                activeRoleTab === "chairman"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <FiCheckCircle />
              <span>Chairman</span>
            </button>

            <button
              onClick={() => setActiveRoleTab("admin")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                activeRoleTab === "admin"
                  ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <FiShield />
              <span>Administrator</span>
            </button>
          </div>

          {/* Role Active Details Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                  {roleDetails[activeRoleTab].icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {roleDetails[activeRoleTab].title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {roleDetails[activeRoleTab].description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(roleDetails[activeRoleTab].route)}
                className={`px-4 py-2.5 rounded-xl text-white text-xs font-semibold ${roleDetails[activeRoleTab].accent} hover:opacity-90 transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-sm`}
              >
                <span>{roleDetails[activeRoleTab].btnText}</span>
                <FiArrowRight />
              </button>
            </div>

            {/* Checklist of Features */}
            <div className="pt-6">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
                Key Portal Capabilities:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleDetails[activeRoleTab].features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-150 text-slate-700 text-xs"
                  >
                    <FiCheck className="text-emerald-600 text-base shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section className="bg-white py-16 px-6 lg:px-16 border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Find quick answers to common questions regarding PAC proposal submissions and guidelines.
            </p>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mt-3"></div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left flex items-center justify-between text-slate-800 font-semibold text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? (
                    <FiChevronUp className="text-blue-600 text-base shrink-0" />
                  ) : (
                    <FiChevronDown className="text-slate-400 text-base shrink-0" />
                  )}
                </button>

                {openFaq === index && (
                  <div className="px-4 pb-4 pt-1 text-slate-600 text-xs leading-relaxed border-t border-slate-200/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer Section (Exact Copy of LoginPage Footer) */}
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
    </div>
  );
}

export default LandingPage;