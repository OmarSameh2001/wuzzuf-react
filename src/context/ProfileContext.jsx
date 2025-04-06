import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    profileImage: "",
    education: "",
    experience: "",
    skills: "",
    cv: "",
    dob: "",
    id: "",
    img: "",
    location: "",
    national_id: "",
    national_id_img: "",
    phone_number: "",
  });

  const updateProfile = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const goToNextStep = (nextPath) => {
    navigate(nextPath);
  };

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData, updateProfile, goToNextStep }}>
      {children}
    </ProfileContext.Provider>
  );
};
