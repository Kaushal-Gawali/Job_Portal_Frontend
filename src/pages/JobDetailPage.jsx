import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJobById } from "../api/jobsApi";
import { applyToJob } from "../api/applicationsApi";
import { useAuth } from "../context/AuthContext";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const response = await getJobById(id);
        setJob(response.data);
      } catch (err) {
        setError("Job not found or no longer available.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const formatSalary = (min, max) => {
    if (!min && !max) return "Not disclosed";
    const fmt = (n) => `₹${(n / 100000).toFixed(1)}L`;
    if (min && max) return `${fmt(min)} - ${fmt(max)} per year`;
    return `${fmt(min || max)} per year`;
  };

  const handleApplyClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowApplyForm(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError("");

    try {
      await applyToJob({ jobId: job.id, coverLetter });
      setApplySuccess(true);
      setShowApplyForm(false);
    } catch (err) {
      setApplyError(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-20">Loading job details...</p>;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to job listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Back to job listings
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-8 mt-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 mt-1">{job.companyName}</p>
          </div>
          {job.jobType && (
            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full whitespace-nowrap">
              {job.jobType.replace("_", " ")}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
          {job.location && <span>📍 {job.location}</span>}
          <span>💰 {formatSalary(job.salaryMin, job.salaryMax)}</span>
          <span
            className={`font-medium ${
              job.status === "OPEN" ? "text-green-600" : "text-gray-400"
            }`}
          >
            {job.status === "OPEN" ? "● Actively hiring" : `● ${job.status}`}
          </span>
        </div>

        <hr className="my-6 border-gray-100" />

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {job.description}
          </p>
        </div>

        {job.skillsRequired && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.split(",").map((skill, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <hr className="my-6 border-gray-100" />

        {/* Apply section */}
        {applySuccess ? (
          <div className="rounded-md bg-green-50 text-green-700 text-sm px-4 py-3">
            ✅ Application submitted successfully! You can track its status under "My Applications".
          </div>
        ) : job.status !== "OPEN" ? (
          <p className="text-sm text-gray-500">This position is no longer accepting applications.</p>
        ) : user?.role === "EMPLOYER" ? (
          <p className="text-sm text-gray-500">Employers cannot apply to jobs.</p>
        ) : !showApplyForm ? (
          <button
            onClick={handleApplyClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-2.5"
          >
            Apply Now
          </button>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-3">
            {applyError && (
              <div className="rounded-md bg-red-50 text-red-700 text-sm px-4 py-3">
                {applyError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter (optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell the employer why you're a great fit..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={applying}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-md px-6 py-2 text-sm"
              >
                {applying ? "Submitting..." : "Submit Application"}
              </button>
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}