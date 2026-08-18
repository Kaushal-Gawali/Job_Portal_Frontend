import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          JobConnect
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600">
            Browse Jobs
          </Link>

          {/* Not logged in */}
          {!user && (
            <>
              <Link to="/login" className="hover:text-blue-600">
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}

          {/* Logged in as CANDIDATE */}
          {user?.role === "CANDIDATE" && (
            <>
              <Link to="/my-applications" className="hover:text-blue-600">
                My Applications
              </Link>
              <Link to="/profile" className="hover:text-blue-600">
                Profile
              </Link>
            </>
          )}

          {/* Logged in as EMPLOYER */}
          {user?.role === "EMPLOYER" && (
            <>
              <Link to="/employer/my-jobs" className="hover:text-blue-600">
                My Jobs
              </Link>
              <Link to="/employer/post-job" className="hover:text-blue-600">
                Post a Job
              </Link>
            </>
          )}

          {/* Logged in as ADMIN */}
          {user?.role === "ADMIN" && (
            <Link to="/admin" className="hover:text-blue-600">
              Admin Dashboard
            </Link>
          )}

          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <span className="text-gray-500">Hi, {user.name?.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}