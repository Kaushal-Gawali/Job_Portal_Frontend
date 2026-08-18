import api from "./axiosInstance";

export const getStats = () => api.get("/admin/stats");
export const getAllUsers = (params) => api.get("/admin/users", { params });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const updateJobStatusAdmin = (id, status) =>
  api.patch(`/admin/jobs/${id}/status`, null, { params: { status } });