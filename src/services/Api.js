import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND}`;

export const AxiosApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // 'Authorization': `Token ${localStorage.getItem("token")}`
  },
});

export const getTracks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/tracks/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    return response.data.results;
  } catch (error) {
    throw new Error('Unable to fetch tracks. Please try again later.');
  }
};

export const createTrack = async (name) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/tracks/`,
      { name },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable to add new track. Please try again later.');
  }
};

export const createBranch = async (name, address) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/branches/`,
      { name, address },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable to add new branch. Please try again later.');
  }
};


export const getBranches = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/branches/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    return response.data.results;
  } catch (error) {
    throw new Error('Unable to fetch branches. Please try again later.');
  }
};


// Function to get the reset token by email
export const getResetToken = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/password-reset/get-token/`, { email });
    return response.data;  // Return the response data (which should include the token)
  } catch (error) {
    throw new Error('Unable to fetch the token. Please try again later.');
  }
};

// Function to confirm password reset
export const resetPassword = async (email, token, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/password-reset/confirm/`, {
      email,
      token,
      new_password: newPassword,
    });
    return response.data;  // Return response message (e.g., success message)
  } catch (error) {
    throw new Error('Failed to reset password. Please check the token or try again.');
  }
};

// Function to update Axios headers when the token changes
export const setAuthToken = (token) => {
  if (token) {
    AxiosApi.defaults.headers.common["Authorization"] = `Token ${token}`;
  } else {
    delete AxiosApi.defaults.headers.common["Authorization"];
  }
};

