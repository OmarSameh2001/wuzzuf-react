import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import { ProfileContext } from "../../../context/ProfileContext";
import { userContext } from "../../../context/UserContext";

const UserProfile = () => {
  const navigate = useNavigate();
  const { profileData, setProfileData } = useContext(ProfileContext);
  const { user } = useContext(userContext);
  console.log(profileData);

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  // Navigation functions
  const goToEditEducation = () => navigate("/applicant/profile/edit-education");
  const goToEditExperience = () =>
    navigate("/applicant/profile/edit-experience");
  const goToEditSkills = () => navigate("/applicant/profile/edit-skills");
  const goToEditCV = () => navigate("/applicant/profile/edit-cv");
  const goToEditPersonal = () => navigate("/applicant/profile/edit-personal");

  if (profileData)
    return (
      <Grid
        container
        sx={{
          // backgroundColor: "rgba(86, 0, 0, 0.8)",
          minHeight: "100vh",
          padding: "20px",
          justifyContent: "center",
        }}
      >
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Top Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                paddingBottom: "20px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <Avatar
                src={profileData.img || "/default-avatar.png"}
                sx={{ width: 100, height: 100 }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {profileData.name || "Your Name"}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {profileData.about ||
                    "Add a headline or summary about yourself"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {profileData.location || "Not provided"}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={goToEditPersonal}
                  sx={{ mt: 1 }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>

            {/* Main Section */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Left Side */}
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 2, padding: "15px" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Education
                  </Typography>
                  {profileData.education && profileData.education.length > 0 ? (
                    profileData.education.map((edu, index) => (
                      <Typography
                        key={index}
                        sx={{ marginTop: "10px", fontSize: "14px" }}
                      >
                        <strong>{edu.degree}</strong> at {edu.school} majoring{" "}
                        {edu.fieldOfStudy} from {edu.startDate} to {edu.endDate}
                      </Typography>
                    ))
                  ) : (
                    <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>
                      No education added
                    </Typography>
                  )}
                  <Button
                    variant="text"
                    color="primary"
                    onClick={goToEditEducation}
                    sx={{ mt: 1 }}
                  >
                    Edit Education
                  </Button>
                </Card>

                <Card sx={{ mb: 2, padding: "15px" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Experience
                  </Typography>
                  {profileData.experience &&
                  profileData.experience.length > 0 ? (
                    profileData.experience.map((exp, index) => (
                      <Typography
                        key={index}
                        sx={{ marginTop: "10px", fontSize: "14px" }}
                      >
                        <strong>{exp.jobTitle}</strong> at {exp.company}
                      </Typography>
                    ))
                  ) : (
                    <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>
                      No experience added
                    </Typography>
                  )}
                  <Button
                    variant="text"
                    color="primary"
                    onClick={goToEditExperience}
                    sx={{ mt: 1 }}
                  >
                    Edit Experience
                  </Button>
                </Card>
              </Grid>

              {/* Right Side */}
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 2, padding: "15px" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {profileData.skills && profileData.skills.length > 0 ? (
                      profileData.skills.map((skill, index) => (
                        <Typography
                          key={index}
                          sx={{ marginTop: "10px", fontSize: "14px" }}
                        >
                          {skill}
                        </Typography>
                      ))
                    ) : (
                      <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>
                        No skills added
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={goToEditSkills}
                    sx={{ mt: 1 }}
                  >
                    Edit Skills
                  </Button>
                </Card>

                <Card sx={{ padding: "15px" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    CV
                  </Typography>
                  {profileData.cv ? (
                    <a
                      href={profileData.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        marginTop: "10px",
                        fontSize: "14px",
                        color: "#0073b1",
                        textDecoration: "none",
                      }}
                    >
                      View CV
                    </a>
                  ) : (
                    <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>
                      No CV uploaded
                    </Typography>
                  )}
                  <Button
                    variant="text"
                    color="primary"
                    onClick={goToEditCV}
                    sx={{ mt: 1 }}
                  >
                    Edit CV
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    );

  return null;
};

export default UserProfile;
