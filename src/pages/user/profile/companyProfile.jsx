import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";  
import { Button, Card, CardContent, Typography, Avatar, Grid } from "@mui/material";
import { ProfileContext } from "../../../context/ProfileContext";  

const CompanyProfile = () => {
  const navigate = useNavigate();  
  const { profileData } = useContext(ProfileContext); // ✅ Get updated profile data

  // Navigation functions
  const goToEditEducation = () => navigate("/applicant/profile/edit-education");
  const goToEditExperience = () => navigate("/applicant/profile/edit-experience");
  const goToEditSkills = () => navigate("/applicant/profile/edit-skills");
  const goToEditCV = () => navigate("/applicant/profile/edit-cv");

  return (
    <Grid container sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card sx={{ width: "80%", maxWidth: "900px", height: "90vh", overflowY: "auto", padding: "20px" }}>
        {/* Top Section */}
        <div>companyyyyyyyyyyyyyyyyyyyyyyyyyyyyy</div>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={profileData.profileImage} sx={{ width: 100, height: 100, mr: 2 }} />
            <Typography variant="h5">{profileData.name}</Typography>
          </Grid>
          <Button variant="contained" color="primary" onClick={() => navigate("/applicant/profile/edit-personal")}>
            Edit Profile
          </Button>
        </Grid>

        {/* Main Section */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {/* Left Side (Details) */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Education</Typography>
                {profileData.education.length > 0 ? (
                  profileData.education.map((edu, index) => (
                    <Typography key={index}>{`${edu.degree} at ${edu.university}`}</Typography>
                  ))
                ) : (
                  <Typography>No education added</Typography>
                )}
                <Button variant="outlined" color="primary" onClick={goToEditEducation} sx={{ mt: 1 }}>
                  Edit Education
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Experience</Typography>
                {profileData.experience.length > 0 ? (
                  profileData.experience.map((exp, index) => (
                    <Typography key={index}>{`${exp.jobTitle} at ${exp.company}`}</Typography>
                  ))
                ) : (
                  <Typography>No experience added</Typography>
                )}
                <Button variant="outlined" color="primary" onClick={goToEditExperience} sx={{ mt: 1 }}>
                  Edit Experience
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Skills</Typography>
                {profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, index) => <Typography key={index}>{skill}</Typography>)
                ) : (
                  <Typography>No skills added</Typography>
                )}
                <Button variant="outlined" color="primary" onClick={goToEditSkills} sx={{ mt: 1 }}>
                  Edit Skills
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side (CV Upload & Display) */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">CV</Typography>
                {profileData.cv ? (
                  <a href={profileData.cv} target="_blank" rel="noopener noreferrer">
                    View CV
                  </a>
                ) : (
                  <Typography>No CV uploaded</Typography>
                )}
                <Button variant="outlined" color="primary" onClick={goToEditCV} sx={{ mt: 1 }}>
                  Edit CV
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default CompanyProfile;
