import { useState } from "react";
import axios from "axios";
import { FiUploadCloud, FiX, FiFileText, FiCheckCircle, FiRefreshCw, FiAlertCircle } from "react-icons/fi";

function ResubmitModal({ proposal, isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !proposal) return null;

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setErrorMsg("Only PDF files are allowed.");
        setFile(null);
        return;
      }
      setErrorMsg("");
      setFile(selectedFile);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Please select a PDF document file to upload.");
      return;
    }
    if (!remarks.trim()) {
      setErrorMsg("Please enter revision remarks explaining the updates made.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("files", file);
    formData.append("remarks", remarks.trim());

    try {
      await axios.post(
        `http://localhost:8080/api/proposals/${proposal.id}/resubmit`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Resubmission failed", err);
      setErrorMsg("Failed to resubmit proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 antialiased font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#021b3e] to-[#043e85] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-blue-300">
              <FiUploadCloud className="text-xl" />
            </div>
            <div>
              <h2 className="text-base font-bold">Resubmit Proposal Revision</h2>
              <p className="text-xs text-blue-200/90 truncate max-w-xs">
                Proposal #{proposal.id}: {proposal.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
              <FiAlertCircle className="text-base shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* File Upload Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Updated PDF Document File <span className="text-red-500">*</span>
            </label>
            <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50 hover:bg-blue-50/30 group cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiFileText className="text-2xl" />
                </div>
                {file ? (
                  <div>
                    <span className="text-xs font-bold text-slate-800 block truncate max-w-xs">
                      {file.name}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-center gap-1 mt-0.5">
                      <FiCheckCircle /> Selected & Ready for Upload
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">
                      Click to choose or drag & drop updated PDF
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      PDF files only (Max 25MB)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Remarks Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Revision Remarks & Change Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Provide a clear summary of updates made in response to committee feedback..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium leading-relaxed resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <FiRefreshCw className="animate-spin text-sm" />
                  <span>Submitting Revision...</span>
                </>
              ) : (
                <>
                  <FiUploadCloud className="text-sm" />
                  <span>Submit Revision</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResubmitModal;
