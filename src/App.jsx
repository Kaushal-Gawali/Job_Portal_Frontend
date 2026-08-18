import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './routes/ProtectedRoute'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import JobDetailPage from './pages/JobDetailPage'
import MyApplicationsPage from './pages/MyApplicationsPage'
import ProfilePage from './pages/ProfilePage'
import PostJobPage from './pages/PostJobPage'
import MyJobsPage from './pages/MyJobsPage'
import ApplicantsPage from './pages/ApplicantsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/post-job"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYER"]}>
              <PostJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/my-jobs"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYER"]}>
              <MyJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/:jobId/applicants"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYER"]}>
              <ApplicantsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App