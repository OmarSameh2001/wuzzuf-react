import React, { useContext, useState, useRef } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { 
  Button, 
  Typography, 
  Box, 
  Paper, 
  IconButton,
  Divider,
  CircularProgress
} from "@mui/material";
import { Upload, Description, ArrowBack, ArrowForward } from "@mui/icons-material";

const EditCV = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [cv, setCv] = useState(profileData?.cv || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setError("");
    
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setIsLoading(true);
    
    // Simulate upload processing
    setTimeout(() => {
      const fileUrl = URL.createObjectURL(file);
      setCv(fileUrl);
      setIsLoading(false);
    }, 1000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!cv) {
      setError("Please upload your CV");
      return;
    }
    updateProfile("cv", cv);
    goToNextStep("/applicant/profile/review");
  };

  const handleBack = () => {
    goToNextStep("/applicant/profile/edit-skills");
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
      <ProfileStepper activeStep={4} />
      
      <Paper elevation={3} sx={{ 
        width: '100%',
        maxWidth: 600,
        padding: 4,
        marginTop: 3,
        borderRadius: 3,
        textAlign: 'center'
      }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            color: '#901b20',
            marginBottom: 3,
            fontWeight: 600
          }}
        >
          Upload Your CV
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSave}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <Box
            sx={{
              border: '2px dashed #901b20',
              borderRadius: 2,
              padding: 4,
              backgroundColor: 'rgba(144, 27, 32, 0.05)',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(144, 27, 32, 0.1)'
              }
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <Upload sx={{ fontSize: 50, color: '#901b20', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#901b20', mb: 1 }}>
              {cv ? 'Replace CV' : 'Select File to Upload'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              PDF or Word documents (Max 5MB)
            </Typography>
          </Box>

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} sx={{ color: '#901b20' }} />
            </Box>
          )}

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          {cv && (
            <Box sx={{ 
              mt: 2,
              padding: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              backgroundColor: '#f9f9f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Description sx={{ color: '#901b20', mr: 1 }} />
              <Typography variant="body1" sx={{ mr: 2 }}>
                {cv.split('/').pop()}
              </Typography>
              <Button 
                variant="outlined"
                size="small"
                href={cv}
                download
                sx={{
                  color: '#901b20',
                  borderColor: '#901b20',
                  '&:hover': {
                    borderColor: '#7a161b'
                  }
                }}
              >
                Download
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
              Back to Skills
            </Button>
            
            <Button 
              type="submit"
              variant="contained"
              endIcon={<ArrowForward />}
              disabled={!cv || isLoading}
              sx={{
                backgroundColor: '#901b20',
                '&:hover': {
                  backgroundColor: '#7a161b',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(144, 27, 32, 0.3)'
                },
                '&:disabled': {
                  backgroundColor: '#e0e0e0'
                }
              }}
            >
              {isLoading ? 'Uploading...' : 'Continue to Review'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditCV;