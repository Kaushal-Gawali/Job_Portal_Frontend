import api from "./axiosInstance";

export const searchJobs = (params) => api.get("/jobs", { params });
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const getMyJobs = (params) => api.get("/jobs/my-jobs", { params });
export const createJob = (data) => api.post("/jobs", data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const updateJobStatus = (id, status) =>
  api.patch(`/jobs/${id}/status`, null, { params: { status } });