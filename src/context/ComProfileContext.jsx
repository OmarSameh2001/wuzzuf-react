import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export const ComProfileContext = createContext();

export const ComProfileProvider = ({ children }) => {

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); // Get token
      if (!token) {
        console.warn("No token found. User might not be logged in.");
        return;
      }
      try {
        const response = await axios.get(`http://127.0.0.1:8000/user/profile/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setProfileData(response.data); // Make sure 'id' is included
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };
  
    fetchProfile();
  }, []);
  
  
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    profileImage: "",
    est: "",
    id: "",
    img: "",
    location: "",
    phone_number: "",
    industry: "",
    logo: ""
  });

  const updateProfile = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // const goToNextStep = (nextPath) => {
  //   navigate(nextPath);
  // };
  const goToNextStep = (path, state = {}) => {
    navigate(path, { state });
  };
  

  return (
    <ComProfileContext.Provider value={{ profileData, setProfileData, updateProfile, goToNextStep }}>
      {children}
    </ComProfileContext.Provider>
  );
};
