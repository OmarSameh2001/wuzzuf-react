import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { 
  Button, 
  TextField, 
  Box, 
  Grid, 
  Typography, 
  Paper,
  IconButton,
  Divider
} from "@mui/material";
import { AddCircleOutline, ArrowBack, ArrowForward, Delete } from "@mui/icons-material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditEducation = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [education, setEducation] = useState([...profileData.education]);
  const [errors, setErrors] = useState([]);

  const handleAdd = () => {
    setEducation([
      ...education,
      { degree: "", school: "", fieldOfStudy: "", startDate: "", endDate: "" },
    ]);
    setErrors([...errors, {}]);
  };

  const handleChange = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);

    // Clear error when user types
    if (errors[index]?.[field]) {
      const newErrors = [...errors];
      delete newErrors[index][field];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = education.map(edu => {
      const eduErrors = {};
      if (!edu.degree?.trim()) eduErrors.degree = 'Degree is required';
      if (!edu.school?.trim()) eduErrors.school = 'School is required';
      if (!edu.startDate) eduErrors.startDate = 'Start date is required';
      return eduErrors;
    });

    setErrors(newErrors);
    return !newErrors.some(errorObj => Object.keys(errorObj).length > 0);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateProfile("education", education);
    goToNextStep("applicant/profile/edit-experience");
  };

  const handleBack = () => {
    updateProfile("education", education);
    goToNextStep("/applicant/profile/edit-personal");
  };

  const removeEducation = (index) => {
    const newEducation = education.filter((_, i) => i !== index);
    setEducation(newEducation);
    const newErrors = errors.filter((_, i) => i !== index);
    setErrors(newErrors);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      padding: 3,
      background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <ProfileStepper activeStep={1} />
      
      <Paper elevation={3} sx={{ 
        width: '100%',
        maxWidth: 800,
        padding: 4,
        marginTop: 3,
        borderRadius: 3
      }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            color: '#901b20',
            marginBottom: 3,
            textAlign: 'center',
            fontWeight: 600
          }}
        >
          Edit Education
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSave}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          {education.map((edu, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                padding: 3,
                marginBottom: 3,
                position: 'relative',
                borderLeft: `4px solid #901b20`,
                borderRadius: '8px'
              }}
            >
              <IconButton
                onClick={() => removeEducation(index)}
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8,
                  color: '#901b20'
                }}
              >
                <Delete />
              </IconButton>
              
              <Typography variant="subtitle1" sx={{ color: '#901b20', mb: 2 }}>
                Education #{index + 1}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Degree *"
                    value={edu.degree}
                    onChange={(e) => handleChange(index, "degree", e.target.value)}
                    fullWidth
                    error={!!errors[index]?.degree}
                    helperText={errors[index]?.degree}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="School *"
                    value={edu.school}
                    onChange={(e) => handleChange(index, "school", e.target.value)}
                    fullWidth
                    error={!!errors[index]?.school}
                    helperText={errors[index]?.school}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Field of Study"
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleChange(index, "fieldOfStudy", e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date *"
                    type="date"
                    value={edu.startDate}
                    onChange={(e) => handleChange(index, "startDate", e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors[index]?.startDate}
                    helperText={errors[index]?.startDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Date (or expected)"
                    type="date"
                    value={edu.endDate}
                    onChange={(e) => handleChange(index, "endDate", e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button 
            variant="outlined" 
            onClick={handleAdd}
            startIcon={<AddCircleOutline />}
            sx={{
              color: '#901b20',
              borderColor: '#901b20',
              '&:hover': {
                borderColor: '#7a161b',
                backgroundColor: 'rgba(144, 27, 32, 0.04)'
              },
              alignSelf: 'flex-start'
            }}
          >
            Add Education
          </Button>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              variant="outlined"
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{
                color: '#901b20',
                borderColor: '#901b20',
                '&:hover': {
                  borderColor: '#7a161b',
                  backgroundColor: 'rgba(144, 27, 32, 0.04)'
                }
              }}
            >
              Back
            </Button>
            
            <Button 
              type="submit"
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                backgroundColor: '#901b20',
                padding: '10px 24px',
                '&:hover': {
                  backgroundColor: '#7a161b',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(144, 27, 32, 0.3)'
                }
              }}
            >
              Next: Experience
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditEducation;