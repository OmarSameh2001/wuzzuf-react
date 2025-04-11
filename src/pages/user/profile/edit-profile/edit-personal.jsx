import React, { useContext, useState, useRef, useEffect } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { 
  Button, 
  TextField, 
  Avatar, 
  Box, 
  Typography, 
  Paper,
  IconButton,
  CircularProgress,
  Alert
} from "@mui/material";
import { CameraAlt, InsertPhoto } from "@mui/icons-material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { AxiosApi } from "../../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";

const EditPersonal = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  
  const [localData, setLocalData] = useState({
    name: "",
    email: "",
    dob: "",
    location: "",
    about: "",
    phone: "",
    nationalId: "",
    img: "",
    nationalIdImg: "",
  });
  const [uploadStatus, setUploadStatus] = useState({
    img: null,
    nationalIdImg: null
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const personalImageRef = useRef(null);
  const nationalIdImageRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      navigate("/applicant/profile", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const res = await AxiosApi.get(`user/jobseekers/${userId}/`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` }
        });
        
        const data = res.data;
        setLocalData({
          name: data.name || "",
          email: data.email || "",
          dob: data.dob || "",
          location: data.location || "",
          about: data.about || "",
          phone: data.phone_number || "",
          nationalId: data.national_id || "",
          img: data.img || "",
          nationalIdImg: data.national_id_img || "",
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    
    fetchData();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!localData.name?.trim()) newErrors.name = 'Name is required';
    if (!localData.dob) newErrors.dob = 'Date of birth is required';
    if (!localData.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\d{11}$/.test(localData.phone)) newErrors.phone = 'Phone must be 11 digits';
    if (!localData.nationalId?.trim()) newErrors.nationalId = 'National ID is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadStatus(prev => ({ ...prev, [field]: 'uploading' }));
      setErrors(prev => ({ ...prev, [field]: '' }));

      const backendField = field === 'nationalIdImg' ? 'national_id_img' : field;
      const formData = new FormData();
      formData.append(backendField, file);

      const response = await AxiosApi.patch(
        `user/jobseekers/${userId}/`,
        formData,
        { headers: { 
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data' 
        }}
      );

      setLocalData(prev => ({
        ...prev,
        [field]: response.data[backendField]
      }));
      updateProfile(backendField, response.data[backendField]);
      setUploadStatus(prev => ({ ...prev, [field]: 'success' }));
      
    } catch (err) {
      console.error('Upload failed:', err);
      setErrors(prev => ({
        ...prev, 
        [field]: err.response?.data?.[backendField]?.[0] || 'Upload failed'
      }));
      setUploadStatus(prev => ({ ...prev, [field]: 'error' }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      Object.entries(localData).forEach(([key, value]) => {
        if (key === 'phone') formData.append('phone_number', value);
        else if (key === 'nationalId') formData.append('national_id', value);
        else formData.append(key, value);
      });

      const response = await AxiosApi.patch(
        `user/jobseekers/${userId}/`,
        formData,
        { headers: { 
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data' 
        }}
      );

      updateProfile(response.data);
      setSuccess(true);
      setErrors({});
      setTimeout(() => goToNextStep("/applicant/profile/edit-education", { userId }), 2000);
      
    } catch (err) {
      console.error("Save failed:", err);
      const apiErrors = err.response?.data || {};
      const formattedErrors = Object.keys(apiErrors).reduce((acc, key) => {
        acc[key] = Array.isArray(apiErrors[key]) ? apiErrors[key].join(' ') : apiErrors[key];
        return acc;
      }, {});
      setErrors(formattedErrors);
    }
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

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully! Redirecting...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSave} sx={{ gap: 3 }}>
          {/* Profile Image Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <IconButton 
              onClick={() => personalImageRef.current.click()}
              disabled={uploadStatus.img === 'uploading'}
            >
              <Avatar
                src={localData.img}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: '3px solid #901b20',
                  opacity: uploadStatus.img === 'uploading' ? 0.7 : 1
                }}
              />
              {uploadStatus.img === 'uploading' && (
                <CircularProgress size={48} sx={{ position: 'absolute' }} />
              )}
            </IconButton>
            <Typography
              variant="caption"
              sx={{ 
                mt: 1,
                color: '#901b20',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
              onClick={() => personalImageRef.current.click()}
            >
              <CameraAlt fontSize="small" /> 
              {localData.img ? "Change Photo" : "Upload Photo"}
            </Typography>
            {errors.img && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errors.img}</Typography>
            )}
            <input
              type="file"
              accept="image/*"
              ref={personalImageRef}
              hidden
              onChange={(e) => handleImageUpload(e, "img")}
            />
          </Box>

          {/* Form Fields */}
          <TextField
            label="Full Name *"
            name="name"
            value={localData.name}
            onChange={handleChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Email"
            name="email"
            value={localData.email}
            onChange={handleChange}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />

          <TextField
            label="Date of Birth *"
            name="dob"
            type="date"
            value={localData.dob}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.dob}
            helperText={errors.dob}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Location"
            name="location"
            value={localData.location}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="About"
            name="about"
            value={localData.about}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Phone Number *"
            name="phone"
            value={localData.phone}
            onChange={handleChange}
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone || "Format: 12345678901"}
            sx={{ mb: 2 }}
          />

          <TextField
            label="National ID *"
            name="nationalId"
            value={localData.nationalId}
            onChange={handleChange}
            fullWidth
            error={!!errors.nationalId}
            helperText={errors.nationalId}
            sx={{ mb: 2 }}
          />

          {/* National ID Image Upload */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Button
              variant="outlined"
              onClick={() => nationalIdImageRef.current.click()}
              startIcon={<InsertPhoto />}
              disabled={uploadStatus.nationalIdImg === 'uploading'}
              sx={{
                color: '#901b20',
                borderColor: '#901b20',
                '&:hover': { borderColor: '#7a161b' },
                opacity: uploadStatus.nationalIdImg === 'uploading' ? 0.7 : 1
              }}
            >
              {localData.nationalIdImg ? "Change ID" : "Upload National ID"}
              {uploadStatus.nationalIdImg === 'uploading' && (
                <CircularProgress size={24} sx={{ ml: 1 }} />
              )}
            </Button>
            
            {localData.nationalIdImg && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                  Current National ID:
                </Typography>
                <Box 
                  component="img" 
                  src={localData.nationalIdImg} 
                  sx={{ 
                    maxWidth: '100%', 
                    maxHeight: 150, 
                    mt: 1,
                    border: '1px solid #ddd',
                    borderRadius: 1
                  }} 
                />
              </Box>
            )}
            {errors.nationalIdImg && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {errors.nationalIdImg}
              </Typography>
            )}
            <input
              type="file"
              accept="image/*"
              ref={nationalIdImageRef}
              hidden
              onChange={(e) => handleImageUpload(e, "nationalIdImg")}
            />
          </Box>

          {Object.keys(errors).length > 0 && !success && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Please fix the errors in the form
            </Alert>
          )}

          <Button 
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#901b20',
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#7a161b',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Save & Continue
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditPersonal;