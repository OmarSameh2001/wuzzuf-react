import React, { useContext, useState, useEffect } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Button, TextField, Box, Grid, CircularProgress, Alert } from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { useParams } from "react-router-dom";
import { AxiosApi } from "../../../../services/Api";
import { useLocation } from "react-router-dom";

const EditEducation = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]); // Added validation errors state

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await AxiosApi.get(`user/jobseekers/${userId}/`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });

        const eduData = response.data?.education;
        
        if (!eduData) {
          setEducation([]);
          setErrors([]);
        } else if (Array.isArray(eduData) && typeof eduData[0] === "string") {
          const parsed = JSON.parse(eduData[0]);
          setEducation(parsed);
          setErrors(new Array(parsed.length).fill({}));
        } else if (Array.isArray(eduData)) {
          setEducation(eduData);
          setErrors(new Array(eduData.length).fill({}));
        } else if (typeof eduData === "string") {
          const parsed = JSON.parse(eduData);
          setEducation(parsed);
          setErrors(new Array(parsed.length).fill({}));
        } else {
          setEducation([]);
          setErrors([]);
        }

      } catch (err) {
        console.error("Error fetching education data:", err);
        setError(`Failed to load education data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [userId]);

  const handleAdd = () => {
    setEducation([
      ...education,
      { degree: "", school: "", fieldOfStudy: "", startDate: "", endDate: "" },
    ]);
    setErrors([...errors, {}]); // Initialize errors for new entry
  };

  const handleChange = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);

    // Clear error for the modified field
    if (errors[index]?.[field]) {
      const newErrors = [...errors];
      delete newErrors[index][field];
      setErrors(newErrors);
    }
  };

  const validateFields = () => {
    const newErrors = education.map(edu => {
      const errs = {};
      if (!edu.degree) errs.degree = 'Degree is required';
      if (!edu.school) errs.school = 'School is required';
      if (!edu.startDate) errs.startDate = 'Start date is required';
      return errs;
    });
    
    setErrors(newErrors);
    return newErrors.every(err => Object.keys(err).length === 0);
  };

  const handleSave = async () => {
    if (!validateFields()) {
      setError('Please fix validation errors before submitting');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('education', JSON.stringify(education));
      
      await AxiosApi.patch(
        `user/jobseekers/${userId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      goToNextStep(`/applicant/profile`, { userId });
    } catch (err) {
      console.error("Error updating education:", err);
      setError("Failed to save education data");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
        <span style={{ marginLeft: '10px' }}>Loading education data...</span>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  return (
    <div>
      <h2>Edit Education</h2>
      <Box sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {education.map((edu, index) => (
          <Box key={index} sx={{ border: "1px solid #ccc", borderRadius: "8px", padding: 3, marginBottom: 2, position: "relative" }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                const newEducation = education.filter((_, i) => i !== index);
                setEducation(newEducation);
                const newErrors = errors.filter((_, i) => i !== index);
                setErrors(newErrors);
              }}
              sx={{ position: "absolute", top: 0, right: 0, padding: 0 }}
            >
              X
            </Button>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Degree"
                  value={edu.degree || ""}
                  onChange={(e) => handleChange(index, "degree", e.target.value)}
                  error={!!errors[index]?.degree}
                  helperText={errors[index]?.degree}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="School"
                  value={edu.school || ""}
                  onChange={(e) => handleChange(index, "school", e.target.value)}
                  error={!!errors[index]?.school}
                  helperText={errors[index]?.school}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Field of Study"
                  value={edu.fieldOfStudy || ""}
                  onChange={(e) => handleChange(index, "fieldOfStudy", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={edu.startDate || ""}
                  onChange={(e) => handleChange(index, "startDate", e.target.value)}
                  error={!!errors[index]?.startDate}
                  helperText={errors[index]?.startDate}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Date"
                  type="date"
                  value={edu.endDate || ""}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" onClick={handleSave}>
            Submit Education
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </div>
  );
};

export default EditEducation;