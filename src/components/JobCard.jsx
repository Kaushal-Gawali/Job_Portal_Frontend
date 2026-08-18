import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    const fmt = (n) => `₹${(n / 100000).toFixed(1)}L`;
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    return fmt(min || max);
  };

  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600 mt-0.5">{job.companyName}</p>
        </div>
        {job.jobType && (
          <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full whitespace-nowrap">
            {job.jobType.replace("_", " ")}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
        {job.location && <span>📍 {job.location}</span>}
        {salary && <span>💰 {salary}</span>}
      </div>

      {job.skillsRequired && (
        <p className="text-sm text-gray-500 mt-3 line-clamp-2">
          {job.skillsRequired}
        </p>
      )}
    </Link>
  );
}