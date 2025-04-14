import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Typography,
  Avatar,
  Grid,
  Box,
} from "@mui/material";
import { ComProfileContext } from "../../../context/ComProfileContext"; // Use the correct context

const ComProfile = () => {
  const navigate = useNavigate();
  const { profileData, setProfileData } = useContext(ComProfileContext); // Using ComProfileContext here

  useEffect(() => {
    // You can set profileData if needed, or update it here
    setProfileData(profileData); // This may depend on how you fetch and update profileData
  }, [profileData, setProfileData]);

  // Navigation functions
  console.log(profileData.id);
  const goToEditPersonal = () => {
    if (profileData?.id) {
      navigate("/company/profile/edit-personal", { state: { id: profileData.id } });
    } else {
      console.error("No user ID available");
    }
  };

  const goToEditLogo = () => {
    if (profileData?.id) {
      navigate("/applicant/profile/edit-logo", { state: { id: profileData.id } });
    } else {
      console.error("No user ID available");
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh", padding: "20px", justifyContent: "center" }}>
      <Grid item xs={12} md={8}>
        <Card sx={{ padding: "20px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
          {/* Top Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "20px", paddingBottom: "20px", borderBottom: "1px solid #ddd" }}>
            <Avatar src={profileData.img || "/default-avatar.png"} sx={{ width: 100, height: 100 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {profileData.name || "Your Name"}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {profileData.est || "Add a headline or summary about your establishment"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {profileData.location || "Not provided"}
              </Typography>
              <Button variant="outlined" color="primary" onClick={goToEditPersonal} sx={{ mt: 1 }}>
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
                  Industry
                </Typography>
                <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>
                  {profileData.industry || "No industry specified"}
                </Typography>
                <Button variant="text" color="primary" onClick={goToEditLogo} sx={{ mt: 1 }}>
                  Edit Logo
                </Button>
              </Card>

              <Card sx={{ mb: 2, padding: "15px" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Contact Information
                </Typography>
                <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>
                  Phone Number: {profileData.phone_number || "No phone number provided"}
                </Typography>
                <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>
                  Email: {profileData.email || "No email provided"}
                </Typography>
                <Button variant="text" color="primary" onClick={goToEditPersonal} sx={{ mt: 1 }}>
                  Edit Contact Info
                </Button>
              </Card>
            </Grid>

            {/* Right Side */}
            <Grid item xs={12} md={6}>
              <Card sx={{ padding: "15px" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Logo
                </Typography>
                {profileData.logo ? (
                  <img src={profileData.logo} alt="Logo" style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }} />
                ) : (
                  <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>No logo uploaded</Typography>
                )}
                <Button variant="text" color="primary" onClick={goToEditLogo} sx={{ mt: 1 }}>
                  Edit Logo
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ComProfile;
