import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Button, TextField, Box, Grid } from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditExperience = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [experiences, setExperiences] = useState(profileData.experience || []);

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        title: "",
        company: "",
        location: "",
        description: "",
        employmentType: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const handleChange = (index, key, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][key] = value;
    setExperiences(updatedExperiences);
  };

  const handleSave = () => {
    updateProfile("experience", experiences);
    goToNextStep("/applicant/profile/edit-skills");
  };
  const handleBack = () => {
    updateProfile("experience", experiences);
    goToNextStep("/applicant/profile/edit-education");
  };

  return (
    <div>
      <ProfileStepper activeStep={2} />
      <h2>Edit Experience</h2>
      <Box sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {experiences.map((exp, index) => (
          <Box
            key={index}
            sx={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: 3,
              marginBottom: 2,
              position: "relative",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                const newExperiences = experiences.filter((_, i) => i !== index);
                setExperiences(newExperiences);
              }}
              sx={{ position: "absolute", top: 0, right: 0, padding: 0 }}
            >
              X
            </Button>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Title"
                  value={exp.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company Name"
                  value={exp.company}
                  onChange={(e) => handleChange(index, "company", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company Location"
                  value={exp.location}
                  onChange={(e) => handleChange(index, "location", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  // label="Employment Type"
                  select
                  SelectProps={{ native: true }}
                  value={exp.employmentType}
                  onChange={(e) => handleChange(index, "employmentType", e.target.value)}
                  fullWidth
                >
                  {/* <option value="">Select Employment Type</option> */}
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="freelance">Freelance</option>
                  <option value="intern">Intern</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={exp.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => handleChange(index, "startDate", e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Date"
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => handleChange(index, "endDate", e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button variant="outlined" onClick={handleAddExperience}>
          Add More
        </Button>
        <Button variant="outlined" onClick={handleBack}>
          Back: Education
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Next: Skills
        </Button>
      </Box>
    </div>
  );
};

export default EditExperience;
