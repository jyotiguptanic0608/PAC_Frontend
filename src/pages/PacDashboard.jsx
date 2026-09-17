import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import SessionTimeout from "../components/SessionTimeout";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal";
import ReviewHistoryPage from "./ReviewHistoryPage";
import { useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiFilePlus,
  FiFileText,
  FiLogOut,
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiEye,
  FiDownload,
  FiX,
  FiRefreshCw,
  FiCheckSquare,
  FiSearch,
  FiEdit3,
  FiMessageSquare,
  FiArrowRight,
  FiUserCheck
} from "react-icons/fi";
import { HiBuildingLibrary } from "react-icons/hi2";

import ResubmitModal from "../components/ResubmitModal";

function PacDashboard({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [resubmitTarget, setResubmitTarget] = useState(null);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);

  const [proposals, setProposals] = useState([]);
  const [pacMemberDetails, setPacMemberDetails] = useState(null);
  const [myProposals, setMyProposals] = useState([]);
  const [option, setOption] = useState(() => {
    return localStorage.getItem("pacOption") || "dashboard";
  });

  // Inline row expansion for View History
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  function toggleHistory(id) {
    if (expandedHistoryId === id) {
      setExpandedHistoryId(null);
    } else {
      setExpandedHistoryId(id);
    }
  }

  // Search and Filter states for review proposals
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal states
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [selectedProposalId, setSelectedProposalId] = useState(null);

  const [showPdf, setShowPdf] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");

  const [showApproveBox, setShowApproveBox] = useState(false);
  const [approveProposalId, setApproveProposalId] = useState(null);
  const [showApproveSuccess, setShowApproveSuccess] = useState(false);

  useEffect(() => {
    setOption(localStorage.getItem("pacOption") || "dashboard");
  }, []);

  useEffect(() => {
    localStorage.setItem("pacOption", option);
  }, [option]);

  useEffect(() => {
    loadPacMemberDetails();
    fetchProposals();
    loadMyProposals();
  }, []);

  async function loadMyProposals() {
    try {
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId || employeeId === "null") return;

      const response = await axios.get(
        `http://localhost:8080/api/proposals/employee/${employeeId}`
      );
      setMyProposals(response.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadPacMemberDetails() {
    try {
      const id = localStorage.getItem("employeeId");
      if (!id || id === "null") return;

      const response = await axios.get(
        `http://localhost:8080/api/employees/${id}`
      );
      setPacMemberDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProposals() {
    try {
      const response = await axios.get("http://localhost:8080/api/proposals");
      setProposals(response.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function reviewProposal() {
    if (reviewText.trim() === "") {
      alert("Please enter review remarks.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/proposals/${selectedProposalId}/review`,
        {
          review: reviewText,
          reviewerId: Number(localStorage.getItem("employeeId"))
        }
      );

      fetchProposals();
      loadMyProposals();

      setShowReviewBox(false);
      setReviewText("");
      setSelectedProposalId(null);
    } catch (error) {
      console.log(error);
      alert("Failed to submit review.");
    }
  }

  async function approveProposal() {
    try {
      await axios.put(
        `http://localhost:8080/api/proposals/${approveProposalId}/approve`
      );

      fetchProposals();
      loadMyProposals();

      setShowApproveBox(false);
      setApproveProposalId(null);
      setShowApproveSuccess(true);
    } catch (error) {
      console.log(error);
      alert("Failed to approve proposal.");
    }
  }

  function openPdf(fileName) {
    setSelectedPdf(fileName);
    setShowPdf(true);
  }

  async function logout() {
    try {
      await axios.post(
        "http://localhost:8080/api/employees/logout",
        null,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem("pacOption");
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  }

  function getProposalTimestamp(p) {
    if (p.revisions && p.revisions.length > 0) {
      const lastRev = p.revisions[p.revisions.length - 1];
      if (lastRev.submissionDate) return new Date(lastRev.submissionDate).getTime();
    }
    if (p.latestSubmissionDate) return new Date(p.latestSubmissionDate).getTime();
    if (p.date) return new Date(p.date).getTime();
    return p.id || 0;
  }

  function formatDateTime(dateStr) {
    if (!dateStr) return "N/A";
    try {
      if (dateStr.includes("T")) {
        return new Date(dateStr).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short"
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }

  // Filtered and sorted proposals for Review Tab (latest first)
  const filteredProposals = proposals
    .filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.employeeName && p.employeeName.toLowerCase().includes(query)) ||
        (p.departmentName && p.departmentName.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "ALL" || p.status === statusFilter;

      return matchesQuery && matchesStatus;
    })
    .sort((a, b) => getProposalTimestamp(b) - getProposalTimestamp(a));

  const sortedMyProposals = [...myProposals].sort(
    (a, b) => getProposalTimestamp(b) - getProposalTimestamp(a)
  );

  return (
    <>
      <SessionTimeout setIsLoggedIn={setIsLoggedIn} />

      <div className="flex min-h-screen bg-slate-100 font-sans antialiased">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-[#021b3e] via-[#022859] to-[#043e85] text-white p-6 flex flex-col justify-between shrink-0 shadow-xl">
          <div className="space-y-6">
            {/* Header / Portal Title */}
            <div className="flex items-center gap-3 pb-6 border-b border-white/15">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 text-blue-300">
                <FiUserCheck className="text-xl" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight leading-none text-white">
                  PAC Member Panel
                </h1>
                <span className="text-[11px] text-blue-200 font-medium">
                  Review & Management
                </span>
              </div>
            </div>

            {/* User Profile Quick Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-xs text-blue-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/30 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-blue-400/30">
                {pacMemberDetails?.name ? pacMemberDetails.name.charAt(0).toUpperCase() : "P"}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-white truncate text-xs">
                  {pacMemberDetails?.name || "PAC Member"}
                </p>
                <p className="text-[10px] text-blue-200 truncate">
                  {pacMemberDetails?.username || "NIC@PAC"}
                </p>
              </div>
            </div>

            {/* Navigation Options */}
            <nav className="space-y-1.5 text-xs font-semibold">
              <button
                onClick={() => {
                  localStorage.removeItem("returnOption");
                  localStorage.removeItem("resubmitProposal");
                  setShowPdf(false);
                  setShowReviewBox(false);
                  setShowApproveBox(false);
                  setOption("dashboard");
                }}
                className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                  option === "dashboard"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <FiGrid className="text-base" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("resubmitProposal");
                  localStorage.setItem("userType", "pac");
                  navigate("/proposal");
                }}
                className="w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 text-blue-100 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <FiFilePlus className="text-base" />
                <span>Submit Proposal</span>
              </button>

              <button
                onClick={async () => {
                  await loadMyProposals();
                  setOption("myProposals");
                }}
                className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                  option === "myProposals"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <FiFileText className="text-base" />
                <span>My Proposals</span>
              </button>

              <button
                onClick={async () => {
                  await fetchProposals();
                  setOption("review");
                }}
                className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                  option === "review"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <FiCheckSquare className="text-base" />
                <span>Review Proposals</span>
              </button>
            </nav>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white border border-red-400/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer mt-6"
          >
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
          {/* Dashboard View */}
          {option === "dashboard" && (
            <div className="space-y-8 w-full">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome, {pacMemberDetails?.name || "PAC Member"} 👋
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Review submitted proposals, inspect PDF documentation, and manage committee evaluation.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      await fetchProposals();
                      setOption("review");
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
                  >
                    <FiCheckSquare />
                    <span>Review Proposals</span>
                  </button>
                </div>
              </div>

              {/* Stat Cards Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500">Total Proposals</span>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg text-sm">
                      <FiFileText />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {proposals.length}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500">Under Review</span>
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg text-sm">
                      <FiClock />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {proposals.filter((p) => p.status === "UNDER_REVIEW").length}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500">Approved Proposals</span>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm">
                      <FiCheckCircle />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {proposals.filter((p) => p.status === "APPROVED").length}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500">Revisions Requested</span>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg text-sm">
                      <FiRefreshCw />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {proposals.filter((p) => p.status === "CHANGES_REQUIRED").length}
                  </p>
                </div>
              </div>

              {/* PAC Member Details Profile Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    <span>PAC Member Profile Information</span>
                  </h2>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                    {pacMemberDetails?.role?.roleName || "PAC_MEMBER"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-xs">
                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Employee ID</span>
                    <span className="font-bold text-slate-800 text-sm">#{pacMemberDetails?.id}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Username</span>
                    <span className="font-bold text-slate-800 text-sm">{pacMemberDetails?.username}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Full Name</span>
                    <span className="font-bold text-slate-800 text-sm">{pacMemberDetails?.name}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Email Address</span>
                    <span className="font-bold text-slate-800 text-sm">{pacMemberDetails?.email}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Contact Number</span>
                    <span className="font-bold text-slate-800 text-sm">{pacMemberDetails?.contactNumber}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Department Name</span>
                    <span className="font-bold text-slate-800 text-sm">{pacMemberDetails?.departmentName}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Designation</span>
                    <span className="font-bold text-slate-800 text-sm">{pacMemberDetails?.designation || "N/A"}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">PAC Committee Status</span>
                    <span className="font-bold text-emerald-700 text-sm flex items-center gap-1">
                      <FiCheckCircle className="text-emerald-600" />
                      <span>Designated Reviewer</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Review Proposals View */}
          {option === "review" && (
            <div className="space-y-6 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Review Project Proposals
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Evaluate proposal submissions, inspect attachments, provide remarks, or grant approval.
                  </p>
                </div>

                <button
                  onClick={fetchProposals}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs hover:bg-slate-50 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FiRefreshCw />
                  <span>Refresh Proposals</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search by title, applicant name, department..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="CHANGES_REQUIRED">Changes Required</option>
                    <option value="APPROVED">Approved</option>
                  </select>
                </div>
              </div>

              {/* Table Container */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">Applicant</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Proposal Title</th>
                        <th className="p-4">Submission / Revision Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Review History</th>
                        <th className="p-4">Documents</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProposals.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                            No proposals found matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredProposals.map((proposal) => (
                          <Fragment key={proposal.id}>
                            <tr className={`hover:bg-slate-50/70 transition-colors ${expandedHistoryId === proposal.id ? 'bg-blue-50/40 font-medium' : ''}`}>
                              <td className="p-4 font-bold text-slate-900">
                                {proposal.employeeName || "N/A"}
                              </td>

                              <td className="p-4 text-slate-600 font-medium">
                                {proposal.departmentName}
                              </td>

                              <td className="p-4 font-semibold text-slate-900 max-w-xs">
                                {proposal.title}
                              </td>

                              <td className="p-4 text-slate-700 font-semibold whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <FiClock className="text-slate-400 shrink-0" />
                                  <span>{formatDateTime(proposal.latestSubmissionDate || proposal.date)}</span>
                                </div>
                              </td>

                              <td className="p-4">
                                {proposal.status === "APPROVED" && (
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                    <FiCheckCircle /> Approved
                                  </span>
                                )}
                                {proposal.status === "CHANGES_REQUIRED" && (
                                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                    <FiRefreshCw /> Revision Needed
                                  </span>
                                )}
                                {proposal.status === "UNDER_REVIEW" && (
                                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                    <FiClock /> Under Review
                                  </span>
                                )}
                              </td>

                              <td className="p-4">
                                <button
                                  onClick={() => toggleHistory(proposal.id)}
                                  className={`px-3 py-1.5 font-semibold rounded-lg text-xs border transition-all cursor-pointer ${
                                    expandedHistoryId === proposal.id
                                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                      : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                                  }`}
                                >
                                  {expandedHistoryId === proposal.id ? "Hide History" : "View History"}
                                </button>
                              </td>

                              <td className="p-4">
                                {proposal.file.split(",").map((fileName, index) => (
                                  <div key={index} className="my-1">
                                    <button
                                      onClick={() => openPdf(fileName)}
                                      className="text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1 cursor-pointer"
                                    >
                                      <FiEye className="text-xs" />
                                      <span className="truncate max-w-[140px]">{fileName}</span>
                                    </button>
                                  </div>
                                ))}
                              </td>

                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    disabled={proposal.status === "APPROVED"}
                                    onClick={() => {
                                      if (proposal.status === "APPROVED") return;
                                      setSelectedProposalId(proposal.id);
                                      setReviewText("");
                                      setShowReviewBox(true);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                      proposal.status === "APPROVED"
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                        : "bg-amber-500 hover:bg-amber-600 text-white shadow-xs cursor-pointer"
                                    }`}
                                  >
                                    <FiEdit3 className="text-xs" />
                                    <span>Add Remarks</span>
                                  </button>

                                  <button
                                    disabled={proposal.status === "APPROVED"}
                                    onClick={() => {
                                      if (proposal.status === "APPROVED") return;
                                      setApproveProposalId(proposal.id);
                                      setShowApproveBox(true);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                      proposal.status === "APPROVED"
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default"
                                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                                    }`}
                                  >
                                    <FiCheckCircle className="text-xs" />
                                    <span>{proposal.status === "APPROVED" ? "Approved" : "Approve"}</span>
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Inline History Details Accordion Row */}
                            {expandedHistoryId === proposal.id && (
                              <tr>
                                <td colSpan={8} className="p-4 bg-slate-50/90 border-b border-slate-200">
                                  <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6 space-y-4 animate-in fade-in duration-200">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                      <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                        <FiClock className="text-blue-600 text-sm" />
                                        <span>Proposal Evaluation History & Metadata (#{proposal.id})</span>
                                      </h3>
                                      <button
                                        onClick={() => setExpandedHistoryId(null)}
                                        className="text-xs text-slate-400 hover:text-slate-600 font-semibold px-2 py-1 rounded-md hover:bg-slate-100 cursor-pointer"
                                      >
                                        Hide Details ✕
                                      </button>
                                    </div>
                                    <ReviewHistoryPage proposalId={proposal.id} inline={true} />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* My Proposals Option */}
          {option === "myProposals" && (
            <div className="space-y-6 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    My Submitted Proposals
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Track evaluation status and revisions for proposals submitted by you.
                  </p>
                </div>

                <button
                  onClick={loadMyProposals}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs hover:bg-slate-50 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FiRefreshCw />
                  <span>Refresh List</span>
                </button>
              </div>

              {/* Table Container */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">Proposal Title</th>
                        <th className="p-4">Submission / Revision Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Review History</th>
                        <th className="p-4">Uploaded PDF Files</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedMyProposals.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                            No proposals submitted yet. Click "Submit Proposal" to create one.
                          </td>
                        </tr>
                      ) : (
                        sortedMyProposals.map((proposal) => (
                          <Fragment key={proposal.id}>
                            <tr className={`hover:bg-slate-50/70 transition-colors ${expandedHistoryId === proposal.id ? 'bg-blue-50/40 font-medium' : ''}`}>
                              <td className="p-4 font-semibold text-slate-900 max-w-xs">
                                {proposal.title}
                              </td>

                              <td className="p-4 text-slate-700 font-semibold whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <FiClock className="text-slate-400 shrink-0" />
                                  <span>{formatDateTime(proposal.latestSubmissionDate || proposal.date)}</span>
                                </div>
                              </td>

                              <td className="p-4">
                                {proposal.status === "APPROVED" && (
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                    <FiCheckCircle /> Approved
                                  </span>
                                )}
                                {proposal.status === "CHANGES_REQUIRED" && (
                                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                    <FiRefreshCw /> Revision Needed
                                  </span>
                                )}
                                {proposal.status === "UNDER_REVIEW" && (
                                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                                    <FiClock /> Under Review
                                  </span>
                                )}
                              </td>

                              <td className="p-4">
                                <button
                                  onClick={() => toggleHistory(proposal.id)}
                                  className={`px-3 py-1.5 font-semibold rounded-lg text-xs border transition-all cursor-pointer ${
                                    expandedHistoryId === proposal.id
                                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                      : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                                  }`}
                                >
                                  {expandedHistoryId === proposal.id ? "Hide History" : "View History"}
                                </button>
                              </td>

                              <td className="p-4">
                                {proposal.file.split(",").map((fileName, index) => (
                                  <div key={index} className="my-1">
                                    <button
                                      onClick={() => openPdf(fileName)}
                                      className="text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1 cursor-pointer"
                                    >
                                      <FiEye className="text-xs" />
                                      <span className="truncate max-w-[150px]">{fileName}</span>
                                    </button>
                                  </div>
                                ))}
                              </td>

                              <td className="p-4 text-center">
                                {proposal.status === "CHANGES_REQUIRED" && (
                                  <button
                                    onClick={() => {
                                      setResubmitTarget(proposal);
                                      setIsResubmitOpen(true);
                                    }}
                                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                                  >
                                    <FiRefreshCw className="text-xs" />
                                    <span>Resubmit</span>
                                  </button>
                                )}

                                {proposal.status === "UNDER_REVIEW" && (
                                  <span className="text-slate-400 font-medium text-xs">
                                    Pending Review
                                  </span>
                                )}

                                {proposal.status === "APPROVED" && (
                                  <span className="text-emerald-600 font-bold text-xs inline-flex items-center gap-1">
                                    <FiCheckCircle /> Approved
                                  </span>
                                )}
                              </td>
                            </tr>

                            {/* Inline History Details Accordion Row */}
                            {expandedHistoryId === proposal.id && (
                              <tr>
                                <td colSpan={6} className="p-4 bg-slate-50/90 border-b border-slate-200">
                                  <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6 space-y-4 animate-in fade-in duration-200">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                      <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                        <FiClock className="text-blue-600 text-sm" />
                                        <span>Proposal Evaluation History & Metadata (#{proposal.id})</span>
                                      </h3>
                                      <button
                                        onClick={() => setExpandedHistoryId(null)}
                                        className="text-xs text-slate-400 hover:text-slate-600 font-semibold px-2 py-1 rounded-md hover:bg-slate-100 cursor-pointer"
                                      >
                                        Hide Details ✕
                                      </button>
                                    </div>
                                    <ReviewHistoryPage proposalId={proposal.id} inline={true} />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Review History View */}
          {option === "reviewHistory" && (
            <ReviewHistoryPage
              proposalId={Number(localStorage.getItem("selectedProposalId"))}
            />
          )}
        </main>
      </div>

      {/* Add Remarks Modal */}
      {showReviewBox && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FiMessageSquare className="text-blue-600" />
                <span>Add Review Remarks</span>
              </h2>
              <button
                onClick={() => {
                  setShowReviewBox(false);
                  setReviewText("");
                  setSelectedProposalId(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-normal h-40"
              placeholder="Enter detailed evaluation feedback or required revisions..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
                onClick={() => {
                  setShowReviewBox(false);
                  setReviewText("");
                  setSelectedProposalId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-2"
                onClick={reviewProposal}
              >
                <FiCheckCircle />
                <span>Submit Remarks</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showPdf && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex justify-center items-center z-50 p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-slate-900 text-white flex justify-between items-center px-6 py-4">
              <h2 className="text-sm font-bold truncate max-w-xl flex items-center gap-2">
                <FiFileText className="text-blue-400" />
                <span>{selectedPdf}</span>
              </h2>
              <div className="flex items-center gap-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  onClick={async () => {
                    try {
                      const response = await axios.get(
                        `http://localhost:8080/uploads/${selectedPdf}`,
                        { responseType: "blob" }
                      );
                      const url = window.URL.createObjectURL(response.data);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = selectedPdf;
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      console.error("Failed to download PDF", err);
                    }
                  }}
                >
                  <FiDownload />
                  <span>Download</span>
                </button>
                <button
                  className="bg-white/10 hover:bg-white/20 text-white w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  onClick={() => {
                    setShowPdf(false);
                    setSelectedPdf("");
                  }}
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-200">
              <iframe
                src={`http://localhost:8080/uploads/${encodeURIComponent(selectedPdf)}#toolbar=0&navpanes=0`}
                className="w-full h-full"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveBox && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-6 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              <FiCheckCircle />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">
                Approve Project Proposal?
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to approve this proposal? This status update will be visible to the submitting officer and committee members.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer flex-1"
                onClick={() => {
                  setShowApproveBox(false);
                  setApproveProposalId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex-1"
                onClick={approveProposal}
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Success Modal */}
      {showApproveSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              <FiCheckCircle />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">
                Approved Successfully
              </h2>
              <p className="text-xs text-slate-500">
                The proposal status has been updated to Approved.
              </p>
            </div>
            <button
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              onClick={() => setShowApproveSuccess(false)}
            >
              OK, Got it
            </button>
          </div>
        </div>
      )}

      <ResubmitModal
        proposal={resubmitTarget}
        isOpen={isResubmitOpen}
        onClose={() => {
          setIsResubmitOpen(false);
          setResubmitTarget(null);
        }}
        onSuccess={() => {
          fetchMyProposals();
          fetchProposals();
        }}
      />

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
      />
    </>
  );
}

export default PacDashboard;