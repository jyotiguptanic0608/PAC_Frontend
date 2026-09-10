import { FiLogOut, FiAlertTriangle, FiX } from "react-icons/fi";

function LogoutConfirmationModal({ isOpen, onClose, onConfirm, isLoggingOut = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-slate-100 relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          disabled={isLoggingOut}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <FiX className="text-lg" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-amber-100">
          <FiAlertTriangle />
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-lg font-bold text-slate-900 mb-1.5">
          Confirm Logout
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          Are you sure you want to log out of your account? You will need to log in again to access your dashboard.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiLogOut className="text-sm" />
            <span>{isLoggingOut ? "Logging out..." : "Yes, Logout"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmationModal;
