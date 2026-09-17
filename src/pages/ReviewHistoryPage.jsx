import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
  FiDownload,
  FiX,
  FiUser,
  FiCalendar,
  FiMessageSquare,
  FiFile,
  FiShield,
  FiRefreshCw
} from "react-icons/fi";
import { HiBuildingLibrary } from "react-icons/hi2";

function ReviewHistoryPage({ proposalId, inline = false }) {
  const [proposal, setProposal] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (proposalId) {
      loadProposal();
    }
  }, [proposalId]);

  async function loadProposal() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/proposals/${proposalId}`
      );
      setProposal(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function openPdf(fileName) {
    setSelectedPdf(fileName);
    setShowPdf(true);
  }

  function renderStatusBadge(status) {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200">
            <FiCheckCircle className="text-sm" />
            <span>APPROVED</span>
          </span>
        );
      case "CHANGES_REQUIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-extrabold rounded-full border border-purple-200">
            <FiRefreshCw className="text-sm" />
            <span>CHANGES REQUIRED</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-extrabold rounded-full border border-red-200">
            <FiAlertCircle className="text-sm" />
            <span>REJECTED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-extrabold rounded-full border border-amber-200">
            <FiClock className="text-sm animate-pulse" />
            <span>UNDER REVIEW</span>
          </span>
        );
    }
  }

  if (isLoading) {
    return (
      <div className="w-full py-8 text-center text-slate-500 text-xs font-semibold flex items-center justify-center gap-2">
        <FiRefreshCw className="animate-spin text-blue-600 text-base" />
        <span>Loading history records for Proposal #{proposalId}...</span>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="w-full bg-white rounded-xl p-6 border border-slate-200 text-center text-slate-500 text-xs">
        No proposal details found for ID #{proposalId}.
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 antialiased font-sans">
      {/* Top Banner (Only if not inline) */}
      {!inline && (
        <div className="bg-gradient-to-r from-[#021b3e] via-[#022859] to-[#043e85] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 text-blue-300 shrink-0">
              <FiClock className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Proposal Review & Audit History
              </h1>
              <p className="text-xs text-blue-100/90 mt-1">
                Detailed chronological evaluation logs, reviewer comments, and attached document versions for Proposal #{proposal.id}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1. Proposal Information Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Proposal Metadata
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {proposal.title}
            </h2>
          </div>
          <div className="shrink-0">{renderStatusBadge(proposal.status)}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block flex items-center gap-1">
              <HiBuildingLibrary className="text-blue-600" />
              <span>Department Name</span>
            </span>
            <span className="font-bold text-slate-800 text-sm">
              {proposal.departmentName || "N/A"}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block flex items-center gap-1">
              <FiUser className="text-blue-600" />
              <span>Group Head</span>
            </span>
            <span className="font-bold text-slate-800 text-sm">
              {proposal.groupHeadName || "N/A"}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block flex items-center gap-1">
              <FiUser className="text-blue-600" />
              <span>Project Coordinator</span>
            </span>
            <span className="font-bold text-slate-800 text-sm">
              {proposal.projectCoordinator || "N/A"}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block flex items-center gap-1">
              <FiCalendar className="text-blue-600" />
              <span>Submission Date</span>
            </span>
            <span className="font-bold text-slate-800 text-sm">
              {proposal.date || "N/A"}
            </span>
          </div>
        </div>

        {proposal.description && (
          <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-xl space-y-1 text-xs">
            <span className="font-bold text-slate-700 block">
              Project Description & Scope:
            </span>
            <p className="text-slate-600 leading-relaxed">
              {proposal.description}
            </p>
          </div>
        )}
      </div>

      {/* 2. Review History Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <FiMessageSquare className="text-blue-600 text-base" />
          <h2 className="text-sm font-bold text-slate-900">
            Committee Evaluation Logs & Reviewer Remarks
          </h2>
        </div>

        {proposal.reviews && proposal.reviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-48">Date & Time</th>
                  <th className="p-4 w-56">Committee Reviewer</th>
                  <th className="p-4">Official Remarks & Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proposal.reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <FiClock className="text-slate-400" />
                        <span>
                          {new Date(review.reviewDate).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short"
                          })}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-extrabold text-xs">
                          {review.reviewer?.name ? review.reviewer.name.charAt(0) : "R"}
                        </div>
                        <span>{review.reviewer?.name || "PAC Member"}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-medium">
                        {review.remarks || "No remarks provided."}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs font-semibold">
            No committee reviews recorded yet for this proposal.
          </div>
        )}
      </div>

      {/* 3. Proposal Document & Revision History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <FiFileText className="text-blue-600 text-base" />
          <h2 className="text-sm font-bold text-slate-900">
            Uploaded Proposal Documents & Revision History
          </h2>
        </div>

        {(() => {
          const hasRevisions = proposal.revisions && proposal.revisions.length > 0;
          const revisionList = hasRevisions
            ? proposal.revisions
            : (proposal.file ? proposal.file.split(",").map((file, idx) => ({
                id: idx,
                versionNumber: idx + 1,
                submissionDate: proposal.date,
                remarks: idx === 0 ? "Initial Proposal Submission" : "Revised Document Uploaded",
                fileName: file
              })) : []);

          if (revisionList.length === 0) {
            return (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                No document attachments linked with this proposal.
              </div>
            );
          }

          return (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 w-28">Version</th>
                    <th className="p-4 w-44">Submission Date</th>
                    <th className="p-4">Employee Remarks / Change Notes</th>
                    <th className="p-4">PDF Document File</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {revisionList.map((rev, index) => (
                    <tr key={rev.id || index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-700">
                        <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-[11px] font-extrabold shadow-2xs">
                          Version {rev.versionNumber || index + 1}
                        </span>
                      </td>

                      <td className="p-4 text-slate-600 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <FiClock className="text-slate-400 shrink-0" />
                          <span>
                            {rev.submissionDate
                              ? (rev.submissionDate.includes("T")
                                  ? new Date(rev.submissionDate).toLocaleString("en-IN", {
                                      dateStyle: "medium",
                                      timeStyle: "short"
                                    })
                                  : rev.submissionDate)
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium leading-relaxed">
                          {rev.remarks || "No remarks entered."}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiFile className="text-blue-600 text-base shrink-0" />
                          <span className="font-bold text-slate-800 truncate max-w-xs">
                            {rev.fileName}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => openPdf(rev.fileName)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all cursor-pointer"
                        >
                          <FiEye />
                          <span>View Document</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>

      {/* Embedded PDF Viewer Modal */}
      {showPdf && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white flex justify-between items-center px-6 py-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <FiFile className="text-blue-400 text-lg shrink-0" />
                <h2 className="text-sm font-bold truncate max-w-md">
                  {selectedPdf}
                </h2>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
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
                      console.log(err);
                    }
                  }}
                >
                  <FiDownload />
                  <span>Download</span>
                </button>

                <button
                  className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  onClick={() => {
                    setShowPdf(false);
                    setSelectedPdf("");
                  }}
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
    </div>
  );
}

export default ReviewHistoryPage;