import React, { useContext } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Button, Typography, Avatar, List, ListItem, ListItemText, Box } from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../../../services/Auth";
import { userContext } from "../../../../context/UserContext";

const ReviewProfile = () => {
  const { profileData, setProfileData } = useContext(ProfileContext);
  const {setUser} = useContext(userContext)
  const navigate = useNavigate();
  // console.log(profileData);
  const handleSubmit = async () => {
    try {
    const profileFormData = new FormData();
    profileFormData.append("name", profileData.name);
    profileFormData.append("email", profileData.email);
    profileFormData.append("phone", profileData.phone || "");
    profileFormData.append("location", profileData.location || "");
    profileFormData.append("dob", profileData.dob || "");
    profileFormData.append("about", profileData.about || "");
    profileFormData.append("national_id", profileData.national_id || "");
    profileFormData.append("national_id_img", profileData.national_id_img || "");
    profileFormData.append("img", profileData.img || "");
    profileFormData.append("education", JSON.stringify(profileData.education || []));
    profileFormData.append("experience", JSON.stringify(profileData.experience || []));
    profileFormData.append("skills", JSON.stringify(profileData.skills || []));
    profileFormData.append("cv", profileData.cv || "");

    profileFormData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    const response = await updateUserProfile(profileData.id,profileFormData);
    console.log(response);
    const parsedResponse = {
      ...response.data,
      skills: safeParseJSON(response.data.skills, []),
      education: safeParseJSON(response.data.education, []),
      experience: safeParseJSON(response.data.experience, []),
    };
    setUser(parsedResponse)
    setProfileData(parsedResponse); // Update the profile data in context
    navigate("/applicant/profile"); // ✅ Redirect to the user profile page
    
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };
  const safeParseJSON = (json, fallback) => {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  };

  return (
    <div>
      <ProfileStepper activeStep={5} /> {/* Last Step */}
      <h2>Review Your Profile</h2>
      
      <Avatar src={profileData.img} sx={{ width: 100, height: 100, marginLeft:3 }} />

      <h3>Personal Information</h3>
      <Typography variant="body1">Name: {profileData.name}</Typography>
      <Typography variant="body1">Email: {profileData.email}</Typography>
      <Typography variant="body1">Phone: {profileData.phone || "Not provided"}</Typography>
      <Typography variant="body1">Location: {profileData.location || "Not provided"}</Typography>
      <Typography variant="body1">Date of Birth: {profileData.dob || "Not provided"}</Typography>
      <Typography variant="body1">About: {profileData.about || "Not provided"}</Typography>
      <Typography variant="body1">National ID: {profileData.national_id || "Not provided"}</Typography>
      {profileData.national_id_img ? (
        <Typography variant="body1">
          <Avatar src={profileData.national_id_img} sx={{ width: 100, height: 100, borderRadius: 2, marginLeft:3 }} />
        </Typography>
      ) : (
        <Typography variant="body1">National ID Image: Not provided</Typography>
      )}

      <h3>Education</h3>
      {profileData.education && profileData.education.length > 0 ? (
        profileData.education.map((edu, index) => (
          <Typography key={index} variant="body1">
            {`${edu.degree} Degree from ${edu.school} majoring ${edu.fieldOfStudy} from ${edu.startDate} to ${edu.endDate}`}
          </Typography>
        ))
      ) : (
        <Typography variant="body1">No education data available</Typography>
      )}

      <h3>Experience</h3>
      {profileData.experience && profileData.experience.length > 0 ? (
        profileData.experience.map((exp, index) => (
          <Typography key={index} variant="body1">
            {`${exp.jobTitle} at ${exp.company}`}
          </Typography>
        ))
      ) : (
        <Typography variant="body1">No experience data available</Typography>
      )}

      <h3>Skills</h3>
      
      <Box sx={{ display: "flex", gap: 1 }}>
      {profileData.skills && profileData.skills.length > 0 ? (
        profileData.skills.map((skill, index) => (
          <Typography key={index} variant="body1">
            {skill}
          </Typography>
        ))
      ) : (
        <Typography variant="body1">No skills data available</Typography>
      )}
      </Box>

      <h3>CV</h3>
      {profileData.cv ? <p>CV Uploaded: {profileData.cv.name || <a href={profileData.cv} target="_blank">view</a>}</p> : <p>No CV uploaded</p>}

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit Profile
      </Button>
    </div>
  );
};

export default ReviewProfile;
