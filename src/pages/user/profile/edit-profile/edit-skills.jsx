import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { Button, TextField, Chip, Stack, Paper, Typography, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const EditSkills = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [skills, setSkills] = useState(profileData?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill(""); // Reset input field
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = () => {
    updateProfile("skills", skills);
    goToNextStep("/user/profile/edit-cv");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <ProfileStepper activeStep={3} />
      <Typography variant="h5" gutterBottom>Edit Skills</Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          label="Enter a skill"
          variant="outlined"
          size="small"
          fullWidth
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddSkill()} // Add skill on Enter key
        />
        <IconButton color="primary" onClick={handleAddSkill}>
          <Add />
        </IconButton>
      </Stack>

      {skills.length > 0 && (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <Typography variant="subtitle1">Your Skills:</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => handleRemoveSkill(skill)}
                deleteIcon={<Delete />}
                color="primary"
              />
            ))}
          </Stack>
        </Paper>
      )}

      <Button variant="contained" onClick={handleSave} fullWidth sx={{ marginTop: 2 }}>
        Next: CV
      </Button>
    </div>
  );
};

export default EditSkills;
