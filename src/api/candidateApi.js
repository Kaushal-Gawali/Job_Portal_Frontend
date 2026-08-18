import api from "./axiosInstance";

export const getMyProfile = () => api.get("/candidates/me");
export const updateMyProfile = (data) => api.put("/candidates/me", data);

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/candidates/me/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};