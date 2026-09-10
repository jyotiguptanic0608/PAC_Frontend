import NB from "../assets/NB.png";
import NIC from "../assets/NIC.jpg";
import { FiHelpCircle, FiMail } from "react-icons/fi";

function Header() {
  return (
    <header className="w-full px-6 sm:px-10 lg:px-12 py-4 sm:py-5 bg-gradient-to-r from-[#fff7ed] via-white to-[#ecfdf5] border-b border-slate-200/80 shadow-xs">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Left: Extreme Left - National Emblem & MeitY Branding */}
        <div className="flex items-center gap-4">
          <img
            src={NB}
            alt="National Emblem"
            className="h-18 sm:h-22 object-contain shrink-0"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2C84] tracking-tight leading-none mb-1">
              MeitY
            </h1>
            <p className="text-[#0B2C84] text-xs sm:text-sm font-semibold leading-tight">
              Ministry of Electronics and Information Technology
            </p>
            <p className="text-[#0B2C84]/80 text-xs font-medium leading-tight">
              Government of India
            </p>
          </div>
        </div>

        {/* Right: Extreme Right - Help & Support, Contact & NIC Logo */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-5 sm:gap-6 text-xs sm:text-sm text-slate-700 font-medium">
            <a
              href="#help"
              className="flex items-center gap-1.5 hover:text-blue-700 transition-colors"
            >
              <FiHelpCircle className="text-base text-blue-600" />
              <span>Help & Support</span>
            </a>
            <a
              href="mailto:contact@nic.in"
              className="flex items-center gap-1.5 hover:text-blue-700 transition-colors"
            >
              <FiMail className="text-base text-blue-600" />
              <span>contact@nic.in</span>
            </a>
          </div>

          <img
            src={NIC}
            alt="NIC Logo"
            className="h-16 sm:h-18 object-contain rounded-xl shrink-0 shadow-2xs"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;