import axios from "axios";

const API_BASE_URL = "http://localhost:8000/user/";

// Setup Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Login Function
export const loginUser = async (email, password) => {
  const response = await api.post("token/", { email, password });
  localStorage.setItem("token", response.data.token); // Store token
  return response.data;
};

// Signup Function
export const signupUser = async (userData) => {
  await api.post("create/", userData);
};

// Get Authenticated User Data
export const getUser = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("me/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

// Logout Function
export const logoutUser = () => {
  localStorage.removeItem("token"); // Remove token
};
