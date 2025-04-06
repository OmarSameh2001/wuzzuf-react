import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import {
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditEducation = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [education, setEducation] = useState([...profileData.education]);

  const handleAdd = () => {
    setEducation([
      ...education,
      { degree: "", university: "", startDate: "", endDate: "", gpa: "" },
    ]);
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
    goToNextStep("/applicant/profile/edit-experience");
  };

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "auto",
        padding: { xs: "20px", sm: "40px" },
      }}
    >
      <ProfileStepper activeStep={1} />
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
        Education
      </Typography>

      {education.map((edu, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            mb: 3,
            boxShadow: 2,
            borderRadius: 2,
            borderColor: "#ccc",
          }}
        >
          <CardContent>
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
                  label="University"
                  value={edu.university}
                  onChange={(e) =>
                    handleChange(index, "university", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={edu.startDate}
                  onChange={(e) =>
                    handleChange(index, "startDate", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={edu.endDate}
                  onChange={(e) =>
                    handleChange(index, "endDate", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="GPA"
                  type="number"
                  inputProps={{ step: "0.01", min: "0", max: "4" }}
                  value={edu.gpa}
                  onChange={(e) => handleChange(index, "gpa", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <IconButton
                  onClick={() => handleRemove(index)}
                  color="error"
                  size="large"
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAdd}
            fullWidth
            sx={{
              textTransform: "none",
              borderColor: "#901b20",
              color: "#901b20",
              "&:hover": {
                backgroundColor: "#f8e5e5",
                borderColor: "#a8242a",
              },
            }}
          >
            Add More
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            onClick={handleSave}
            fullWidth
            sx={{
              textTransform: "none",
              backgroundColor: "#901b20",
              "&:hover": {
                backgroundColor: "#a8242a",
              },
            }}
          >
            Next: Experience
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditEducation;
