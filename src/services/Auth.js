import axios from "axios";
import { AxiosApi } from "./Api";

// Login Function
export const loginUser = async (email, password) => {

  const response = await axios.post("http://localhost:8000/user/token/", {
    email,
    password,
  });

  // if (!response.ok) throw new Error("Login failed");

  localStorage.setItem("token", response.data.token); // Store token in local storage
  return response.data.token;
};

// Signup Function

export const signupUser = async (userData) => {
  try {
    const response = await axios.post("http://localhost:8000/user/register/", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Authenticated User Data
export const getUser = async (token) => {
  // console.log("Token:", token);  // Check if the token is valid and exists

  try {
    const response = await AxiosApi.get('user/profile/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    //console.log("User Data:", response.data.img); // Log the user data for debugging
    if (response?.data?.img?.startsWith("image/upload/")) {
      response.data.img = response.data.img.replace("image/upload/", "");
    }
    console.log(response.data.img); // Log the user data for debugging
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Handle 401 error: maybe logout or redirect to login page
      console.error("Unauthorized request. Please login again.");
    }
    throw error; // Re-throw error for further handling
  }
};

// Logout Function
export const logoutUser = () => {
  localStorage.removeItem("token"); // Remove token
};

export const patchUser = async (id, userData) => {
  const response = await AxiosApi.patch(`user/jobseekers/${id}/`, userData, {
    headers: { "Content-Type": "multipart/form-data" ,
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
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

//verifyy companyyy
export const verifyCompany = async (companyId, token) => {
  const res = await fetch(`http://127.0.0.1:8000/user/admin/verify_company/?id=${companyId}`, {
    method: "PATCH", // or "PATCH"/"POST" if your view is like that
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Verification failed");
  }

  return await res.json();
};

export const getCompanyById = async (id) => {
  console.log("ID:", id);  // Check if the ID is valid and exists
  if(id === undefined || id == 0) return {};
  const response = await AxiosApi.get(`user/companies/${id}/`);

  return response.data;
};