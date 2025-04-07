import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { Button, TextField, Box, Chip, Grid } from "@mui/material";

const EditSkills = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [skills, setSkills] = useState(profileData?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
  };

  const handleSave = () => {
    updateProfile("skills", skills); // ✅ Correct function from ProfileContext
    goToNextStep("/applicant/profile/edit-cv"); // ✅ Correct navigation function
  };
  const handleBack = () => {
    updateProfile("skills", skills); // ✅ Correct function from ProfileContext
    goToNextStep("/applicant/profile/edit-experience"); // ✅ Correct navigation function
  }

  return (
    <div>
      <ProfileStepper activeStep={3} />
      <h2>Edit Skills</h2>
      <Box sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Enter a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              fullWidth
              color={skills.includes(newSkill) ? "error" : "primary"}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" onClick={handleAddSkill} disabled={!newSkill || skills.includes(newSkill) || skills.length > 9}>
              + Add Skill
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => handleDeleteSkill(skill)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
        <Button variant="outlined" onClick={handleBack}>
          Back: Experience
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Next: CV
        </Button>
      </Box>
    </div>
  );
};

export default EditSkills;
