import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile, uploadResume } from "../api/candidateApi";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    phone: "",
    skills: "",
    location: "",
    experienceYears: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setProfile(response.data);
        setForm({
          phone: response.data.phone || "",
          skills: response.data.skills || "",
          location: response.data.location || "",
          experienceYears: response.data.experienceYears ?? "",
        });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaveSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      const payload = {
        ...form,
        experienceYears: form.experienceYears === "" ? null : Number(form.experienceYears),
      };
      const response = await updateMyProfile(payload);
      setProfile(response.data);
      setSaveSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploading(true);
    setUploadError("");

    try {
      const response = await uploadResume(resumeFile);
      setProfile(response.data);
      setResumeFile(null);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-20">Loading profile...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
      <p className="text-gray-500 mb-8">
        {profile?.name} · {profile?.email}
      </p>

      {/* Resume section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Resume</h2>

        {profile?.resumeUrl ? (
          <a
            href={`http://localhost:8080${profile.resumeUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm hover:underline"
          >
            📄 View current resume
          </a>
        ) : (
          <p className="text-sm text-gray-400 mb-2">No resume uploaded yet.</p>
        )}

        <div className="flex items-center gap-3 mt-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="text-sm text-gray-600"
          />
          <button
            onClick={handleResumeUpload}
            disabled={!resumeFile || uploading}
            className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white text-sm font-medium rounded-md px-4 py-2"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {uploadError && (
          <p className="text-red-600 text-xs mt-2">{uploadError}</p>
        )}
      </div>

      {/* Profile details form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Profile Details</h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}
        {saveSuccess && (
          <div className="mb-4 rounded-md bg-green-50 text-green-700 text-sm px-4 py-3">
            Profile updated successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mumbai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              name="experienceYears"
              value={form.experienceYears}
              onChange={handleChange}
              min="0"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma-separated)
            </label>
            <textarea
              name="skills"
              value={form.skills}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React, Java, SQL, Spring Boot"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-md px-6 py-2 text-sm"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}