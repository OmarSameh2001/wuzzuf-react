import axios from "axios";
import { AxiosApi } from "./api";

// Login Function
export const loginUser = async (email, password) => {
  const response = await axios.post("http://localhost:8000/user/token/", { email, password });
  return response.data;
};

// Signup Function
export const signupUser = async (userData) => {
  await AxiosApi.post("user/create/", userData);
};

// Get Authenticated User Data
export const getUser = async () => {
  const response = await AxiosApi.get("user/profile/");
  return response.data;
};

// Logout Function
export const logoutUser = () => {
  localStorage.removeItem("token"); // Remove token
};
