import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  InputAdornment,
  Divider,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Email, Lock, Person } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../../assets/animations/LoginRegister.json";
import { debounce } from "lodash";
import { signupUser } from "../../services/Auth";
import { userContext } from "../../context/UserContext";
import { showErrorToast, showSuccessToast } from "../../confirmAlert/toastConfirm";

const Register = () => {
  const [isEmployer, setIsEmployer] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    national_id: "",
    name: "",
    password: "",
    confirmPassword: "",
    user_type: "jobseeker",
    username: "",
    linkedin: "",
    website: "",
    other: "",
  });
  const [alert, setAlert] = useState({ type: '', message: '' });

  const [passwordError, setPasswordError] = useState("");
  const [NatIdError, setNatIdError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHelpText, setPasswordHelpText] = useState("");

  const {isLight} = useContext(userContext);

  const navigate = useNavigate();

  const checkEmailExists = async (email) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}user/check-email/`,
        { email }
      );
      if (response.data.exists) {
        setEmailError(
          response.data.error ||
            "Email already exists. Please choose another one."
        );
        return true;
      }
      setEmailError("");
      return false;
    } catch (error) {
      console.error("Email check failed", error);
      return false;
    }
  };


  const debouncedEmailCheck = debounce(checkEmailExists, 500);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.email && !emailError) {
      debouncedEmailCheck(formData.email);
    }
    return () => debouncedEmailCheck.cancel();
  }, [formData.email, emailError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    
    setFormData(updatedFormData);

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? "" : "Invalid email format.");
    }

    if (name === "national_id") {
      setNatIdError(
        value.length != 14 ? "National id should be 14 number" : ""
      );
    }

    if (name === "name") {
      const nameRegex = /^[A-Za-z\s]+$/;
      setNameError(
        nameRegex.test(value)
          ? ""
          : "Name must only contain letters and spaces."
      );
    }

    if (name === "password" || name === "confirmPassword") {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
      setPasswordHelpText(
        passwordRegex.test(value)
          ? ""
          : "Password must contain uppercase, lowercase, number, and special character."
      );

      // Use the updatedFormData instead of formData
      if (
        name === "confirmPassword" ||
        (name === "password" && updatedFormData.confirmPassword)
      ) {
        setPasswordError(
          updatedFormData.password !== updatedFormData.confirmPassword
            ? "Passwords do not match."
            : ""
        );
      }
    }
  };

  const handleUserTypeToggle = () => {
    const newUserType = isEmployer ? "jobseeker" : "company";
    setIsEmployer(!isEmployer);
    setFormData((prev) => ({
      ...prev,
      user_type: newUserType,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      setAlert({
        type: "error",
        message: "Passwords do not match. Please ensure both passwords are identical.",
      });
      return;
    }

    // If password meets criteria
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setPasswordError("Password must meet the required complexity.");
      return;
    } else if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      setAlert({
        type: "error",
        message: "Password must be at least 8 characters long.",
      });
      return;
    }

    // Ensure username and name meet their criteria
    if (NatIdError || nameError || passwordError || emailError) {
      setAlert({
        type: "error",
        message: "Please fix the errors before submitting.",
      });
      
      return;
    }

    try {
      const formattedData = {
        ...formData,
        user_type: formData.user_type.toUpperCase(),
        username: formData.email.split("@")[0], // Use email prefix as username
      };
      if(formData.user_type === "company"){
        formattedData.accounts = {
          "linkedin": formData.linkedin,
          "website": formData.website,
          "other": formData.other,
        }
        formattedData.national_id = null;
        }
      await signupUser(formattedData);
      localStorage.setItem("email", formData.email);
      showSuccessToast("Registration successful, please verify your email", 3000, isLight);
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (error) {
      console.error("Registration failed", error.response.data.error);
      showErrorToast("Registration failed", 2000, isLight);
      setAlert({
        type: "error",
        message: `Registration failed. Please check your details.\n${error.response.data.error}`,
      });
      
      // console.error("Registration failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if the submit button should be disabled
  const isSubmitDisabled =
    !formData.email ||
    (!formData.national_id && formData.user_type === "jobseeker") ||
    !formData.name ||
    !formData.password ||
    !formData.confirmPassword ||
    (formData.user_type === "jobseeker" && !!NatIdError) || // Convert to boolean
    !!nameError ||
    !!passwordError ||
    !!emailError ||
    passwordHelpText;

  const handleEmailCheck = async () => {
    try {
      const emailCheckResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND}user/check-email/`,
        {
          email: formData.email,
        }
      );

      if (emailCheckResponse.data.error) {
        setEmailError("Email already exists. Please choose another one.");
      } else {
        setEmailError("");
      }
    } catch (error) {
      console.error("Email check failed", error);
    }
  };

  const handleUsernameCheck = async () => {
    try {
      const usernameCheckResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND}user/check-username/`,
        {
          username: formData.username,
        }
      );

      if (usernameCheckResponse.data.error) {
        setNatIdError("Username already exists. Please choose another one.");
      } else {
        setNatIdError("");
      }
    } catch (error) {
      console.error("Username check failed", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: isLight ? "#f8f9fa" : "#242424",
        paddingTop: 3,
        paddingBottom: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: isLight ? "#f8f1f1" : "#121212",
                borderRadius: 2,
                maxHeight: "100vh",
              }}
            >
              <Lottie
                animationData={animationData}
                loop={true}
                style={{ width: "100%", height: "auto" }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : "#121212",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(145, 23, 32, 0.2)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                align="center"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#911720" }}
              >
                {isEmployer ? "Register as Employer" : "Register as Jobseeker"}
              </Typography>
              <Divider sx={{ mb: 4, backgroundColor: "#911720", height: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mb: 3,
                  textTransform: "none",
                  py: 1,
                  color: "#911720",
                  borderColor: "#911720",
                  "&:hover": {
                    backgroundColor: "#911720",
                    color: "#fff",
                    borderColor: "#911720",
                  },
                }}
                onClick={handleUserTypeToggle}
              >
                {isEmployer ? "Switch to Jobseeker" : "Switch to Employer"}
              </Button>

              {alert.message && (
                <Collapse in={!!alert.message}>
                  <Alert
                    severity={alert.type}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setAlert({ type: '', message: '' })}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    {alert.message}
                  </Alert>
                </Collapse>
              )}


              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#911720" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#901b20",
                      },
                      "&:hover fieldset": {
                        borderColor: "#901b20",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#901b20",
                    },
                    "& .MuiInputBase-input": {
                      backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : '#242424',
                      color: isLight ? 'black' : 'white',
                      paddingLeft: 1,
                    },
                  }}
                  required
                />
                {emailError && (
                  <Typography variant="body2" color="error">
                    {emailError}
                  </Typography>
                )}

                {formData.user_type === "jobseeker" && (
                  <TextField
                    fullWidth
                    label="National Id"
                    name="national_id"
                    type="text"
                    variant="outlined"
                    value={formData.national_id}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: "#911720" }} />
                        </InputAdornment>
                      ),
                    }}
                    required
                    sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#901b20",
                      },
                      "&:hover fieldset": {
                        borderColor: "#901b20",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#901b20",
                    },
                    "& .MuiInputBase-input": {
                      backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : '#242424',
                      color: isLight ? 'black' : 'white',
                      paddingLeft: 1
                    },
                  }}
                  />
                )}
                {NatIdError && (
                  <Typography variant="body2" color="error">
                    {NatIdError}
                  </Typography>
                )}

                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  type="text"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#901b20",
                      },
                      "&:hover fieldset": {
                        borderColor: "#901b20",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#901b20",
                    },
                    "& .MuiInputBase-input": {
                      backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : '#242424',
                      color: isLight ? 'black' : 'white',
                      paddingLeft: 1
                    },
                  }}
                />
                {nameError && (
                  <Typography variant="body2" color="error">
                    {nameError}
                  </Typography>
                )}

                {formData.user_type === "company" && (
                  <>
                    <TextField
                      fullWidth
                      label="LinkedIn"
                      name="linkedin"
                      type="text"
                      variant="outlined"
                      value={formData.linkedin || ""}
                      onChange={handleChange}
                      required
                      sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#901b20",
                      },
                      "&:hover fieldset": {
                        borderColor: "#901b20",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#901b20",
                    },
                    "& .MuiInputBase-input": {
                      backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : '#242424',
                      color: isLight ? 'black' : 'white',
                      paddingLeft: 1
                    },
                  }}
                    />

                    <TextField
                      fullWidth
                      label="Personal Website"
                      name="website"
                      type="text"
                      variant="outlined"
                      value={formData.website || ""}
                      onChange={handleChange}
                      required
                      sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#901b20",
                      },
                      "&:hover fieldset": {
                        borderColor: "#901b20",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#901b20",
                    },
                    "& .MuiInputBase-input": {
                      backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : '#242424',
                      color: isLight ? 'black' : 'white',
                      paddingLeft: 1
                    },
                  }}
                    />

                    <TextField
                      fullWidth
                      label="Other"
                      name="other"
                      type="text"
                      variant="outlined"
                      value={formData.other || ""}
                      onChange={handleChange}
                      // required
                      sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#901b20",
                      },
                      "&:hover fieldset": {
                        borderColor: "#901b20",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#901b20",
                    },
                    "& .MuiInputBase-input": {
                      backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : '#242424',
                      color: isLight ? 'black' : 'white',
                      paddingLeft: 1
                    },
                  }}
                    />
                  </>
                )}

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#911720" }} />
                      </InputAdornment>
                    ),
                  }}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#901b20",
                      },
                      "&:hover fieldset": {
                        borderColor: "#901b20",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#901b20",
                    },
                    "& .MuiInputBase-input": {
                      backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : '#242424',
                      color: isLight ? 'black' : 'white',
                      paddingLeft: 1
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#911720" }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!passwordError}
                  helperText={passwordError || passwordHelpText}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#901b20",
                      },
                      "&:hover fieldset": {
                        borderColor: "#901b20",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#901b20",
                    },
                    "& .MuiInputBase-input": {
                      backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : '#242424',
                      color: isLight ? 'black' : 'white',
                      paddingLeft: 1
                    },
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      sx={{
                        color: "#911720",
                        "& .MuiSvgIcon-root": {
                          fontSize: 18,
                        },
                      }}
                    />
                  }
                  label="Show Password"
                  sx={{
                    color: "#911720",
                    fontSize: "0.75rem",
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background:
                      "linear-gradient(45deg, #911720 30%, #c12e3d 90%)",
                    boxShadow: "0 3px 5px 2px rgba(145, 23, 32, .3)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      transition: "transform 0.2s",
                      background: "#911720",
                    },
                  }}
                  disabled={isSubmitDisabled} // Disable button if criteria are not met
                >
                  <p className="p-0 m-0 color-white" style={{ color: "white" }}>
                    Register
                  </p>
                </Button>

                <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: isLight ? 'black' : 'white' }}>
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    underline="hover"
                    sx={{ color: "#911720", fontWeight: "bold" }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Register;
