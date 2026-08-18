import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getMyJobs, deleteJob, updateJobStatus } from "../api/jobsApi";

const STATUS_STYLES = {
  OPEN: "bg-green-50 text-green-700",
  CLOSED: "bg-gray-100 text-gray-600",
  PENDING_APPROVAL: "bg-amber-50 text-amber-700",
};

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [actionError, setActionError] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMyJobs({ page, size: 10 });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load your job postings.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleToggleStatus = async (job) => {
    setActionError("");
    const newStatus = job.status === "OPEN" ? "CLOSED" : "OPEN";
    try {
      await updateJobStatus(job.id, newStatus);
      fetchJobs();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update job status.");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job posting? This cannot be undone.")) return;
    setActionError("");
    try {
      await deleteJob(jobId);
      fetchJobs();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to delete job.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Job Postings</h1>
          <p className="text-gray-500">Manage the jobs you've posted</p>
        </div>
        <Link
          to="/employer/post-job"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-4 py-2"
        >
          + Post a Job
        </Link>
      </div>

      {actionError && (
        <div className="mb-4 rounded-md bg-red-50 text-red-700 text-sm px-4 py-3">
          {actionError}
        </div>
      )}

      {loading && <p className="text-center text-gray-500 py-10">Loading...</p>}
      {error && <p className="text-center text-red-600 py-10">{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-3">You haven't posted any jobs yet.</p>
          <Link to="/employer/post-job" className="text-blue-600 font-medium hover:underline">
            Post your first job →
          </Link>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-lg p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-base font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {job.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-0.5">{job.location}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${
                      STATUS_STYLES[job.status] || "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
                  <Link
                    to={`/employer/jobs/${job.id}/applicants`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    View Applicants
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(job)}
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    {job.status === "OPEN" ? "Close posting" : "Reopen posting"}
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}