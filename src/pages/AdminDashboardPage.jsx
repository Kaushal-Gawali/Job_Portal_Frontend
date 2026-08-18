import { useState, useEffect, useCallback } from "react";
import { getStats, getAllUsers, deleteUser } from "../api/adminApi";
import { useAuth } from "../context/AuthContext";

const ROLE_STYLES = {
  CANDIDATE: "bg-blue-50 text-blue-700",
  EMPLOYER: "bg-amber-50 text-amber-700",
  ADMIN: "bg-purple-50 text-purple-700",
};

export default function AdminDashboardPage() {
  const { user: currentUser } = useAuth();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await getStats();
      setStats(response.data);
    } catch (err) {
      setError("Failed to load stats.");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const response = await getAllUsers({ page, size: 10 });
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setUsersLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.role === "ADMIN") return; // backend blocks this anyway, UI mirrors it

    if (!window.confirm(`Delete ${targetUser.name} (${targetUser.email})? This cannot be undone.`)) {
      return;
    }

    setError("");
    try {
      await deleteUser(targetUser.id);
      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const statCards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers },
        { label: "Candidates", value: stats.totalCandidates },
        { label: "Employers", value: stats.totalEmployers },
        { label: "Total Jobs", value: stats.totalJobs },
        { label: "Open Jobs", value: stats.openJobs },
        { label: "Applications", value: stats.totalApplications },
      ]
    : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Platform overview and user management</p>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* Stats grid */}
      {statsLoading ? (
        <p className="text-gray-500 mb-8">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Users table */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">All Users</h2>

      {usersLoading ? (
        <p className="text-gray-500 py-6">Loading users...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="px-5 py-3 text-gray-900">
                    {u.name}
                    {u.email === currentUser?.email && (
                      <span className="text-xs text-gray-400 ml-2">(you)</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        ROLE_STYLES[u.role] || "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {u.role !== "ADMIN" && (
                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="text-red-600 hover:text-red-700 font-medium text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
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
    </div>
  );
}