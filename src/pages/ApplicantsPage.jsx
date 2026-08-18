import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getApplicationsForJob, updateApplicationStatus } from "../api/applicationsApi";

const STATUS_OPTIONS = ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"];

const STATUS_STYLES = {
  APPLIED: "bg-blue-50 text-blue-700",
  SHORTLISTED: "bg-amber-50 text-amber-700",
  REJECTED: "bg-red-50 text-red-700",
  HIRED: "bg-green-50 text-green-700",
};

export default function ApplicantsPage() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getApplicationsForJob(jobId, { page: 0, size: 50 });
      setApplications(response.data.content);
    } catch (err) {
      setError(
        err.response?.status === 403
          ? "You don't have permission to view applicants for this job."
          : "Failed to load applicants."
      );
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/employer/my-jobs" className="text-sm text-blue-600 hover:underline">
        ← Back to my jobs
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-1">Applicants</h1>
      <p className="text-gray-500 mb-8">
        {applications.length} candidate{applications.length !== 1 ? "s" : ""} applied
      </p>

      {loading && <p className="text-center text-gray-500 py-10">Loading...</p>}

      {error && (
        <div className="rounded-md bg-red-50 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <p className="text-center text-gray-500 py-16 bg-white border border-gray-200 rounded-lg">
          No applications yet for this job.
        </p>
      )}

      {!loading && applications.length > 0 && (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{app.candidateName}</p>
                  <p className="text-sm text-gray-500">{app.candidateEmail}</p>
                </div>

                <select
                  value={app.status}
                  disabled={updatingId === app.id}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer ${
                    STATUS_STYLES[app.status] || "bg-gray-50 text-gray-700"
                  }`}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {app.coverLetter && (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {app.coverLetter}
                </p>
              )}

              {app.resumeUrl && (
                <a
                  href={`http://localhost:8080${app.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline"
                >
                  📄 View resume
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}