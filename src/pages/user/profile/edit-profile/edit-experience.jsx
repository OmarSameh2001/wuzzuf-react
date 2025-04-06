import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import {
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Checkbox,
  FormControlLabel,
  Typography
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const primaryColor = "#901b20"; // Homepage color
const lightBg = "#fdf1f1"; // Soft matching background tone

const EditExperience = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [experiences, setExperiences] = useState(profileData.experience || []);

  const handleAddExperience = () => {
    setExperiences([...experiences, {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      responsibilities: "",
      currentlyWorking: false
    }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const handleToggleCurrentlyWorking = (index) => {
    const updated = [...experiences];
    updated[index].currentlyWorking = !updated[index].currentlyWorking;
    if (updated[index].currentlyWorking) {
      updated[index].endDate = "";
    }
    setExperiences(updated);
  };

  const handleRemove = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
  };

  const handleSave = () => {
    updateProfile("experience", experiences);
    goToNextStep("/applicant/profile/edit-skills");
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "30px 20px" }}>
      <ProfileStepper activeStep={2} />

      <Typography variant="h4" sx={{ mb: 3, color: primaryColor }}>
        Edit Experience
      </Typography>

      {experiences.map((exp, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            mb: 3,
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)"
          }}
        >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Job Title"
                  value={exp.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& label.Mui-focused": { color: primaryColor },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Company Name"
                  value={exp.company}
                  onChange={(e) => handleChange(index, "company", e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& label.Mui-focused": { color: primaryColor },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    }
                  }}
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
                  variant="outlined"
                  sx={{
                    "& label.Mui-focused": { color: primaryColor },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    }
                  }}
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
                    variant="outlined"
                    sx={{
                      "& label.Mui-focused": { color: primaryColor },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      }
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exp.currentlyWorking}
                      onChange={() => handleToggleCurrentlyWorking(index)}
                      sx={{ color: primaryColor, "&.Mui-checked": { color: primaryColor } }}
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
                  variant="outlined"
                  sx={{
                    "& label.Mui-focused": { color: primaryColor },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign: "right" }}>
                <IconButton onClick={() => handleRemove(index)} sx={{ color: "#dc3545" }}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleAddExperience}
        fullWidth
        sx={{
          color: primaryColor,
          borderColor: primaryColor,
          mb: 2,
          "&:hover": {
            backgroundColor: primaryColor,
            color: "#fff",
            borderColor: primaryColor
          }
        }}
      >
        Add More Experience
      </Button>

      <Button
        variant="contained"
        onClick={handleSave}
        fullWidth
        sx={{
          backgroundColor: primaryColor,
          "&:hover": {
            backgroundColor: "#7d161b"
          }
        }}
      >
        Next: Skills
      </Button>
    </div>
  );
};

export default EditExperience;
