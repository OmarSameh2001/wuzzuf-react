import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "@mui/material";
import { Email, Lock, Person } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from '../../assets/LoginRegister.json'; 

const Register = () => {
  const [isEmployer, setIsEmployer] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    password: "",
    user_type: "jobseeker",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    try {
      const formattedData = {
        ...formData,
        user_type: formData.user_type.toUpperCase(),
      };
      await axios.post("http://localhost:8000/user/register/", formattedData);
      localStorage.setItem("email", formData.email);
      console.log(localStorage.getItem("email"))
      // Navigate to OTP verification page
      navigate("/verify-otp");
    } catch (error) {
      alert("Registration failed. Please check your details.");
      console.error("Registration failed", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        minHeight: "100vh",
        // background: "", // Lighter gradient with burgundy tones
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
                backgroundColor: "#f8f1f1", // Light burgundy tint
                borderRadius: 2,
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
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(145, 23, 32, 0.2)", // Burgundy border
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
                sx={{ color: "#911720" }} // Burgundy color for heading
              >
                {isEmployer ? "Register as Employer" : "Register as Jobseeker"}
              </Typography>
              <Divider sx={{ 
                mb: 4, 
                backgroundColor: "#911720",
                height: 2,
              }} />

              <Button
                fullWidth
                variant="outlined"
                sx={{ 
                  mb: 3, 
                  textTransform: "none", 
                  py: 1,
                  color: "#911720",
                  borderColor: "#911720",
                  '&:hover': {
                    backgroundColor: '#911720',
                    color: '#fff',
                    borderColor: '#911720'
                  }
                }}
                onClick={handleUserTypeToggle}
              >
                {isEmployer ? "Switch to Jobseeker" : "Switch to Employer"}
              </Button>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#911720',
                      },
                      '&:hover fieldset': {
                        borderColor: '#911720',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#911720',
                    },
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  type="text"
                  variant="outlined"
                  value={formData.username}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#911720" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#911720',
                      },
                      '&:hover fieldset': {
                        borderColor: '#911720',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#911720',
                    },
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  type="text"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#911720',
                      },
                      '&:hover fieldset': {
                        borderColor: '#911720',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#911720',
                    },
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#911720',
                      },
                      '&:hover fieldset': {
                        borderColor: '#911720',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#911720',
                    },
                  }}
                  required
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background: "linear-gradient(45deg, #911720 30%, #c12e3d 90%)",
                    boxShadow: "0 3px 5px 2px rgba(145, 23, 32, .3)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      transition: "transform 0.2s",
                      background: "#911720",
                    },
                  }}
                >
                  Register
                </Button>

                <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                  Already have an account?{" "}
                  <Link 
                    component={RouterLink} 
                    to="/login" 
                    underline="hover" 
                    sx={{ color: "#911720", fontWeight: 'bold' }}
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