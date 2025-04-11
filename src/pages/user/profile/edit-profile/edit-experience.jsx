import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProfileContext } from "../../../../context/ProfileContext";
import { AxiosApi } from "../../../../services/Api";
import {
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  Divider,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  AddCircleOutline,
  ArrowBack,
  ArrowForward,
  Delete,
  WorkOutline
} from "@mui/icons-material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const employmentTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
  { value: "apprenticeship", label: "Apprenticeship" }
];

const EditExperience = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationUserId = location.state?.userId;
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const userId = locationUserId || profileData?.id;

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]);

  // Fetch experience data
  useEffect(() => {
    if (!userId) {
      navigate("/applicant/profile", { replace: true });
      return;
    }

    const fetchExperience = async () => {
      try {
        const res = await AxiosApi.get(`user/jobseekers/${userId}/`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` }
        });

        const expData = res.data?.experience;
        let parsedExperiences = [];

        if (expData) {
          try {
            parsedExperiences = typeof expData === "string" 
              ? JSON.parse(expData) 
              : expData;
          } catch (err) {
            console.error("Error parsing experience data:", err);
          }
        }

        setExperiences(Array.isArray(parsedExperiences) ? parsedExperiences : []);
        setErrors(new Array(parsedExperiences.length).fill({}));

      } catch (err) {
        console.error("Error fetching experience:", err);
        setError("Failed to load experience data.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [userId, navigate]);

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
        currentlyWorking: false
      }
    ]);
    setErrors([...errors, {}]);
  };

  const handleChange = (index, key, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][key] = value;
    
    // Clear current position end date if marked as current
    if (key === "currentlyWorking" && value) {
      updatedExperiences[index].endDate = "";
    }

    setExperiences(updatedExperiences);

    // Clear validation error
    if (errors[index]?.[key]) {
      const newErrors = [...errors];
      delete newErrors[index][key];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = experiences.map(exp => {
      const expErrors = {};
      if (!exp.title?.trim()) expErrors.title = 'Job title is required';
      if (!exp.company?.trim()) expErrors.company = 'Company name is required';
      if (!exp.startDate) expErrors.startDate = 'Start date is required';
      return expErrors;
    });

    setErrors(newErrors);
    return newErrors.every(err => Object.keys(err).length === 0);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("experience", JSON.stringify(experiences));

      await AxiosApi.patch(`user/jobseekers/${userId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      updateProfile("experience", experiences);
      goToNextStep("/applicant/profile/edit-skills", { userId });
    } catch (err) {
      console.error("Error saving experience:", err);
      setError("Failed to save experience. Please try again.");
    }
  };

  const handleBack = () => {
    updateProfile("experience", experiences);
    goToNextStep("/applicant/profile/edit-education", { userId });
  };

  const removeExperience = (index) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
    setErrors(errors.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
        <span style={{ marginLeft: "10px" }}>Loading experience data...</span>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      padding: 3,
      background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <ProfileStepper activeStep={2} />
      
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
          <WorkOutline sx={{ verticalAlign: 'middle', mr: 1 }} />
          Edit Work Experience
        </Typography>

        <Box component="form" onSubmit={handleSave} sx={{ gap: 3 }}>
          {experiences.map((exp, index) => (
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
                onClick={() => removeExperience(index)}
                sx={{ position: 'absolute', top: 8, right: 8, color: '#901b20' }}
              >
                <Delete />
              </IconButton>
              
              <Typography variant="subtitle1" sx={{ color: '#901b20', mb: 2 }}>
                Experience #{index + 1}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Job Title *"
                    value={exp.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                    fullWidth
                    error={!!errors[index]?.title}
                    helperText={errors[index]?.title}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company Name *"
                    value={exp.company}
                    onChange={(e) => handleChange(index, "company", e.target.value)}
                    fullWidth
                    error={!!errors[index]?.company}
                    helperText={errors[index]?.company}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    value={exp.location}
                    onChange={(e) => handleChange(index, "location", e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Employment Type</InputLabel>
                    <Select
                      value={exp.employmentType}
                      onChange={(e) => handleChange(index, "employmentType", e.target.value)}
                      label="Employment Type"
                    >
                      {employmentTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={exp.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Describe your responsibilities and achievements"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date *"
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => handleChange(index, "startDate", e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors[index]?.startDate}
                    helperText={errors[index]?.startDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={exp.currentlyWorking ? "End Date (current)" : "End Date"}
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleChange(index, "endDate", e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    disabled={exp.currentlyWorking}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exp.currentlyWorking}
                        onChange={(e) => handleChange(index, "currentlyWorking", e.target.checked)}
                        color="primary"
                      />
                    }
                    label="I currently work here"
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button 
            variant="outlined" 
            onClick={handleAddExperience}
            startIcon={<AddCircleOutline />}
            sx={{
              color: '#901b20',
              borderColor: '#901b20',
              '&:hover': { borderColor: '#7a161b', backgroundColor: 'rgba(144, 27, 32, 0.04)' },
              alignSelf: 'flex-start'
            }}
          >
            Add Experience
          </Button>

          <Divider sx={{ my: 2 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              variant="outlined"
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{
                color: '#901b20',
                borderColor: '#901b20',
                '&:hover': { borderColor: '#7a161b', backgroundColor: 'rgba(144, 27, 32, 0.04)' }
              }}
            >
              Back to Education
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
              Continue to Skills
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditExperience;