import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SessionTimeout from "../components/SessionTimeout";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal";
import ReviewHistoryPage from "./ReviewHistoryPage";
import {
  FiGrid,
  FiFileText,
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiBarChart2,
  FiActivity,
  FiBell,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiCheckCircle,
  FiChevronDown,
  FiMenu,
  FiUser,
  FiInfo,
  FiCheckSquare,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiX,
  FiFilter
} from "react-icons/fi";

function AdminDashboard({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Active option/tab in Admin panel (defaults to pacTeam as per user design)
  const [option, setOption] = useState(() => {
    return localStorage.getItem("adminOption") || "pacTeam";
  });

  const [activeSubTab, setActiveSubTab] = useState("members"); // "members" | "chairman"
  const [employees, setEmployees] = useState([]);
  const [pacMembers, setPacMembers] = useState([]);
  const [proposals, setProposals] = useState([]);
  
  // Search & Filter States
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  // Chairman States
  const [selectedChairman, setSelectedChairman] = useState(null);
  const [showChairmanModal, setShowChairmanModal] = useState(false);
  const [showChairmanConfirm, setShowChairmanConfirm] = useState(false);
  const [showRemoveChairman, setShowRemoveChairman] = useState(false);
  const [chairmanIdToRemove, setChairmanIdToRemove] = useState(null);

  // PDF Viewer
  const [showPdf, setShowPdf] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");

  const username = localStorage.getItem("username") || "Admin";

  useEffect(() => {
    loadEmployees();
    loadPacMembers();
    loadProposals();
  }, []);

  useEffect(() => {
    localStorage.setItem("adminOption", option);
  }, [option]);

  useEffect(() => {
    const handleBack = () => {
      const previous = localStorage.getItem("returnOption");
      if (previous) {
        setOption(previous);
        localStorage.setItem("adminOption", previous);
      }
    };
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  async function loadEmployees() {
    try {
      const response = await axios.get("http://localhost:8080/api/employees");
      setEmployees(response.data);
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
  }

  async function loadPacMembers() {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/pac-members");
      setPacMembers(response.data);
      setSelectedMembers(response.data.map((member) => member.employee.id));
    } catch (err) {
      console.error("Failed to load PAC members:", err);
    }
  }

  async function loadProposals() {
    try {
      const response = await axios.get("http://localhost:8080/api/proposals");
      setProposals(response.data);
    } catch (err) {
      console.error("Failed to load proposals:", err);
    }
  }

  async function makeChairman(id) {
    try {
      await axios.put(`http://localhost:8080/api/admin/chairman/${id}`);
      await loadEmployees();
      await loadPacMembers();
    } catch (err) {
      console.error("Failed to set chairman:", err);
    }
  }

  async function submitPacMembers() {
    try {
      await axios.post("http://localhost:8080/api/admin/pac-members", selectedMembers);
      await loadEmployees();
      await loadPacMembers();
    } catch (error) {
      console.log(error);
      alert("Failed to update PAC Members.");
    }
  }

  async function removePacMember(id) {
    try {
      await axios.put(`http://localhost:8080/api/admin/remove-pac/${id}`);
      await loadEmployees();
      await loadPacMembers();
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  }

  async function handleLogout() {
    try {
      await axios.post("http://localhost:8080/api/employees/logout", null, {
        withCredentials: true
      });
    } catch (error) {
      console.log(error);
    }
    localStorage.removeItem("adminOption");
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  }

  function openPdf(fileName) {
    setSelectedPdf(fileName);
    setShowPdf(true);
  }

  function togglePac(id) {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter((x) => x !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  }

  const chairman = employees.find((employee) => employee.chairman);

  // Filtered PAC Members list
  const filteredPacMembers = pacMembers.filter((member) => {
    const emp = member.employee || {};
    const matchesSearch =
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      String(emp.id).includes(search);
    const matchesDept =
      departmentFilter === "All" || emp.departmentName === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredPacMembers.length / rowsPerPage) || 1;
  const currentPacMembers = filteredPacMembers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Non-PAC employees available to add
  const nonPacEmployees = employees.filter((emp) => !emp.pacCommitteeMember && emp.role?.roleName !== "ADMIN");

  return (
    <>
      <SessionTimeout setIsLoggedIn={setIsLoggedIn} />

      <div className="flex h-screen bg-slate-100 font-sans text-slate-800 antialiased overflow-hidden">
        {/* Left Dark Sidebar */}
        <aside className="w-64 bg-[#081730] text-slate-300 flex flex-col shrink-0 z-20">
          {/* Top Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
            <div className="bg-blue-600 text-white font-extrabold text-xs px-2 py-1 rounded tracking-wider">
              NIC
            </div>
            <span className="font-extrabold text-white text-sm tracking-wider uppercase">
              ODISHA
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 text-xs font-medium">
            <button
              onClick={() => setOption("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                option === "dashboard"
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <FiGrid className="text-base" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setOption("proposals")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                option === "proposals"
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <FiFileText className="text-base" />
              <span>Proposals</span>
            </button>

            <button
              onClick={() => setOption("meetings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                option === "meetings"
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <FiCalendar className="text-base" />
              <span>PAC Meetings</span>
            </button>

            {/* Renamed to PAC Team as requested by user */}
            <button
              onClick={() => {
                setOption("pacTeam");
                loadPacMembers();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                option === "pacTeam"
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <FiUsers className="text-base" />
              <span>PAC Team</span>
            </button>

            <button
              onClick={() => setOption("employees")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                option === "employees"
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <FiUserCheck className="text-base" />
              <span>Employees</span>
            </button>

            <button
              onClick={() => setOption("approvalLetters")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                option === "approvalLetters"
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <FiCheckSquare className="text-base" />
              <span>Approval Letters</span>
            </button>

            <button
              onClick={() => setOption("reports")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                option === "reports"
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <FiBarChart2 className="text-base" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setOption("auditTrail")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                option === "auditTrail"
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <FiActivity className="text-base" />
              <span>Audit Trail</span>
            </button>

            <button
              onClick={() => setOption("notifications")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                option === "notifications"
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <FiBell className="text-base" />
                <span>Notifications</span>
              </div>
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                8
              </span>
            </button>

            <button
              onClick={() => setOption("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                option === "settings"
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <FiSettings className="text-base" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Logout at bottom */}
          <div className="p-3 border-t border-slate-800/80">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
            >
              <FiLogOut className="text-base" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar Header */}
          <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-4">
              <button className="text-slate-500 hover:text-slate-700 text-lg cursor-pointer">
                <FiMenu />
              </button>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                PAC Proposal Management System
              </h2>
            </div>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-5">
              <div className="relative cursor-pointer text-slate-500 hover:text-slate-700">
                <FiBell className="text-lg" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  5
                </span>
              </div>

              {/* User Avatar Pill */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-slate-800">
                    {username}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Admin
                  </span>
                </div>
                <FiChevronDown className="text-slate-400 text-xs" />
              </div>
            </div>
          </header>

          {/* Scrollable View Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
            {/* OPTION: PAC TEAM (MAIN MATCHED VIEW FROM SCREENSHOT) */}
            {option === "pacTeam" && (
              <div className="w-full space-y-6">
                {/* Header Title & Breadcrumb */}
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    PAC Team Management
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                    <span>Home</span>
                    <span>&rsaquo;</span>
                    <span>PAC Team</span>
                    <span>&rsaquo;</span>
                    <span className="text-blue-600">Manage Team</span>
                  </p>
                </div>

                {/* Secondary Sub-Tabs: PAC Members | Chairman */}
                <div className="border-b border-slate-200 flex gap-6 text-sm font-semibold">
                  <button
                    onClick={() => setActiveSubTab("members")}
                    className={`pb-3 transition-all cursor-pointer ${
                      activeSubTab === "members"
                        ? "text-blue-600 border-b-2 border-blue-600 font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    PAC Members
                  </button>
                  <button
                    onClick={() => setActiveSubTab("chairman")}
                    className={`pb-3 transition-all cursor-pointer ${
                      activeSubTab === "chairman"
                        ? "text-blue-600 border-b-2 border-blue-600 font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Chairman
                  </button>
                </div>

                {/* 4 Summary Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1 */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Total PAC Members
                      </p>
                      <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                        {pacMembers.length}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Active members
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
                      <FiUsers />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Active Members
                      </p>
                      <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
                        {pacMembers.length}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Currently active
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                      <FiCheckCircle />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Chairman
                      </p>
                      <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
                        {chairman ? "1" : "0"}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Only one chairman
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
                      <FiUserCheck />
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Last Updated
                      </p>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        10 May 2024
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        By {username}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
                      <FiCalendar />
                    </div>
                  </div>
                </div>

                {/* Main 2-Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column (8/9 Cols): PAC Team Members Table Card */}
                  <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                    {/* Top Controls */}
                    <div className="p-5 border-b border-slate-100 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h3 className="text-base font-bold text-slate-900">
                          PAC Team Members
                        </h3>

                        {/* Add Member Button */}
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                        >
                          <FiPlus className="text-sm" />
                          <span>Add Member</span>
                        </button>
                      </div>

                      {/* Filter Inputs Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                        {/* Search Input */}
                        <div className="sm:col-span-6 relative">
                          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                          <input
                            type="text"
                            placeholder="Search by name, employee ID or email..."
                            value={search}
                            onChange={(e) => {
                              setSearch(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                          />
                        </div>

                        {/* Department Filter */}
                        <div className="sm:col-span-3">
                          <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                          >
                            <option value="All">All Departments</option>
                            <option value="ICT Services">ICT Services</option>
                            <option value="Application Services">Application Services</option>
                            <option value="Infrastructure Services">Infrastructure Services</option>
                            <option value="Finance & Accounts">Finance & Accounts</option>
                            <option value="Systems Management">Systems Management</option>
                          </select>
                        </div>

                        {/* Status Filter */}
                        <div className="sm:col-span-3">
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                          >
                            <option value="All">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                            <th className="py-3 px-4 w-10">#</th>
                            <th className="py-3 px-4">Employee Details</th>
                            <th className="py-3 px-4">Department</th>
                            <th className="py-3 px-4">Designation</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentPacMembers.length > 0 ? (
                            currentPacMembers.map((member, index) => {
                              const emp = member.employee || {};
                              const itemIndex = (currentPage - 1) * rowsPerPage + index + 1;
                              return (
                                <tr
                                  key={member.id || emp.id}
                                  className="hover:bg-slate-50/80 transition-colors"
                                >
                                  <td className="py-3.5 px-4 font-bold text-slate-400">
                                    {itemIndex}
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-3">
                                      {/* Initials Avatar Placeholder (No photo as requested) */}
                                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                                        {emp.name
                                          ? emp.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                              .substring(0, 2)
                                              .toUpperCase()
                                          : "EMP"}
                                      </div>
                                      <div>
                                        <p className="font-bold text-slate-900 text-xs">
                                          {emp.name || "PAC Member"}
                                        </p>
                                        <p className="text-[11px] text-slate-400 font-normal">
                                          EMP{emp.id || "100"} | {emp.email || "user@nic.in"}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                                    {emp.departmentName || "ICT Services"}
                                  </td>
                                  <td className="py-3.5 px-4 text-slate-700">
                                    {emp.designation || "Scientist 'E'"}
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-200">
                                      PAC Member
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                                      Active
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        onClick={() =>
                                          alert(`Editing details for ${emp.name}`)
                                        }
                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                        title="Edit Member"
                                      >
                                        <FiEdit3 className="text-sm" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setRemoveId(emp.id);
                                          setShowRemove(true);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                        title="Remove Member"
                                      >
                                        <FiTrash2 className="text-sm" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td
                                colSpan="7"
                                className="py-8 text-center text-slate-400 text-xs"
                              >
                                No PAC members found matching your search.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Table Footer Pagination */}
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Showing {filteredPacMembers.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{" "}
                        {Math.min(currentPage * rowsPerPage, filteredPacMembers.length)} of{" "}
                        {filteredPacMembers.length} entries
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <FiChevronLeft className="text-sm" />
                        </button>
                        <span className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-xs">
                          {currentPage}
                        </span>
                        <button
                          disabled={currentPage >= totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <FiChevronRight className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (4/3 Cols): PAC Chairman Card */}
                  <div className="lg:col-span-4 xl:col-span-3 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
                      {/* Top Header Badge */}
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2">
                        <span>👑</span>
                        <span>Current Chairman</span>
                      </div>

                      {/* Chairman Details */}
                      {chairman ? (
                        <div className="text-center space-y-3">
                          {/* Initials Placeholder */}
                          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xl flex items-center justify-center mx-auto border-2 border-amber-300 shadow-sm">
                            {chairman.name
                              ? chairman.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .substring(0, 2)
                                  .toUpperCase()
                              : "CH"}
                          </div>

                          <div>
                            <h4 className="text-base font-bold text-slate-900">
                              {chairman.name}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium">
                              EMP{chairman.id || "10005"}
                            </p>
                          </div>

                          <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                            <p className="font-semibold text-slate-800">
                              {chairman.designation || "Director General & State Coordinator"}
                            </p>
                            <p className="text-blue-600">{chairman.email || "dg@nic.in"}</p>
                            <p className="text-slate-500 pt-1">
                              <strong className="text-slate-700">Department:</strong>{" "}
                              {chairman.departmentName || "State Centre"}
                            </p>
                            <p className="text-slate-500">
                              <strong className="text-slate-700">Phone:</strong>{" "}
                              {chairman.contactNumber || "0674-2303075"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 space-y-2">
                          <p className="text-sm font-semibold text-slate-600">
                            No Chairman Currently Assigned
                          </p>
                          <p className="text-xs text-slate-400">
                            Assign a Chairman from your PAC Members list.
                          </p>
                        </div>
                      )}

                      {/* Action Button: Change Chairman */}
                      <button
                        onClick={() => setShowChairmanModal(true)}
                        className="w-full py-2.5 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <FiUserCheck className="text-blue-600 text-sm" />
                        <span>Change Chairman</span>
                      </button>

                      {/* Information Note Box */}
                      <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 text-xs text-slate-600 space-y-1">
                        <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                          <FiInfo className="text-blue-600 text-sm" />
                          <span>Note</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-500">
                          There can only be one PAC Chairman at a time. Changing the chairman will remove the role from the previous chairman.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OTHER DASHBOARD OPTIONS (Retained for completeness) */}
            {option === "dashboard" && (
              <div className="space-y-6 w-full">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Dashboard Overview
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <p className="text-xs font-semibold text-slate-500">Total Employees</p>
                    <h3 className="text-3xl font-extrabold text-blue-900 mt-2">{employees.length}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <p className="text-xs font-semibold text-slate-500">PAC Members</p>
                    <h3 className="text-3xl font-extrabold text-blue-900 mt-2">{pacMembers.length}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <p className="text-xs font-semibold text-slate-500">Chairman</p>
                    <h3 className="text-xl font-bold text-amber-600 mt-2">{chairman ? chairman.name : "Not Assigned"}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <p className="text-xs font-semibold text-slate-500">Total Proposals</p>
                    <h3 className="text-3xl font-extrabold text-blue-900 mt-2">{proposals.length}</h3>
                  </div>
                </div>
              </div>
            )}

            {option === "proposals" && (
              <div className="space-y-6 w-full">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Proposals</h1>
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Coordinator</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {proposals.map((proposal) => (
                        <tr key={proposal.id} className="hover:bg-slate-50">
                          <td className="p-4 font-semibold">{proposal.employeeName}</td>
                          <td className="p-4">{proposal.title}</td>
                          <td className="p-4">{proposal.departmentName}</td>
                          <td className="p-4">{proposal.projectCoordinator}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                              {proposal.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                localStorage.setItem("returnOption", option);
                                localStorage.setItem("selectedProposalId", proposal.id);
                                localStorage.setItem("adminOption", "reviewHistory");
                                setOption("reviewHistory");
                              }}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {option === "reviewHistory" && (
              <ReviewHistoryPage proposalId={Number(localStorage.getItem("selectedProposalId"))} />
            )}
          </main>

          {/* Footer */}
          <footer className="h-10 bg-white border-t border-slate-200/80 px-6 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <span>&copy; 2026 NIC Odisha. All rights reserved.</span>
            <span>Version 1.0.0</span>
          </footer>
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add PAC Team Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select employees to add to the PAC Team:
            </p>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl p-2">
              {nonPacEmployees.map((emp) => (
                <label key={emp.id} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-bold text-xs text-slate-800">{emp.name}</p>
                    <p className="text-[11px] text-slate-400">{emp.email} | {emp.departmentName}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(emp.id)}
                    onChange={() => togglePac(emp.id)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowAddModal(false);
                  await submitPacMembers();
                }}
                className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-xs font-semibold shadow-md shadow-blue-600/20"
              >
                Save PAC Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE CHAIRMAN MODAL */}
      {showChairmanModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Assign PAC Chairman</h3>
              <button onClick={() => setShowChairmanModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select a PAC Member to set as the Chairman:
            </p>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl p-2">
              {pacMembers.map((member) => (
                <label key={member.employee.id} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-bold text-xs text-slate-800">{member.employee.name}</p>
                    <p className="text-[11px] text-slate-400">{member.employee.email}</p>
                  </div>
                  <input
                    type="radio"
                    name="chairmanSelect"
                    checked={selectedChairman === member.employee.id}
                    onChange={() => setSelectedChairman(member.employee.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowChairmanModal(false)}
                className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={!selectedChairman}
                onClick={async () => {
                  if (selectedChairman) {
                    await makeChairman(selectedChairman);
                    setShowChairmanModal(false);
                  }
                }}
                className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-xs font-semibold shadow-md shadow-blue-600/20"
              >
                Confirm Chairman
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE MEMBER CONFIRMATION MODAL */}
      {showRemove && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100 text-center space-y-4">
            <h3 className="text-base font-bold text-slate-900">Remove PAC Member</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove this member from the PAC Team?
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowRemove(false)}
                className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowRemove(false);
                  await removePacMember(removeId);
                  setRemoveId(null);
                }}
                className="px-4 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-700 text-xs font-semibold shadow-md shadow-rose-600/20"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

export default AdminDashboard;