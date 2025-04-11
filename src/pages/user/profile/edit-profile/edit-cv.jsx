import React, { useContext, useState, useEffect , useRef} from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { userContext } from "../../../../context/UserContext";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AxiosApi } from "../../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { ca } from "date-fns/locale";
import { Upload, Description, ArrowBack, ArrowForward } from "@mui/icons-material";

const EditCV = () => {
  try{
  // const { goToNextStep } = useContext(ProfileContext);
  const { user } = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();

  const locationUserId = location.state?.userId;
  const userId = locationUserId || user?.id;

  const [cvUrl, setCvUrl] = useState(null);
  const [cvName, setCvName] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate("/applicant/profile", { replace: true });
      return;
    }

    const fetchCV = async () => {
      try {
        const res = await AxiosApi.get(`user/jobseekers/${userId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        const cvPath = res.data.cv;
        console.log("CV Path:", cvPath);
        if (cvPath) {
          const fullUrl = `https://res.cloudinary.com/dkvyfbtdl/raw/upload/${cvPath}`;
          setCvUrl(cvPath?.endsWith(".pdf") ? cvPath : `${cvPath}.pdf`);
          console.log("CV URL:", fullUrl);
          setCvName(cvPath.split("/").pop());
        }
      } catch (err) {
        console.error("Error fetching CV:", err);
        setError("Failed to load CV.");
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [userId]);

  const handleFileUpload = async (file) => {
    // const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = [
      "application/pdf",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, DOC, and DOCX files are allowed");
      return;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("cv", file);
    // formData.append('name', user.name); // Include other fields if needed
    // formData.append('email', user.email);

    try {
      const response = await AxiosApi.patch(
        `/user/jobseekers/${userId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          // Add timeout if needed
          timeout: 30000, // 30 seconds
        }
      );

      // // Update local state with the new CV URL
      // setCvUrl(response.data.cv);
      // setCvName(file.name);

      // // Update context/global state if needed
      // updateProfile("cv", response.data.cv);

      // // Show success message
      // setAlert({
      //   severity: "success",
      //   message: "CV uploaded successfully!",
      // });

      // // Optional: Log the response for debugging
      // console.log("Upload successful:", response.data);
      navigate("/applicant/profile")

    } catch (err) {
      console.error("Upload error:", err);

      let errorMessage = "Failed to upload CV";
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 413) {
          errorMessage = "File too large (max 5MB)";
        } else if (err.response.data) {
          errorMessage = err.response.data.detail || err.response.statusText;
        }
      } else if (err.request) {
        // Request was made but no response
        errorMessage = "Network error - please check your connection";
      }

      setError(errorMessage);
      setAlert({
        severity: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);

      // Clear the file input to allow re-uploading the same file
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleSave = () => {
    if (!cvFile) {
      setError("Please upload a CV file before submitting.");
      return;
    }
    handleFileUpload(cvFile);
    goToNextStep("/applicant/profile", { userId });
  };

  const handleBack = () => {
    goToNextStep("/applicant/profile/edit-skills", { userId });
  };
  // const handleDelete = async () => {
  //   setCv

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
        <span style={{ marginLeft: "10px" }}>Loading CV...</span>
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
  )
};

export default EditCV;