import api from "./axiosInstance";

export const applyToJob = (data) => api.post("/applications", data);
export const getMyApplications = (params) => api.get("/applications/me", { params });
export const getApplicationsForJob = (jobId, params) =>
  api.get(`/jobs/${jobId}/applications`, { params });
export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}/status`, { status });