import axios from "axios";
import { AxiosApi } from "./Api";

// Login Function
export const loginUser = async (email, password) => {
  const response = await axios.post("http://localhost:8000/user/token/", {
    email,
    password,
  });
  return response.data;
};

// Signup Function
export const signupUser = async (userData) => {
  await AxiosApi.post("user/create/", userData);
};

// Get Authenticated User Data
export const getUser = async () => {
  try {
  const response = await AxiosApi.get("user/profile/");
  // return response.data;
  if (!response.data) {
    throw new Error("No data received from server");
  }
  return response.data;
  } catch (error) {
  console.error("Error fetching user:", error);
  // Clear invalid token
  localStorage.removeItem("token");
  throw error;
}
};

// Logout Function
export const logoutUser = () => {
  localStorage.removeItem("token"); // Remove token
};

export const patchUser = async (id, userData) => {
  const response = await AxiosApi.patch(`user/jobseekers/${id}/`, userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
export const updateUserProfile = async (userId, formData) => {
  try {
    const response = await AxiosApi.patch(
      `/user/jobseekers/${userId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // console.log(response.data);
    return response;
  } catch (error) {
    console.error("Profile Update Error:", error);
    throw error;
  }
};
