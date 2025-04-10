import React, { useContext, useState, useRef } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { 
  Button, 
  TextField, 
  Avatar, 
  Box, 
  Typography, 
  Paper,
  InputAdornment,
  IconButton
} from "@mui/material";
import { CameraAlt, InsertPhoto } from "@mui/icons-material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditPersonal = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [localData, setLocalData] = useState(profileData);
  const personalImageRef = useRef(null);
  const nationalIdImageRef = useRef(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData({ ...localData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!localData.name?.trim()) newErrors.name = 'Name is required';
    if (!localData.email?.trim()) newErrors.email = 'Email is required';
    if (!localData.dob) newErrors.dob = 'Date of birth is required';
    if (!localData.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!localData.nationalId?.trim()) newErrors.nationalId = 'National ID is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setErrors(prev => ({ ...prev, [field]: 'Please upload an image file' }));
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setErrors(prev => ({ ...prev, [field]: 'Image must be less than 2MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setLocalData({ ...localData, [field]: file });
        updateProfile(field, reader.result);
        setErrors(prev => ({ ...prev, [field]: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => personalImageRef.current.click();
  const handleNationalIdClick = () => nationalIdImageRef.current.click();

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateProfile("name", localData.name);
    updateProfile("email", localData.email);
    updateProfile("dob", localData.dob);
    updateProfile("location", localData.location);
    updateProfile("about", localData.about);
    updateProfile("phone", localData.phone);
    updateProfile("national_id", localData.nationalId);
    updateProfile("national_id_img", localData.nationalIdImg);
    updateProfile("img", localData.img);
    goToNextStep("applicant/profile/edit-education");
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
      <ProfileStepper activeStep={0} />
      
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
          Edit Personal Details
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSave}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          {/* Profile Image Upload */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            marginBottom: 2
          }}>
            <IconButton onClick={handleAvatarClick} sx={{ padding: 0 }}>
              <Avatar
                src={localData.img}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: '3px solid #901b20',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              />
            </IconButton>
            <Typography
              variant="caption"
              sx={{ 
                marginTop: 1,
                color: '#901b20',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
              onClick={handleAvatarClick}
            >
              <CameraAlt fontSize="small" /> Upload Profile Photo
            </Typography>
            {errors.img && (
              <Typography color="error" variant="caption">{errors.img}</Typography>
            )}
            <input
              type="file"
              accept="image/*"
              ref={personalImageRef}
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e, "img")}
            />
          </Box>

          {/* Personal Details Form */}
          <TextField
            label="Full Name"
            name="name"
            value={localData.name || ''}
            onChange={handleChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Email"
            name="email"
            value={localData.email || ''}
            onChange={handleChange}
            fullWidth
            disabled
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            value={localData.dob || ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.dob}
            helperText={errors.dob}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Location"
            name="location"
            value={localData.location || ''}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="About"
            name="about"
            value={localData.about || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Phone Number"
            name="phone"
            value={localData.phone || ''}
            onChange={handleChange}
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="National ID"
            name="nationalId"
            value={localData.nationalId || ''}
            onChange={handleChange}
            fullWidth
            error={!!errors.nationalId}
            helperText={errors.nationalId}
            sx={{ marginBottom: 2 }}
          />

          {/* National ID Image Upload */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            marginBottom: 2
          }}>
            <Button
              variant="outlined"
              onClick={handleNationalIdClick}
              startIcon={<InsertPhoto />}
              sx={{
                color: '#901b20',
                borderColor: '#901b20',
                '&:hover': {
                  borderColor: '#7a161b',
                  backgroundColor: 'rgba(144, 27, 32, 0.04)'
                }
              }}
            >
              Upload National ID
            </Button>
            {localData.nationalIdImg && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Current National ID Image:
                </Typography>
                <Box 
                  component="img" 
                  src={localData.nationalIdImg} 
                  sx={{ 
                    maxWidth: '100%', 
                    maxHeight: 150, 
                    marginTop: 1,
                    border: '1px solid #ddd',
                    borderRadius: 1
                  }} 
                />
              </Box>
            )}
            {errors.nationalIdImg && (
              <Typography color="error" variant="caption">{errors.nationalIdImg}</Typography>
            )}
            <input
              type="file"
              accept="image/*"
              ref={nationalIdImageRef}
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e, "nationalIdImg")}
            />
          </Box>

          <Button 
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#901b20',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#7a161b',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(144, 27, 32, 0.3)'
              },
              marginTop: 3
            }}
          >
            Next: Education
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditPersonal;