import React, { useContext, useState, useEffect } from "react";
import { userContext } from "../../../../context/UserContext";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { AxiosApi } from "../../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import {
  showConfirmToast,
  showErrorToast,
  showSuccessToast,
} from "../../../../confirmAlert/toastConfirm";

const EditCV = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, isLight, setUpdate, refetchUser } = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();

  const locationUserId = location.state?.userId;
  const userId = locationUserId || user?.id;

  const [cvUrl, setCvUrl] = useState(null);
  const [cvName, setCvName] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [parse, setParse] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log(parse);
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
        if (cvPath) {
          const fullUrl = `https://res.cloudinary.com/dkvyfbtdl/raw/upload/${cvPath}.pdf`;
          setCvUrl(cvPath.endsWith(".pdf") ? cvPath : `${cvPath}.pdf`);
          setCvName(cvPath.split("/").pop());
        }
      } catch (err) {
        console.error("Error fetching CV:", err);
        setError("Failed to load CV. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [userId, navigate]);

  const checkParse = (file) => {
    if (parse) {
      showConfirmToast({
        message: "Are You sure you want to parse profile data from cv?",
        onConfirm: () => {
          handleFileUpload(file);
        },
        isLight: isLight,
      });
    } else {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const allowedTypes = ["application/pdf"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF files are allowed");
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
    if (!parse) {
      formData.append("update", false);
    }

    try {
      const res = await AxiosApi.patch(`/user/jobseekers/${userId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        timeout: 30000,
      });
      showSuccessToast("CV uploaded successfully!", 2000, isLight);
      if(parse){
        console.log(res)
        setUpdate({user:{id:123}, settings:{summary:res?.data?.about_summary || {about: "", summary: ""}, refetch: refetchUser}});
      }
      navigate("/applicant/profile");
    } catch (err) {
      console.error("Upload error:", err);
      showErrorToast("Failed to upload CV", 2000, isLight);
      let errorMessage = "Failed to upload CV";
      if (err.response) {
        errorMessage =
          err.response.status === 413
            ? "File too large (max 5MB)"
            : err.response.data?.detail || err.response.statusText;
      } else if (err.request) {
        errorMessage = "Network error - please check your connection";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);
    setCvFile(file);
  };

  const handleRemoveFile = () => {
    setCvFile(null);
    if (document.getElementById("cv-upload-input")) {
      document.getElementById("cv-upload-input").value = "";
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', 
      justifyContent: 'center',
       alignItems: 'center',
        width: '100%',
        backgroundColor: isLight ? '#f5f5f5' : '#121212'}}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        // minHeight: 200,
        flexDirection: 'column',
        gap: 2,
        backgroundColor: isLight ? '#f5f5f5' : '#121212',
        p: 3,
        textAlign: 'center', 
        minHeight:'80vh' 
      }}>
 
        <CircularProgress 
        size={isMobile ? 24 : 32}
        thickness={4}
        sx={{ 
          color: isLight ? theme.palette.primary.main : '#901b26'
        }} 
         />
        <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: isLight ? 'text.primary' : 'rgba(255, 255, 255, 0.87)'
        }}>
          Loading your CV...
        </Typography>
      </Box>
      </div>
    );
  }

  return (
    <Box
      sx={{
        minWidth: "100vw",
        backgroundColor: isLight ? "#f5f5f5" : "#242424",
        minHeight:'80vh' 
      }}
    >
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          p: isMobile ? 2 : 3,
          my: 4,
          backgroundColor: isLight ? "#f5f5f5" : "#121212",
        }}
      >
        <Card
          variant="outlined"
          sx={{
            borderRadius: 2,
            backgroundColor: isLight ? "#fff" : "#242424",
          }}
        >
          <CardContent sx={{ p: isMobile ? 2 : 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  fontSize: isMobile ? "1.25rem" : "1.5rem",
                  color: isLight ? "black" : "white",
                }}
              >
                <DescriptionIcon fontSize={isMobile ? "medium" : "large"} />
                {cvUrl ? "Update Your CV" : "Upload Your CV"}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="active"
                    checked={parse}
                    onChange={() => setParse(!parse)}
                    sx={{ cursor: "pointer" }}
                  />
                }
                label="Parse Profile Data From Cv"
                sx={{ color: isLight ? "#000" : "#fff" }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* File Upload Section */}
              <Box>
                <input
                  id="cv-upload-input"
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={handleFileChange}
                />
                <Button
                  fullWidth
                  variant="outlined"
                  component="label"
                  htmlFor="cv-upload-input"
                  sx={{
                    p: isMobile ? 3 : 4,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    borderColor: theme.palette.divider,
                    backgroundColor: isLight ? "#f5f5f5" : "#121212",
                    color: isLight ? "black" : "#901b26",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CloudUploadIcon
                      sx={{
                        fontSize: isMobile ? 32 : 40,
                        color: isLight ? "text.secondary" : "#901b26",
                      }}
                    />
                    <Box>
                      <Typography variant="body1" component="div">
                        <Box component="span" sx={{ fontWeight: 500 }}>
                          Click to upload
                        </Box>
                      </Typography>
                      <Typography
                        variant="caption"
                        color={isLight ? "textSecondary" : "#901b26"}
                      >
                        PDF format (max 5MB)
                      </Typography>
                    </Box>
                  </Box>
                </Button>

                {cvFile && (
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      backgroundColor: isLight
                        ? theme.palette.grey[50]
                        : "#121212",
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        color: isLight ? "text.secondary" : "#901b26",
                      }}
                    >
                      <DescriptionIcon color="primary" />
                      <Box
                        sx={{ color: isLight ? "text.secondary" : "#901b26" }}
                      >
                        <Typography variant="body2">{cvFile.name}</Typography>
                        <Typography variant="caption">
                          {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      onClick={handleRemoveFile}
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon fontSize="small" />}
                      sx={{ minWidth: 32 }}
                    >
                      {!isMobile && "Remove"}
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Current CV Section */}
              {cvUrl && (
                <Box
                  sx={{
                    backgroundColor: isLight
                      ? theme.palette.grey[50]
                      : "#121212",
                    borderRadius: 1,
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color={isLight ? "textSecondary" : "white"}
                    gutterBottom
                  >
                    Existing CV:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <DescriptionIcon color="primary" />
                    <Button
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        textTransform: "none",
                        color: theme.palette.primary.main,
                      }}
                    >
                      View Current CV
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Error Messages */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    "& .MuiAlert-message": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  pt: 3,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                {/* <Button
                variant="outlined"
                onClick={() => navigate("/applicant/profile")}
                disabled={loading}
              >
                Cancel
              </Button> */}
                <Button
                  variant="contained"
                  onClick={() => checkParse(cvFile)}
                  disabled={loading || !cvFile}
                  sx={{
                    minWidth: 120,
                    "&:disabled": {
                      backgroundColor: theme.palette.action.disabledBackground,
                      color: theme.palette.text.disabled,
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "inherit" }} />
                  ) : cvUrl ? (
                    "Update CV"
                  ) : (
                    "Upload CV"
                  )}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default EditCV;
