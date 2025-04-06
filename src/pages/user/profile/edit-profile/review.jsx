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

const ReviewProfile = () => {
  const { profileData } = useContext(ProfileContext);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = () => {
    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => {
      navigate("/applicant/profile");
    }, 2000);
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
