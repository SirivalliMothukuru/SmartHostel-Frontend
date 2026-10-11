
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

export const createHostelSnap = (snap) =>
  api.post("/api/snaps", snap);

export const getHostelSnaps = (block) =>
  api.get("/api/snaps", { params: { block } });
