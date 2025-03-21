import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Button, TextField, Grid, Card, CardContent, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditEducation = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [education, setEducation] = useState([...profileData.education]);

  const handleAdd = () => {
    setEducation([...education, { degree: "", university: "", startDate: "", endDate: "", gpa: "" }]);
  };

  const handleChange = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
  };

  const handleRemove = (index) => {
    const newEducation = education.filter((_, i) => i !== index);
    setEducation(newEducation);
  };

  const handleSave = () => {
    updateProfile("education", education);
    goToNextStep("user/profile/edit-experience");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <ProfileStepper activeStep={1} />
      <h2>Edit Education</h2>

      {education.map((edu, index) => (
        <Card key={index} variant="outlined" sx={{ marginBottom: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  label="Degree" 
                  value={edu.degree} 
                  onChange={(e) => handleChange(index, "degree", e.target.value)} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="University" 
                  value={edu.university} 
                  onChange={(e) => handleChange(index, "university", e.target.value)} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  label="Start Date" 
                  type="date" 
                  InputLabelProps={{ shrink: true }} 
                  value={edu.startDate} 
                  onChange={(e) => handleChange(index, "startDate", e.target.value)} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  label="End Date" 
                  type="date" 
                  InputLabelProps={{ shrink: true }} 
                  value={edu.endDate} 
                  onChange={(e) => handleChange(index, "endDate", e.target.value)} 
                  fullWidth 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="GPA" 
                  type="number" 
                  value={edu.gpa} 
                  onChange={(e) => handleChange(index, "gpa", e.target.value)} 
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

      <Button variant="outlined" startIcon={<Add />} onClick={handleAdd} fullWidth>
        Add More
      </Button>
      <Button variant="contained" onClick={handleSave} fullWidth sx={{ marginTop: 2 }}>
        Next: Experience
      </Button>
    </div>
  );
};

export default EditEducation;
