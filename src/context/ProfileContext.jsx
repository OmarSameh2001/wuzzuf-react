import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../services/api"; 

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    dob: "",
    education: "",
    experience: "",
    location: "",
    phone_number: "",
    skills: "",
    national_id: "",
    cv: null,
    img: "",
    national_id_img: "",
});

useEffect(() => {
  const fetchProfile = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await getUserProfile(token);
        console.log("Fetched API Response:", data); // Log the full response

        setProfileData(data); // Store the response as-is
    } catch (error) {
        console.error("Failed to fetch profile", error);
    }

};


  fetchProfile();
}, []);


  const updateProfile = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const goToNextStep = (nextPath) => {
    navigate(nextPath);
  };

  return (
    <ProfileContext.Provider value={{ profileData, updateProfile, goToNextStep }}>
      {children}
    </ProfileContext.Provider>
  );
};
