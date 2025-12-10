import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const authService = {
  register: async (userData: any) => {
    const res = await axios.post(`${API_URL}/register`, userData);
    return res.data;
  },

  verify: async (email: string, code: string) => {
    const res = await axios.post(`${API_URL}/verify`, { email, code });
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    
    return res.data;
  },

  getAllUsers: async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:3000/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  }
};
