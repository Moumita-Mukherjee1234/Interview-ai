import axios from "axios";

export const api = axios.create({
  baseURL: "https://interview-ai-backend-v49f.onrender.com/",
  withCredentials: true, // ⭐ THIS sends & receives cookies
});
export default api;