import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../api/applicationsApi";

const STATUS_STYLES = {
  APPLIED: "bg-blue-50 text-blue-700",
  SHORTLISTED: "bg-amber-50 text-amber-700",
  REJECTED: "bg-red-50 text-red-700",
  HIRED: "bg-green-50 text-green-700",
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMyApplications({ page, size: 10 });
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load your applications.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Applications</h1>
      <p className="text-gray-500 mb-8">Track the status of jobs you've applied to</p>

      {loading && <p className="text-center text-gray-500 py-10">Loading...</p>}

      {error && (
        <div className="rounded-md bg-red-50 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-3">You haven't applied to any jobs yet.</p>
          <Link to="/" className="text-blue-600 font-medium hover:underline">
            Browse open jobs →
          </Link>
        </div>
      )}

      {!loading && applications.length > 0 && (
        <>
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between"
              >
                <div>
                  <Link
                    to={`/jobs/${app.jobId}`}
                    className="text-base font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {app.jobTitle}
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">{app.companyName}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Applied on {formatDate(app.appliedAt)}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${
                    STATUS_STYLES[app.status] || "bg-gray-50 text-gray-700"
                  }`}
                >
                  {app.status}
                </span>
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