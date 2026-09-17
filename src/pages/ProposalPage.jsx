import { useEffect, useState, useRef } from "react";
import { saveProposal } from "../services/proposalService";
import SessionTimeout from "../components/SessionTimeout";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiFilePlus,
  FiGrid,
  FiFileText,
  FiLogOut,
  FiUserCheck,
  FiUser,
  FiCalendar,
  FiUploadCloud,
  FiTrash2,
  FiCheckCircle,
  FiEdit3,
  FiSearch,
  FiChevronDown,
  FiX,
  FiCheckSquare
} from "react-icons/fi";
import { HiBuildingLibrary } from "react-icons/hi2";

function ProposalPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [deptname, setDeptname] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [descp, setDescp] = useState("");
  const [files, setFile] = useState([]);
  const [message, setMessage] = useState("");
  const [groupHeadName, setGroupHeadName] = useState("");
  const [projectCoordinator, setProjectCoordinator] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group Heads and Employees dropdown data
  const [groupHeadsList, setGroupHeadsList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [isLoadingGroupHeads, setIsLoadingGroupHeads] = useState(false);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // User Profile for sidebar quick card
  const [userProfile, setUserProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("employee"));
    } catch {
      return null;
    }
  });

  // Searchable Project Coordinator dropdown state
  const [coordSearch, setCoordSearch] = useState("");
  const [isCoordDropdownOpen, setIsCoordDropdownOpen] = useState(false);
  const coordDropdownRef = useRef(null);

  const userType = localStorage.getItem("userType") || "employee";

  async function handleLogout() {
    try {
      await axios.post("http://localhost:8080/api/employees/logout");
    } catch (error) {
      console.log(error);
    }
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    // Fetch user profile, group heads, and all employees
    async function fetchData() {
      const employeeId = localStorage.getItem("employeeId");
      if (employeeId && employeeId !== "null") {
        try {
          const profileRes = await axios.get(`http://localhost:8080/api/employees/${employeeId}`);
          setUserProfile(profileRes.data);
        } catch (e) {
          console.error("Failed to load user profile", e);
        }
      }

      setIsLoadingGroupHeads(true);
      setIsLoadingEmployees(true);
      try {
        const ghRes = await axios.get("http://localhost:8080/api/employees/group-heads");
        setGroupHeadsList(ghRes.data || []);
      } catch (err) {
        console.error("Failed to load group heads", err);
      } finally {
        setIsLoadingGroupHeads(false);
      }

      try {
        const empRes = await axios.get("http://localhost:8080/api/employees");
        setEmployeesList(empRes.data || []);
      } catch (err) {
        console.error("Failed to load employees list", err);
      } finally {
        setIsLoadingEmployees(false);
      }
    }
    fetchData();

    // Check resubmit proposal from local storage
    const proposal = JSON.parse(localStorage.getItem("resubmitProposal"));
    if (proposal) {
      setDeptname(proposal.departmentName || "");
      setTitle(proposal.title || "");
      setGroupHeadName(proposal.groupHeadName || "");
      setProjectCoordinator(proposal.projectCoordinator || "");
      setCoordSearch(proposal.projectCoordinator || "");
      setDate(proposal.date || "");
      setDescp(proposal.description || "");
      localStorage.removeItem("resubmitProposal");
    }
  }, []);

  // Handle click outside for Project Coordinator searchable select
  useEffect(() => {
    function handleClickOutside(event) {
      if (coordDropdownRef.current && !coordDropdownRef.current.contains(event.target)) {
        setIsCoordDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];

    for (const file of selectedFiles) {
      if (file.type !== "application/pdf") {
        alert(file.name + " is not a PDF file. Only PDF files are accepted.");
        continue;
      }
      validFiles.push(file);
    }
    setFile((prev) => [...prev, ...validFiles]);
  }

  function removeFile(index) {
    setFile(files.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();

    // Validate all mandatory fields
    if (
      !deptname.trim() ||
      !groupHeadName.trim() ||
      !projectCoordinator.trim() ||
      !date.trim() ||
      !title.trim() ||
      !descp.trim() ||
      files.length === 0
    ) {
      alert("All fields are mandatory. Please fill in all details and attach at least one PDF document.");
      return;
    }

    const employeeId = localStorage.getItem("employeeId");
    if (!employeeId || employeeId === "null") {
      alert("Employee session invalid. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("departmentName", deptname);
    formData.append("groupHeadName", groupHeadName);
    formData.append("projectCoordinator", projectCoordinator);
    formData.append("title", title);
    formData.append("date", date);
    formData.append("description", descp);
    formData.append("employeeId", employeeId);

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await saveProposal(formData);
      setMessage("Proposal submitted successfully!");

      setTimeout(() => {
        if (userType === "pac") {
          localStorage.setItem("pacOption", "dashboard");
          navigate("/pac-Dashboard");
        } else if (userType === "admin") {
          localStorage.setItem("adminOption", "dashboard");
          navigate("/admin-Dashboard");
        } else {
          localStorage.setItem("employeeOption", "dashboard");
          navigate("/dashboard");
        }
      }, 1200);
    } catch (error) {
      console.log(error);
      alert("Proposal Submission Failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Filter employees for Project Coordinator search
  const filteredEmployees = employeesList.filter((emp) => {
    const query = coordSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      (emp.name && emp.name.toLowerCase().includes(query)) ||
      (emp.designation && emp.designation.toLowerCase().includes(query)) ||
      (emp.departmentName && emp.departmentName.toLowerCase().includes(query)) ||
      (emp.email && emp.email.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <SessionTimeout setIsLoggedIn={setIsLoggedIn} />

      <div className="flex min-h-screen bg-slate-100 font-sans antialiased">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-[#021b3e] via-[#022859] to-[#043e85] text-white p-6 flex flex-col justify-between shrink-0 shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-white/15">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 text-blue-300">
                {userType === "pac" ? (
                  <FiUserCheck className="text-xl" />
                ) : (
                  <FiFilePlus className="text-xl" />
                )}
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight leading-none text-white">
                  {userType === "pac" ? "PAC Member Panel" : "Employee Portal"}
                </h1>
                <span className="text-[11px] text-blue-200 font-medium">
                  {userType === "pac" ? "Review & Management" : "Proposal Submission"}
                </span>
              </div>
            </div>

            {/* User Profile Quick Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-xs text-blue-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/30 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-blue-400/30">
                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : (userType === "pac" ? "P" : "E")}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-white truncate text-xs">
                  {userProfile?.name || (userType === "pac" ? "PAC Member" : "Employee")}
                </p>
                <p className="text-[10px] text-blue-200 truncate">
                  {userProfile?.username || "NIC@PAC"}
                </p>
              </div>
            </div>

            <nav className="space-y-1.5 text-xs font-semibold">
              <button
                onClick={() => {
                  if (userType === "pac") {
                    localStorage.setItem("pacOption", "dashboard");
                    navigate("/pac-Dashboard");
                  } else if (userType === "admin") {
                    localStorage.setItem("adminOption", "dashboard");
                    navigate("/admin-Dashboard");
                  } else {
                    localStorage.setItem("employeeOption", "dashboard");
                    navigate("/dashboard");
                  }
                }}
                className="w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 text-blue-100 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <FiGrid className="text-base" />
                <span>Dashboard</span>
              </button>

              <button className="w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold cursor-pointer">
                <FiFilePlus className="text-base" />
                <span>Submit Proposal</span>
              </button>

              <button
                onClick={() => {
                  if (userType === "pac") {
                    localStorage.setItem("pacOption", "myProposals");
                    navigate("/pac-Dashboard");
                  } else if (userType === "admin") {
                    localStorage.setItem("adminOption", "proposals");
                    navigate("/admin-Dashboard");
                  } else {
                    localStorage.setItem("employeeOption", "myProposals");
                    navigate("/dashboard");
                  }
                }}
                className="w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 text-blue-100 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <FiFileText className="text-base" />
                <span>My Proposals</span>
              </button>

              {(userType === "pac" || userProfile?.pacCommitteeMember) && (
                <button
                  onClick={() => {
                    localStorage.setItem("pacOption", "review");
                    navigate("/pac-Dashboard");
                  }}
                  className="w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 text-blue-100 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  <FiCheckSquare className="text-base" />
                  <span>Review Proposals</span>
                </button>
              )}
            </nav>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white border border-red-400/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer mt-6"
          >
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Form Container */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="w-full space-y-6">
            {/* Top Form Header Card */}
            <div className="bg-gradient-to-r from-[#021b3e] via-[#022859] to-[#043e85] rounded-t-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 text-blue-300 shrink-0">
                  <FiFilePlus className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Project Proposal Submission
                  </h1>
                  <p className="text-xs text-blue-100/90 mt-1">
                    Enter project details and attach required PDF documentation for PAC Committee review. All fields are mandatory.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body Card */}
            <div className="bg-white rounded-b-2xl p-6 sm:p-8 shadow-xl border border-slate-200 border-t-0 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  1. Project & Officer Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Department Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <HiBuildingLibrary className="text-blue-600 text-sm" />
                      <span>Department Name <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Panchayati Raj & Drinking Water Dept."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                      value={deptname}
                      onChange={(e) => setDeptname(e.target.value)}
                    />
                  </div>

                  {/* Group Head Name (Dropdown from Employees table where group_head == true) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <FiUserCheck className="text-blue-600 text-sm" />
                      <span>Group Head Name <span className="text-red-500">*</span></span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium appearance-none cursor-pointer pr-10"
                        value={groupHeadName}
                        onChange={(e) => setGroupHeadName(e.target.value)}
                      >
                        <option value="">
                          {isLoadingGroupHeads ? "Loading Group Heads..." : "-- Select Group Head --"}
                        </option>
                        {groupHeadsList.map((gh) => (
                          <option key={gh.id} value={gh.name}>
                            {gh.name} {gh.designation ? `(${gh.designation})` : ""} {gh.departmentName ? `- ${gh.departmentName}` : ""}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base" />
                    </div>
                  </div>

                  {/* Project Coordinator (Searchable Dropdown of all Employees) */}
                  <div className="relative" ref={coordDropdownRef}>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <FiUser className="text-blue-600 text-sm" />
                      <span>Project Coordinator <span className="text-red-500">*</span></span>
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder={isLoadingEmployees ? "Loading employees..." : "Search & Select Employee..."}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium pr-9"
                        value={coordSearch}
                        onFocus={() => setIsCoordDropdownOpen(true)}
                        onChange={(e) => {
                          setCoordSearch(e.target.value);
                          setProjectCoordinator(e.target.value);
                          setIsCoordDropdownOpen(true);
                        }}
                      />
                      {coordSearch ? (
                        <button
                          type="button"
                          onClick={() => {
                            setCoordSearch("");
                            setProjectCoordinator("");
                            setIsCoordDropdownOpen(true);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <FiX className="text-base" />
                        </button>
                      ) : (
                        <FiSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm" />
                      )}
                    </div>

                    {/* Search Dropdown Popup */}
                    {isCoordDropdownOpen && (
                      <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100">
                        {isLoadingEmployees ? (
                          <div className="p-3 text-xs text-slate-400 text-center">Loading employees list...</div>
                        ) : filteredEmployees.length > 0 ? (
                          filteredEmployees.map((emp) => (
                            <div
                              key={emp.id}
                              onClick={() => {
                                setProjectCoordinator(emp.name);
                                setCoordSearch(emp.name);
                                setIsCoordDropdownOpen(false);
                              }}
                              className={`p-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between ${
                                projectCoordinator === emp.name ? "bg-blue-50/70 border-l-4 border-blue-600" : ""
                              }`}
                            >
                              <div>
                                <div className="text-xs font-bold text-slate-800">{emp.name}</div>
                                <div className="text-[11px] text-slate-500">
                                  {emp.designation || "Employee"} {emp.departmentName ? `• ${emp.departmentName}` : ""}
                                </div>
                              </div>
                              {emp.groupHead && (
                                <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                                  Group Head
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-xs text-slate-400 text-center">
                            No employees found matching "{coordSearch}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Proposal Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <FiCalendar className="text-blue-600 text-sm" />
                      <span>Proposal Date <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium cursor-pointer"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  {/* Proposal Title */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <FiFileText className="text-blue-600 text-sm" />
                      <span>Proposal Title <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Monitoring Dashboard for MAGY and Model Village Mission"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <FiEdit3 className="text-blue-600 text-sm" />
                      <span>Project Summary & Detailed Description <span className="text-red-500">*</span></span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Enter detailed project scope, objectives, budget summary, and implementation strategy..."
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-normal"
                      value={descp}
                      onChange={(e) => setDescp(e.target.value)}
                    />
                  </div>
                </div>

                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 pt-2">
                  2. Document Attachments (PDF Only) <span className="text-red-500">*</span>
                </h2>

                {/* PDF File Upload Zone */}
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center bg-slate-50/60 transition-colors">
                  <FiUploadCloud className="text-3xl text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">
                    Upload Proposal Documents <span className="text-red-500">*</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mb-3">
                    At least one PDF document is required for PAC evaluation.
                  </p>

                  <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/20 cursor-pointer transition-all">
                    <FiFilePlus />
                    <span>Choose PDF Files</span>
                    <input
                      type="file"
                      accept=".pdf"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {/* Attached Files List */}
                {files.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold text-slate-700">
                      Attached Files ({files.length}):
                    </h3>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FiFileText className="text-blue-600 text-base shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (userType === "pac") navigate("/pac-Dashboard");
                      else navigate("/dashboard");
                    }}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !deptname.trim() ||
                      !groupHeadName.trim() ||
                      !projectCoordinator.trim() ||
                      !date.trim() ||
                      !title.trim() ||
                      !descp.trim() ||
                      files.length === 0
                    }
                    className={`flex-1 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 text-xs sm:text-sm ${
                      isSubmitting ||
                      !deptname.trim() ||
                      !groupHeadName.trim() ||
                      !projectCoordinator.trim() ||
                      !date.trim() ||
                      !title.trim() ||
                      !descp.trim() ||
                      files.length === 0
                        ? "opacity-60 cursor-not-allowed shadow-none"
                        : "cursor-pointer"
                    }`}
                  >
                    <FiCheckCircle className="text-base" />
                    <span>{isSubmitting ? "Submitting..." : "Submit Proposal"}</span>
                  </button>
                </div>

                {message && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-2">
                    <FiCheckCircle />
                    <span>{message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

export default ProposalPage;