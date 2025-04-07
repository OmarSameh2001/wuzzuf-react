import React, { useContext, useState, useRef } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Button, TextField, Avatar, Box, Typography } from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditPersonal = () => {
  const { profileData, updateProfile, goToNextStep } =
    useContext(ProfileContext);
  const [localData, setLocalData] = useState(profileData);
  const personalImageRef = useRef(null); // Separate ref for personal image
  const nationalIdImageRef = useRef(null); // Separate ref for national ID image

  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLocalData({ ...localData, [field]: file });
        updateProfile(field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    personalImageRef.current.click();
  };

  const handleNationalIdClick = () => {
    nationalIdImageRef.current.click();
  };

  const handleSave = () => {
    updateProfile("name", localData.name);
    updateProfile("email", localData.email);
    updateProfile("dob", localData.dob);
    updateProfile("location", localData.location);
    updateProfile("about", localData.about);
    updateProfile("phone", localData.phone);
    updateProfile("national_id", localData.national_id);
    updateProfile("national_id_img", localData.nationalIdImg);
    updateProfile("img", localData.img);
    goToNextStep("applicant/profile/edit-education");
  };

  return (
    <div>
      <ProfileStepper activeStep={0} /> {/* Step 1 */}
      <Box
        sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <h2>Edit Personal Details</h2>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar
            src={localData.img}
            sx={{ width: 80, height: 80, cursor: "pointer" }}
            onClick={handleAvatarClick}
          />
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ margin: 0, cursor: "pointer" }}
            onClick={handleAvatarClick}
          >
            Click to upload Personal image
          </Typography>
          <input
            type="file"
            accept="image/*"
            ref={personalImageRef}
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e, "img")}
          />
        </Box>
        <TextField
          label="Name"
          name="name"
          value={localData.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={localData.email}
          onChange={handleChange}
          fullWidth
          disabled
        />
        <TextField
          label="Date of Birth"
          name="dob"
          type="date"
          value={localData.dob}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Location"
          name="location"
          value={localData.location}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="About"
          name="about"
          value={localData.about}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
        />
        <TextField
          label="Phone Number"
          name="phone"
          value={localData.phone}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="National ID"
          name="nationalId"
          value={localData.nationalId}
          onChange={handleChange}
          fullWidth
        />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <Avatar
            src={localData.nationalIdImg}
            sx={{ width: 160, height: 100, cursor: "pointer", borderRadius: 2 }}
            onClick={handleNationalIdClick}
          />
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ margin: 0, cursor: "pointer" }}
            onClick={handleNationalIdClick}
          >
            Click to upload National ID image
          </Typography>
          <input
            type="file"
            accept="image/*"
            ref={nationalIdImageRef}
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e, "nationalIdImg")}
          />
        </Box>
        <Button variant="contained" onClick={handleSave}>
          Next: Education
        </Button>
      </Box>
    </div>
  );
};

export default EditPersonal;
