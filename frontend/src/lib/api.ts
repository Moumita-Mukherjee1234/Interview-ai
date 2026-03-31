// frontend/src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ reads .env variable
  withCredentials: true, // send & receive cookies
});

export default api;