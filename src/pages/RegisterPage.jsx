import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiLayers,
  FiMapPin,
  FiCpu,
  FiShield,
  FiCheckCircle,
  FiArrowRight,
  FiLock,
  FiFileText,
  FiAlertCircle
} from "react-icons/fi";
import { HiBuildingLibrary } from "react-icons/hi2";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [departmentName, setDepartmentName] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [division, setDivision] = useState("");
  const [stateOfPosting, setStateOfPosting] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [ipNumber, setIpNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const [pacCommitteeMember, setPacCommitteeMember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(e) {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/employees/register",
        {
          name,
          email,
          contactNumber,
          departmentName,
          designation,
          division,
          stateOfPosting,
          permanentAddress,
          ipNumber,
          emergencyContact,
          pacCommitteeMember
        }
      );

      setUsername(response.data.username);
      setPassword(response.data.password);
    } catch (error) {
      console.log(error);
      alert("Registration Failed. Please verify details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased py-12 px-6 lg:px-16">
      <div className="max-w-4xl mx-auto w-full">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#021b3e] via-[#022859] to-[#043e85] rounded-t-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 text-blue-300 shrink-0">
              <FiUser className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Employee Account Registration
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1">
                Fill in official details to register an employee profile and generate portal access credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body Card */}
        <div className="bg-white rounded-b-2xl p-6 sm:p-8 shadow-xl border border-slate-200 border-t-0 space-y-6">
          {!username ? (
            <form onSubmit={handleRegister} className="space-y-6">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                1. Personal & Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiUser className="text-blue-600 text-sm" />
                    <span>Full Name <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saroj Kumar Sahoo"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiMail className="text-blue-600 text-sm" />
                    <span>Official Email Address <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. saroj.sahoo@nic.in"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiPhone className="text-blue-600 text-sm" />
                    <span>Contact Number <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiPhone className="text-blue-600 text-sm" />
                    <span>Emergency Contact</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9123456789"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                  />
                </div>
              </div>

              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 pt-2">
                2. Department & Designation Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <HiBuildingLibrary className="text-blue-600 text-sm" />
                    <span>Department Name <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Panchayati Raj Dept."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiBriefcase className="text-blue-600 text-sm" />
                    <span>Designation</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Technical Director"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </div>

                {/* Division */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiLayers className="text-blue-600 text-sm" />
                    <span>Division</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. e-Governance Division"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                  />
                </div>

                {/* State of Posting */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiMapPin className="text-blue-600 text-sm" />
                    <span>State of Posting</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Odisha"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    value={stateOfPosting}
                    onChange={(e) => setStateOfPosting(e.target.value)}
                  />
                </div>

                {/* IP Number */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiCpu className="text-blue-600 text-sm" />
                    <span>IP Number / Phone Extension</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10.150.24.102 / Ext 402"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    value={ipNumber}
                    onChange={(e) => setIpNumber(e.target.value)}
                  />
                </div>

                {/* Permanent Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiMapPin className="text-blue-600 text-sm" />
                    <span>Permanent Address</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter complete official permanent address..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-normal"
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* PAC Committee Checkbox */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    PAC Committee Member Registration?
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Check this option if this user is a designated PAC Committee Reviewer.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pacCommitteeMember}
                  onChange={(e) => setPacCommitteeMember(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !email || !contactNumber || !departmentName}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 text-xs sm:text-sm ${
                    isSubmitting || !name || !email || !contactNumber || !departmentName
                      ? "opacity-60 cursor-not-allowed shadow-none"
                      : "cursor-pointer"
                  }`}
                >
                  <FiCheckCircle className="text-base" />
                  <span>{isSubmitting ? "Registering..." : "Submit Registration"}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Registration Success Box */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-100 shadow-xs">
                <FiCheckCircle />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Registration Successful!
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Your employee profile has been created. Use the generated credentials below to sign in.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-md mx-auto space-y-3 text-left">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500">Generated Username:</span>
                  <span className="text-sm font-extrabold text-blue-700 tracking-wider">
                    {username}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Initial Password:</span>
                  <span className="text-sm font-extrabold text-slate-800 tracking-wider">
                    {password}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FiLock />
                  <span>Proceed to Sign In</span>
                  <FiArrowRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;