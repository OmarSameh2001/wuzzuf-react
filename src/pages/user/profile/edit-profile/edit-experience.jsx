import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Button, TextField, Grid, Card, CardContent, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditExperience = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [experiences, setExperiences] = useState(profileData.experience || []);

  const handleAddExperience = () => {
    setExperiences([...experiences, { title: "", company: "", startDate: "", endDate: "", responsibilities: "", currentlyWorking: false }]);
  };

  const handleChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value;
    setExperiences(updatedExperiences);
  };

  const handleToggleCurrentlyWorking = (index) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index].currentlyWorking = !updatedExperiences[index].currentlyWorking;
    if (updatedExperiences[index].currentlyWorking) {
      updatedExperiences[index].endDate = "";
    }
    setExperiences(updatedExperiences);
  };

  const handleRemove = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };

  const handleSave = () => {
    updateProfile("experience", experiences);
    goToNextStep("/user/profile/edit-skills");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <ProfileStepper activeStep={2} />
      <h2>Edit Experience</h2>

      {experiences.map((exp, index) => (
        <Card key={index} variant="outlined" sx={{ marginBottom: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  label="Job Title" 
                  value={exp.title} 
                  onChange={(e) => handleChange(index, "title", e.target.value)} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Company Name" 
                  value={exp.company} 
                  onChange={(e) => handleChange(index, "company", e.target.value)} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  label="Start Date" 
                  type="date" 
                  InputLabelProps={{ shrink: true }} 
                  value={exp.startDate} 
                  onChange={(e) => handleChange(index, "startDate", e.target.value)} 
                  fullWidth 
                />
              </Grid>
              {!exp.currentlyWorking && (
                <Grid item xs={6}>
                  <TextField 
                    label="End Date" 
                    type="date" 
                    InputLabelProps={{ shrink: true }} 
                    value={exp.endDate} 
                    onChange={(e) => handleChange(index, "endDate", e.target.value)} 
                    fullWidth 
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={exp.currentlyWorking} 
                      onChange={() => handleToggleCurrentlyWorking(index)} 
                    />
                  }
                  label="Currently Working Here"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Responsibilities" 
                  multiline 
                  rows={3} 
                  value={exp.responsibilities} 
                  onChange={(e) => handleChange(index, "responsibilities", e.target.value)} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign: "right" }}>
                <IconButton onClick={() => handleRemove(index)} color="error">
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button variant="outlined" startIcon={<Add />} onClick={handleAddExperience} fullWidth>
        Add More Experience
      </Button>
      <Button variant="contained" onClick={handleSave} fullWidth sx={{ marginTop: 2 }}>
        Next: Skills
      </Button>
    </div>
  );
};

export default EditExperience;
