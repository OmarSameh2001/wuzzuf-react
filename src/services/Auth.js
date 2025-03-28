import { AxiosApi } from "./Api";

// Login Function
export const loginUser = async (email, password) => {
    const response = await AxiosApi.post("api/user/token/", { email, password });
    localStorage.setItem("token", response.data.token); // Store token
    return response.data;
  };
  
  // Signup Function
  export const signupUser = async (userData) => {
    await AxiosApi.post("api/user/create/", userData);
  };
  
  // Get Authenticated User Data
  export const getUser = async () => {
    const token = localStorage.getItem("token");
    const response = await AxiosApi.get("api/user/me/", {
      headers: { Authorization: `Token ${token}` },
    });
    return response.data;
  };
  
  // Logout Function
  export const logoutUser = () => {
    localStorage.removeItem("api/user/token"); // Remove token
  };