import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Button, TextField, Box, Grid } from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditEducation = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [education, setEducation] = useState([...profileData.education]);

  const handleAdd = () => {
    setEducation([
      ...education,
      { degree: "", school: "", fieldOfStudy: "", startDate: "", endDate: "" },
    ]);
  };

  const handleChange = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
  };

  const handleSave = () => {
    updateProfile("education", education);
    goToNextStep("applicant/profile/edit-experience");
  };
  const handleBack = () => {
    updateProfile("education", education);
    goToNextStep("/applicant/profile/edit-personal");
  };

  return (
    <div>
      <ProfileStepper activeStep={1} /> {/* Step 2 */}
      <h2>Edit Education</h2>
      <Box sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {education.map((edu, index) => (
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
                const newEducation = education.filter((_, i) => i !== index);
                setEducation(newEducation);
              }}
              sx={{ position: "absolute", top: 0, right: 0, padding: 0 }}
            >X</Button>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) => handleChange(index, "degree", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="School"
                  value={edu.school}
                  onChange={(e) => handleChange(index, "school", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Field of Study"
                  value={edu.fieldOfStudy}
                  onChange={(e) =>
                    handleChange(index, "fieldOfStudy", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={edu.startDate}
                  onChange={(e) => handleChange(index, "startDate", e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Date"
                  type="date"
                  value={edu.endDate}
                  onChange={(e) => handleChange(index, "endDate", e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button variant="outlined" onClick={handleAdd}>
          Add More
        </Button>
        <Button variant="outlined" onClick={handleBack}>
          Back: Personal Info
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Next: Experience
        </Button>
      </Box>
    </div>
  );
};

export default EditEducation;
