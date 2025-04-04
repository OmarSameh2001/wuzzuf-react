import axios from "axios";

const API_BASE_URL = "http://localhost:8000/";

export const AxiosApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to update Axios headers when the token changes
export const setAuthToken = (token) => {
  if (token) {
    AxiosApi.defaults.headers.common["Authorization"] = `Token ${token}`;
  } else {
    delete AxiosApi.defaults.headers.common["Authorization"];
  }
};

//get jobseeker
export const getUserProfile = async () => {
  const token = localStorage.getItem("token"); 
  const id = localStorage.getItem('userId');
  try {
    console.log("Making request with token:", token);  // Debugging token
    const response = await axios.get(`http://127.0.0.1:8000/user/jobseekers/${id}/`, {
      headers: { 
        Authorization: `Token ${token}` 
      }
    });
    console.log(response.data);
    return response.data; // Returns jobseeker details
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};



//update jobseeker profile
export const updateUserProfile = async (userId, token, formData) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/user/jobseekers/${userId}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Profile Update Error:', error);
    throw error;
  }
};


//get company
export const getCompanyProfile = async (id, token) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/user/companies/${id}/`, {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Token ${token}` 
      }
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return null;
  }
};

//update company
export const updateCompanyProfile = async (id, token, formData) => {
  try {
    const response = await axios.patch(
      `http://127.0.0.1:8000/user/companies/${id}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error('Company Profile Update Error:', error);
    throw error;
  }
};
