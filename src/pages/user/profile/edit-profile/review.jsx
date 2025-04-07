import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import {
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Paper,
  Alert,
} from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { useNavigate } from "react-router-dom";

const PRIMARY_COLOR = "#901b20"; // Updated primary color
import { updateUserProfile } from "../../../../services/Auth";
import { userContext } from "../../../../context/UserContext";

const ReviewProfile = () => {
  const { profileData, setProfileData } = useContext(ProfileContext);
  const {setUser} = useContext(userContext)
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = () => {
    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => {
      navigate("/applicant/profile");
    }, 2000);
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
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <ProfileStepper activeStep={5} /> {/* Last Step */}
      <Typography variant="h4" align="center" gutterBottom sx={{ color: PRIMARY_COLOR }}>
        Review Your Profile
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Profile Image and Basic Info */}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          textAlign: "center",
          marginBottom: 2,
          backgroundColor: "#f5f5ff",
        }}
      >
        <Avatar
          src={profileData.profileImage}
          sx={{
            width: 100,
            height: 100,
            margin: "auto",
            border: `3px solid ${PRIMARY_COLOR}`,
          }}
        />
        <Typography variant="h5" sx={{ marginTop: 1, color: PRIMARY_COLOR }}>
          {profileData.name || "No Name Provided"}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {profileData.email || "No Email Provided"}
        </Typography>
      </Paper>

      {/* Education Section */}
      <Paper elevation={2} sx={{ padding: 2, marginBottom: 2, backgroundColor: "#f5f5ff" }}>
        <Typography variant="h6" sx={{ color: PRIMARY_COLOR }}>
          🎓 Education
        </Typography>
        <List>
          {profileData.education?.length > 0 ? (
            profileData.education.map((edu, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${edu.degree} at ${edu.university}`} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No education details added.
            </Typography>
          )}
        </List>
      </Paper>

      {/* Experience Section */}
      <Paper elevation={2} sx={{ padding: 2, marginBottom: 2, backgroundColor: "#f5f5ff" }}>
        <Typography variant="h6" sx={{ color: PRIMARY_COLOR }}>
          💼 Experience
        </Typography>
        <List>
          {profileData.experience?.length > 0 ? (
            profileData.experience.map((exp, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${exp.title} at ${exp.company}`}
                  secondary={exp.currentlyWorking ? "Currently Working" : `Years: ${exp.years}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No experience details added.
            </Typography>
          )}
        </List>
      </Paper>

      {/* Skills Section */}
      <Paper elevation={2} sx={{ padding: 2, marginBottom: 2, backgroundColor: "#f5f5ff" }}>
        <Typography variant="h6" sx={{ color: PRIMARY_COLOR }}>
          🛠️ Skills
        </Typography>
        <List>
          {profileData.skills?.length > 0 ? (
            profileData.skills.map((skill, index) => (
              <ListItem key={index}>
                <ListItemText primary={skill} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No skills added.
            </Typography>
          )}
        </List>
      </Paper>

      {/* CV Section */}
      <Paper
        elevation={2}
        sx={{ padding: 2, marginBottom: 2, textAlign: "center", backgroundColor: "#f5f5ff" }}
      >
        <Typography variant="h6" sx={{ color: PRIMARY_COLOR }}>
          📄 CV
        </Typography>
        {profileData.cv ? (
          <Typography variant="body1">
            <a
              href={profileData.cv}
              download={profileData.cvName}
              style={{ color: PRIMARY_COLOR, textDecoration: "underline" }}
            >
              Download CV
            </a>
          </Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No CV uploaded.
          </Typography>
        )}
      </Paper>

      {/* Submit Button */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          marginTop: 2,
          backgroundColor: PRIMARY_COLOR,
          "&:hover": { backgroundColor: "#6e1418" },
        }}
        onClick={handleSubmit}
      >
        Submit Profile
      </Button>
    </div>
  );
};

export default ReviewProfile;
