import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { Button, TextField, Chip, Stack, Paper, Typography, IconButton, Box } from "@mui/material";
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
    goToNextStep("/applicant/profile/edit-cv");
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <ProfileStepper activeStep={3} />
      <Typography variant="h5" gutterBottom>Edit Skills</Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <TextField
          label="Enter a skill"
          variant="outlined"
          size="small"
          fullWidth
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddSkill}
          sx={{
            backgroundColor: "#901b20",
            "&:hover": {
              backgroundColor: "#7e181c",
            },
            whiteSpace: "nowrap",
            height: "40px",
            minWidth: "100px",
          }}
        >
          Add
        </Button>
      </Stack>

      {skills.length > 0 && (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Your Skills:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => handleRemoveSkill(skill)}
                deleteIcon={<Delete />}
                sx={{
                  backgroundColor: "#901b20",
                  color: "#fff",
                  "& .MuiChip-deleteIcon": {
                    color: "#fff",
                  },
                  "&:hover": {
                    backgroundColor: "#7e181c",
                  },
                  mb: 1,
                }}
              />
            ))}
          </Stack>
        </Paper>
      )}

      <Button
        variant="contained"
        onClick={handleSave}
        fullWidth
        sx={{
          marginTop: 3,
          backgroundColor: "#901b20",
          "&:hover": {
            backgroundColor: "#7e181c",
          },
        }}
      >
        Next: CV
      </Button>
    </Box>
  );
};

export default EditSkills;
