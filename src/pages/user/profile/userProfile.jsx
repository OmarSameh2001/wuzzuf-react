import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography, Avatar, Grid, TextField } from "@mui/material";
import { ProfileContext } from "../../../context/ProfileContext";
import { updateUserProfile } from "../../../services/api";

const UserProfile = () => {
    const navigate = useNavigate();
    const { profileData } = useContext(ProfileContext); // ✅ Get updated profile data
    
    const [formData, setFormData] = useState({
      name: "",
      dob: "",
      education: "",
      experience: "",
      location: "",
      phone_number: "",
      skills: "",
      national_id: "",
      cv: null,
      img: null,
      national_id_img: null,
  });

  // ✅ Sync formData with profileData when profileData updates
  useEffect(() => {
    console.log("Profile Data:", profileData); // Check if profileData.id exists
    const id = localStorage.getItem("userId");

      setFormData({
          name: profileData.name || "",
          dob: profileData.dob || "",
          education: profileData.education || "",
          experience: profileData.experience || "",
          location: profileData.location || "",
          phone_number: profileData.phone_number || "",
          skills: profileData.skills || "",
          national_id: profileData.national_id || "",
          cv: null, // Files are set separately
          img: null,
          national_id_img: null,
      });
  }, [profileData]); // Runs when profileData updates

    // Handle input changes for text fields
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file uploads (CV, Profile Image, National ID Image)
    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    // Handle form submission
    const handleUpdateProfile = async () => {
      // Get the token from localStorage
      const token = localStorage.getItem("token"); // or sessionStorage or any other method you're using
      const id = localStorage.getItem('userId');
      console.log(token);
      console.log(id);
      // if (!profileData || !profileData.id) {
      //   console.error("User ID is missing, cannot update profile.");
      //   return;
      // }

      // if (!token) {
      //   alert("You are not logged in. Please log in.");
      //   return; // Stop execution if no token exists
      // }
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      try {
        await updateUserProfile(id, token, data);
        updateProfileData(response); // ✅ Update the context with new data
        alert("Profile updated successfully!");
      } catch (error) {
        alert("Failed to update profile.");
      }
    };

    return (
        <Grid container sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Card sx={{ width: "80%", maxWidth: "900px", height: "90vh", overflowY: "auto", padding: "20px" }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={profileData.img} sx={{ width: 100, height: 100, mr: 2 }} />
                        <Typography variant="h5">{profileData.name}</Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">Personal Information</Typography>
                                <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleInputChange} sx={{ mt: 2 }} />
                                <TextField fullWidth label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} sx={{ mt: 2 }} />
                                <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleInputChange} sx={{ mt: 2 }} />
                                <TextField fullWidth label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} sx={{ mt: 2 }} />
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">Education & Experience</Typography>
                                <TextField fullWidth label="Education" name="education" value={formData.education} onChange={handleInputChange} sx={{ mt: 2 }} />
                                <TextField fullWidth label="Experience" name="experience" value={formData.experience} onChange={handleInputChange} sx={{ mt: 2 }} />
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">Skills</Typography>
                                <TextField fullWidth label="Skills (comma-separated)" name="skills" value={formData.skills} onChange={handleInputChange} sx={{ mt: 2 }} />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Documents</Typography>

                                {/* Profile Image Upload */}
                                <Typography>Profile Image</Typography>
                                <input type="file" name="img" onChange={handleFileChange} accept="image/*" />

                                {/* National ID Upload */}
                                <Typography>National ID</Typography>
                                <TextField fullWidth label="National ID" name="national_id" value={formData.national_id} onChange={handleInputChange} sx={{ mt: 2 }} />
                                <Typography>National ID Image</Typography>
                                <input type="file" name="national_id_img" onChange={handleFileChange} accept="image/*" />

                                {/* CV Upload */}
                                <Typography sx={{ mt: 2 }}>CV Upload</Typography>
                                <input type="file" name="cv" onChange={handleFileChange} accept=".pdf,.doc,.docx" />

                                <Button variant="contained" color="primary" onClick={handleUpdateProfile} sx={{ mt: 3 }}>
                                    Update Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    );
};

export default UserProfile;
