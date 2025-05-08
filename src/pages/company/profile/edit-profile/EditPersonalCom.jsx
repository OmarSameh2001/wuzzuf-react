import React, { useContext, useState, useRef, useEffect } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Container,
  Grid,
  Divider,
  Alert,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { ArrowBack,
Save,
CameraAlt,
CheckCircle,
ErrorOutline } from "@mui/icons-material"
import { showErrorToast, showInfoToast, showSuccessToast } from "../../../../confirmAlert/toastConfirm";
import { AxiosApi } from "../../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../../../../context/UserContext";
import Lottie from "lottie-react";
import '../../../../styles/company/profile/edit_profile_Personal.css';
import CustomAutoComplete from "../../../../components/autoComplete/CustomAutoComplete";

const EditPersonalCom = () => {
  const { user, setUser ,isLight, refetchUser} = useContext(userContext);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ img: null });
  const logoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const primaryColor = "#e53946"
  const backgroundColor = isLight ? "#f9f9f9" : "#121212"
  const textColor = isLight ? "#2d3748" : "#e2e8f0"
  const borderColor = isLight ? "#e3cdcd" : "#2d3748"
  const cardBackground = isLight ? "#ffffff" : "#1e1e1e"
  const inputBackground = isLight ? "#f9f9f9" : "#242424"

  const [localData, setLocalData] = useState({
    name: "",
    email: "",
    img: "",
    location: "",
    about: "",
    phone: "",
    est: "",
    industry: "",
  });

  useEffect(() => {
    if (user) {
      setLocalData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        img: user.img,
        location: user.location,
        about: user.about,
        phone: user.phone_number,
        est: user.est ? user.est.split("T")[0] : "",
        industry: user.industry,
      }));
    }
  }, [user, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (!file.type.match("image.*")) throw new 
      showErrorToast("Please upload a valid image.", 2000,isLight);
      if (file.size > 2 * 1024 * 1024) throw new 
      
      showInfoToast("File size should be less than 2MB", 2000, isLight);

      setUploadStatus({ img: "uploading" });
      const formData = new FormData();
      formData.append("img", file);

      const response = await AxiosApi.patch(`user/profile/`, formData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedData = response.data;

      setLocalData((prev) => ({
        ...prev,
        img: updatedData.img,
      }));
      
      setUser((prev) => ({
        ...prev,
        img: updatedData.img,
      }));
      showSuccessToast("Image uploaded successfully!", 2000, isLight)
      setUploadStatus({ img: "success" });
      refetchUser()
    } catch (error) {
      console.error("Error uploading img:", error);
      setUploadStatus({ img: "error" });
      showErrorToast(error.message, 2000, isLight)
      setError(error.message);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        name: localData.name,
        location: localData.location,
        about: localData.about,
        phone_number: localData.phone,
        est: localData.est,
        industry: localData.industry,
      };

      const response = await AxiosApi.patch(`user/profile/`, payload, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      setSuccess(true);
      setError(null);

      showSuccessToast("Profile updated successfully! Redirecting...", 2000, isLight)

      setTimeout(() => navigate("/company/profile"), 1000);
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage = err.response?.data
        ? Object.values(err.response.data).join(" ")
        : "Failed to save changes.";
      showErrorToast(errorMessage, 2000, isLight)
    }
  };


  const validateForm = () => {
    const requiredFields = ["name", "location", "phone"];
    const missing = requiredFields.filter((f) => !localData[f]);

    if (missing.length > 0) {
      showErrorToast(`Missing required fields: ${missing.join(", ")}`, 2000, isLight);
      return false;
    }

    return true;
  };

  
 
    return (
      <Box
      className={`edit-profile-container ${isLight ? "light-mode" : "dark-mode"}`}
      sx={{
        backgroundColor: backgroundColor,
        minHeight: "100vh",
        width: "100%",
        py: 4,
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            backgroundColor: cardBackground,
            borderRadius: "16px",
            overflow: "hidden",
            border: `1px solid ${borderColor}`,
            transition: "all 0.3s ease",
          }}
        >
          <Box
            sx={{
              backgroundColor: primaryColor,
              py: 3,
              px: 4,
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              Edit Company Profile
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Update your company information and settings
            </Typography>
          </Box>

          
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              {error && (
                <Alert
                  severity="error"
                  icon={<ErrorOutline fontSize="inherit" />}
                  sx={{
                    mb: 3,
                    alignItems: "center",
                    backgroundColor: isLight ? "#fde8e8" : "#3b1a1a",
                    color: isLight ? "#e02424" : "#f8b4b4",
                    "& .MuiAlert-icon": {
                      color: isLight ? "#e02424" : "#f8b4b4",
                    },
                  }}
                >
                  <Typography variant="body1" fontWeight={500}>
                    {error}
                  </Typography>
                </Alert>
              )}

              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    src={localData.img || "/placeholder.svg?height=150&width=150"}
                    alt="Company Logo"
                    sx={{
                      width: 150,
                      height: 150,
                      border: `3px solid ${primaryColor}`,
                      boxShadow: `0 4px 20px ${primaryColor}33`,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                    onClick={() => logoRef.current.click()}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: primaryColor,
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#c62a37",
                      },
                      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }}
                    onClick={() => logoRef.current.click()}
                  >
                    <CameraAlt />
                  </IconButton>
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoRef}
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    color: primaryColor,
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => logoRef.current.click()}
                >
                  {localData.img ? "Change company logo" : "Upload company logo"}
                </Typography>
                {uploadStatus.img === "uploading" && (
                  <Box sx={{ mt: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: primaryColor }} />
                    <Typography variant="body2" sx={{ color: isLight ? "#718096" : "#a0aec0" }}>
                      Uploading...
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ mb: 4, borderColor: borderColor }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      mb: 1,
                      color: textColor,
                    }}
                  >
                    Company Name*
                  </Typography>
                  <TextField
                    fullWidth
                    name="name"
                    value={localData.name}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    variant="outlined"
                    InputProps={{
                      sx: {
                        backgroundColor: inputBackground,
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: borderColor,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryColor,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryColor,
                        },
                        color: textColor,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      mb: 1,
                      color: textColor,
                    }}
                  >
                    Email (Cannot be changed)
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    value={localData.email}
                    disabled
                    variant="outlined"
                    InputProps={{
                      sx: {
                        backgroundColor: isLight ? "#edf2f7" : "#2d3748",
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: borderColor,
                        },
                        color: isLight ? "#718096" : "#a0aec0",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      mb: 1,
                      color: textColor,
                    }}
                  >
                    Phone Number*
                  </Typography>
                  <TextField
                    fullWidth
                    name="phone"
                    value={localData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    variant="outlined"
                    InputProps={{
                      sx: {
                        backgroundColor: inputBackground,
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: borderColor,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryColor,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryColor,
                        },
                        color: textColor,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      mb: 1,
                      color: textColor,
                    }}
                  >
                    Location*
                  </Typography>
                  {/* <TextField
                    fullWidth
                    name="location"
                    value={localData.location}
                    onChange={handleChange}
                    placeholder="Enter company location"
                    variant="outlined"
                    InputProps={{
                      sx: {
                        backgroundColor: inputBackground,
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: borderColor,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryColor,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryColor,
                        },
                        color: textColor,
                      },
                    }}
                  /> */}
                  <CustomAutoComplete
                      getter={localData.location}
                      setter={setLocalData}
                      label={"Location"}
                      value={"location"}
                      border={"#901b20"}
                      background={isLight ? "#fff" : "#121212"}
                      type={"egypt"}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      mb: 1,
                      color: textColor,
                    }}
                  >
                    Industry
                  </Typography>
                  <TextField
                    fullWidth
                    name="industry"
                    value={localData.industry}
                    onChange={handleChange}
                    placeholder="Enter company industry"
                    variant="outlined"
                    InputProps={{
                      sx: {
                        backgroundColor: inputBackground,
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: borderColor,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryColor,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryColor,
                        },
                        color: textColor,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      mb: 1,
                      color: textColor,
                    }}
                  >
                    Establishment Date
                  </Typography>
                  <TextField
                    fullWidth
                    name="est"
                    type="date"
                    value={localData.est}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        backgroundColor: inputBackground,
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: borderColor,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryColor,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryColor,
                        },
                        color: textColor,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      mb: 1,
                      color: textColor,
                    }}
                  >
                    About Company
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="about"
                    value={localData.about}
                    onChange={handleChange}
                    placeholder="Enter company description"
                    variant="outlined"
                    InputProps={{
                      sx: {
                        backgroundColor: inputBackground,
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: borderColor,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryColor,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryColor,
                        },
                        color: textColor,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 2 : 0,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate("/company/profile")}
                  sx={{
                    borderColor: isLight ? "#e2e8f0" : "#2d3748",
                    color: textColor,
                    borderRadius: "10px",
                    py: 1.5,
                    px: 3,
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: primaryColor,
                      backgroundColor: `${primaryColor}10`,
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Cancel & Go Back
                </Button>
                <Button
                  variant="contained"
                  startIcon={
                    uploadStatus.img === "uploading" ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : <Save />
                  }
                  onClick={handleSave}
                  disabled={uploadStatus.img === "uploading"}
                  sx={{
                    backgroundColor: primaryColor,
                    color: "#fff",
                    borderRadius: "10px",
                    py: 1.5,
                    px: 3,
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#c62a37",
                      transform: "translateY(-3px)",
                      boxShadow: `0 4px 12px ${primaryColor}33`,
                    },
                    "&:disabled": {
                      backgroundColor: isLight ? "#e9d8d9" : "#3a2a2b",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {uploadStatus.img === "uploading" ? "Uploading..." : "Save Changes"}
                </Button>
              </Box>
            </Box>
          
        </Paper>
      </Container>
    </Box>
  );
};

export default EditPersonalCom;
// import React, { useContext, useState, useRef, useEffect } from "react";
// import {
//   Button,
//   TextField,
//   Avatar,
//   Box,
//   Typography,
//   CircularProgress,
//   Alert,
//   Fade,
//   Grow,
//   Slide
// } from "@mui/material";
// import { AxiosApi } from "../../../../services/Api";
// import { useLocation, useNavigate } from "react-router-dom";
// import { userContext } from "../../../../context/UserContext";
// import Lottie from "lottie-react";
// // import loadingAnimation from "../../../../assets/animations/loading.json";
// // import successAnimation from "../../../../assets/animations/success.json";

// const EditPersonalCom = () => {
//   const { user, setUser } = useContext(userContext);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState({ img: null });
//   const logoRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const id = location.state?.id;

//   const [localData, setLocalData] = useState({
//     name: "",
//     email: "",
//     img: "",
//     location: "",
//     about: "",
//     phone: "",
//     est: "",
//     industry: "",
//   });

//   useEffect(() => {
//     if (user) {
//       setLocalData((prev) => ({
//         ...prev,
//         name: user.name,
//         email: user.email,
//         img: user.img,
//         location: user.location,
//         about: user.about,
//         phone: user.phone_number,
//         est: user.est ? user.est.split("T")[0] : "",
//         industry: user.industry,
//       }));
//     }
//   }, [user, id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLocalData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       if (!file.type.match("image.*")) throw new Error("Please upload a valid image.");
//       if (file.size > 10 * 1024 * 1024) throw new Error("File size should be less than 10MB");

//       setUploadStatus({ img: "uploading" });
//       const formData = new FormData();
//       formData.append("img", file);

//       const response = await AxiosApi.patch(`user/profile/`, formData, {
//         headers: {
//           Authorization: `Token ${localStorage.getItem("token")}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       const updatedData = response.data;

//       setLocalData((prev) => ({
//         ...prev,
//         img: updatedData.img,
//       }));
      
//       setUser((prev) => ({
//         ...prev,
//         img: updatedData.img,
//       }));

//       setUploadStatus({ img: "success" });
//     } catch (error) {
//       console.error("Error uploading img:", error);
//       setUploadStatus({ img: "error" });
//       setError(error.message);
//     }
//   };

//   const handleSave = async () => {
//     if (!validateForm()) return;

//     try {
//       const payload = {
//         name: localData.name,
//         location: localData.location,
//         about: localData.about,
//         phone_number: localData.phone,
//         est: localData.est,
//         industry: localData.industry,
//       };

//       const response = await AxiosApi.patch(`user/profile/`, payload, {
//         headers: {
//           Authorization: `Token ${localStorage.getItem("token")}`,
//         },
//       });

//       // setUser((prev) => ({
//       //   ...prev,
//       //   ...response.data,
//       // }));

//       setSuccess(true);
//       setError(null);

//       setTimeout(() => navigate("/company/profile"), 2000);
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       const errorMessage = err.response?.data
//         ? Object.values(err.response.data).join(" ")
//         : "Failed to save changes.";
//       setError(errorMessage);
//     }
//   };

//   // console.log("Image source:", localData.img);


//   const validateForm = () => {
//     const requiredFields = ["name", "location", "phone"];
//     const missing = requiredFields.filter((f) => !localData[f]);

//     if (missing.length > 0) {
//       setError(`Missing required fields: ${missing.join(", ")}`);
//       return false;
//     }

//     return true;
//   };

//   // Animation configurations
//   const animationConfig = {
//     // loading: {
//     //   animationData: loadingAnimation,
//     //   style: { width: 80, height: 80 }
//     // },
//   //   success: {
//   //     animationData: successAnimation,
//   //     style: { width: 100, height: 100 }
//   //   }
//    };

//   // Styled components
//   const primaryButtonStyle = {
//     backgroundColor: "#901b26",
//     color: "#fff",
//     "&:hover": {
//       backgroundColor: "#6a1320",
//       transform: "translateY(-2px)",
//       boxShadow: "0 4px 12px rgba(144, 27, 38, 0.3)"
//     },
//     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//     py: 1.5,
//     px: 4,
//     fontSize: "1rem"
//   };

//   return (
//     <Fade in timeout={500}>
//       <Box sx={{ 
//         padding: 4,
//         display: "flex",
//         flexDirection: "column",
//         gap: 3,
//         maxWidth: 600,
//         margin: "0 auto",
//         background: "linear-gradient(to bottom right, #fff 0%, #f8f0f2 100%)",
//         borderRadius: 4,
//         boxShadow: 3
//       }}>
//         <Slide in direction="down" timeout={300}>
//           <Typography variant="h4" sx={{ 
//             color: "#901b26",
//             fontWeight: 700,
//             mb: 2,
//             textAlign: "center"
//           }}>
//             Edit Company Profile
//           </Typography>
//         </Slide>

//         {success ? (
//           <Grow in timeout={500}>
//             <Box sx={{ textAlign: "center" }}>
//               {/* <Lottie {...animationConfig.success} /> */}
//               <Alert severity="success" sx={{ mt: 2 }}>
//                 Profile updated successfully!
//               </Alert>
//             </Box>
//           </Grow>
//         ) : (
//           <>
//             <Box sx={{ 
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               position: "relative"
//             }}>
//               <Avatar
//                 src={localData.img}
//                 sx={{ 
//                   width: 120, 
//                   height: 120, 
//                   cursor: "pointer",
//                   border: "2px solid #901b26",
//                   boxShadow: 3,
//                   transition: "transform 0.3s",
//                   "&:hover": { transform: "scale(1.05)" }
//                 }}
//                 onClick={() => logoRef.current.click()}
//               />
              
//               {uploadStatus.img === "uploading" && (
//                 <Box sx={{ 
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center"
//                 }}>
//                   <Lottie {...animationConfig.loading} />
//                 </Box>
//               )}

//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: "#901b26",
//                   mt: 1,
//                   cursor: "pointer",
//                   fontWeight: 500,
//                   "&:hover": { textDecoration: "underline" }
//                 }}
//                 onClick={() => logoRef.current.click()}
//               >
//                 {localData.img ? "Change Logo" : "Upload Logo"}
//               </Typography>
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={logoRef}
//                 style={{ display: "none" }}
//                 onChange={handleImageUpload}
//               />
//             </Box>

//             <Grow in timeout={500} style={{ transitionDelay: '100ms' }}>
//               <TextField
//                 label="Company Name"
//                 name="name"
//                 value={localData.name}
//                 onChange={handleChange}
//                 fullWidth
//                 sx={{ 
//                   '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#901b26 !important'
//                   }
//                 }}
//               />
//             </Grow>

//             <Grow in timeout={500} style={{ transitionDelay: '150ms' }}>
//               <TextField
//                 label="Email"
//                 name="email"
//                 value={localData.email}
//                 fullWidth
//                 disabled
//               />
//             </Grow>

//             <Grow in timeout={500} style={{ transitionDelay: '200ms' }}>
//               <TextField
//                 label="Location"
//                 name="location"
//                 value={localData.location}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Grow>

//             <Grow in timeout={500} style={{ transitionDelay: '250ms' }}>
//               <TextField
//                 label="Phone Number"
//                 name="phone"
//                 value={localData.phone}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Grow>

//             <Grow in timeout={500} style={{ transitionDelay: '300ms' }}>
//               <TextField
//                 label="Establishment Date"
//                 name="est"
//                 type="date"
//                 value={localData.est}
//                 onChange={handleChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grow>

//             <Grow in timeout={500} style={{ transitionDelay: '350ms' }}>
//               <TextField
//                 label="Industry"
//                 name="industry"
//                 value={localData.industry}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Grow>

//             {error && (
//               <Fade in timeout={300}>
//                 <Alert severity="error" sx={{ mb: 2 }}>
//                   {error}
//                 </Alert>
//               </Fade>
//             )}

//             <Grow in timeout={500} style={{ transitionDelay: '400ms' }}>
//               <Button 
//                 variant="contained" 
//                 onClick={handleSave} 
//                 sx={primaryButtonStyle}
//                 disabled={uploadStatus.img === "uploading"}
//               >
//                 {uploadStatus.img === "uploading" ? (
//                   <CircularProgress size={24} sx={{ color: "#fff" }} />
//                 ) : (
//                   "Save Changes"
//                 )}
//               </Button>
//             </Grow>
//           </>
//         )}
//       </Box>
//     </Fade>
//   );
// };

// export default EditPersonalCom;