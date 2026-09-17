import { useState, useEffect, Fragment } from "react";
import SessionTimeout from "../components/SessionTimeout";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal";
import axios from "axios";
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
  FiLayers,
  FiBriefcase,
  FiMapPin,
  FiArrowRight
} from "react-icons/fi";
import { HiBuildingLibrary } from "react-icons/hi2";

import ResubmitModal from "../components/ResubmitModal";

function DashboardPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [resubmitTarget, setResubmitTarget] = useState(null);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);
  const [option, setOption] = useState(() => {
    return localStorage.getItem("employeeOption") || "dashboard";
  });
  const [employee, setEmployee] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("employee"));
    } catch {
      return null;
    }
  });
  const [showPdf, setShowPdf] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");
  const [myProposals, setMyProposals] = useState([]);

  // Inline row expansion for View History
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  function toggleHistory(id) {
    if (expandedHistoryId === id) {
      setExpandedHistoryId(null);
    } else {
      setExpandedHistoryId(id);
    }
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

  const sortedMyProposals = [...myProposals].sort(
    (a, b) => getProposalTimestamp(b) - getProposalTimestamp(a)
  );

  useEffect(() => {
    loadEmployee();
    loadMyProposals();
  }, []);

  useEffect(() => {
    const handleBack = () => {
      const previous = localStorage.getItem("returnOption");
      if (previous) {
        setOption(previous);
        localStorage.setItem("employeeOption", previous);
      }
    };
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  useEffect(() => {
    localStorage.setItem("employeeOption", option);
  }, [option]);

  async function loadEmployee() {
    const id = localStorage.getItem("employeeId");
    if (!id || id === "null") return;

    try {
      const response = await axios.get(
        `http://localhost:8080/api/employees/${id}`
      );
      setEmployee(response.data);
      localStorage.setItem("employee", JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  }

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

  async function handleLogout() {
    try {
      await axios.post(
        "http://localhost:8080/api/employees/logout",
        null,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem("employeeOption");
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  }

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
                <FiFilePlus className="text-xl" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight leading-none text-white">
                  Employee Portal
                </h1>
                <span className="text-[11px] text-blue-200 font-medium">
                  PAC Management
                </span>
              </div>
            </div>

            {/* User Profile Quick Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-xs text-blue-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/30 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-blue-400/30">
                {employee?.name ? employee.name.charAt(0).toUpperCase() : "E"}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-white truncate text-xs">
                  {employee?.name || "Employee"}
                </p>
                <p className="text-[10px] text-blue-200 truncate">
                  {employee?.username || "NIC@PAC"}
                </p>
              </div>
            </div>

            {/* Navigation Options */}
            <nav className="space-y-1.5 text-xs font-semibold">
              <button
                onClick={() => {
                  setOption("dashboard");
                  localStorage.setItem("employeeOption", "dashboard");
                }}
                className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                  option === "dashboard"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <FiGrid className="text-base" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  localStorage.setItem("employeeOption", option);
                  localStorage.setItem("currentPage", "proposal");
                  localStorage.setItem("userType", "employee");
                  navigate("/proposal");
                }}
                className="w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 text-blue-100 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <FiFilePlus className="text-base" />
                <span>Submit Proposal</span>
              </button>

              <button
                onClick={() => {
                  setOption("myProposals");
                  localStorage.setItem("employeeOption", "myProposals");
                  loadMyProposals();
                }}
                className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                  option === "myProposals"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <FiFileText className="text-base" />
                <span>My Proposals</span>
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
                    Welcome back, {employee?.name || "Officer"} 👋
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage your project proposals and track committee evaluation status.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/proposal")}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <FiFilePlus />
                  <span>New Proposal</span>
                </button>
              </div>

              {/* Stat Cards Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500">Total Submitted</span>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg text-sm">
                      <FiFileText />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {myProposals.length}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500">Approved</span>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm">
                      <FiCheckCircle />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {myProposals.filter((p) => p.status === "APPROVED").length}
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
                    {myProposals.filter((p) => p.status === "UNDER_REVIEW").length}
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
                    {myProposals.filter((p) => p.status === "CHANGES_REQUIRED").length}
                  </p>
                </div>
              </div>

              {/* Employee Details Profile Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    <span>Employee Profile Information</span>
                  </h2>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                    {employee?.role?.roleName || "EMPLOYEE"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-xs">
                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Employee ID</span>
                    <span className="font-bold text-slate-800 text-sm">#{employee?.id}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Username</span>
                    <span className="font-bold text-slate-800 text-sm">{employee?.username}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Full Name</span>
                    <span className="font-bold text-slate-800 text-sm">{employee?.name}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Email Address</span>
                    <span className="font-bold text-slate-800 text-sm">{employee?.email}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Contact Number</span>
                    <span className="font-bold text-slate-800 text-sm">{employee?.contactNumber}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Department Name</span>
                    <span className="font-bold text-slate-800 text-sm">{employee?.departmentName}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Designation</span>
                    <span className="font-bold text-slate-800 text-sm">{employee?.designation || "N/A"}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Division</span>
                    <span className="font-bold text-slate-800 text-sm">{employee?.division || "N/A"}</span>
                  </div>

                  <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block">PAC Committee Status</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {employee?.pacCommitteeMember ? "Yes (Member)" : "No (Officer)"}
                    </span>
                  </div>
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
                    Track PAC evaluation progress, remarks, and download approved letters.
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
                                      onClick={() => {
                                        setSelectedPdf(fileName);
                                        setShowPdf(true);
                                      }}
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
                                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                                  >
                                    Resubmit
                                  </button>
                                )}
                                {proposal.status === "UNDER_REVIEW" && (
                                  <span className="text-slate-400 font-medium">Pending PAC</span>
                                )}
                                {proposal.status === "APPROVED" && (
                                  <span className="text-emerald-600 font-bold">Sanctioned</span>
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

      {/* PDF Viewer Modal */}
      {showPdf && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white flex justify-between items-center px-6 py-4">
              <h2 className="text-sm font-bold truncate max-w-md">{selectedPdf}</h2>
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  onClick={async () => {
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
                  }}
                >
                  <FiDownload />
                  <span>Download</span>
                </button>

                <button
                  className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  onClick={() => setShowPdf(false)}
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100">
              <iframe
                src={`http://localhost:8080/uploads/${encodeURIComponent(
                  selectedPdf
                )}#toolbar=0&navpanes=0`}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            </div>
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
          loadMyProposals();
        }}
      />

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

export default DashboardPage;