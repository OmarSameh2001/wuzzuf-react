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
} from "@mui/material";
import { Email, Lock, Person } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

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
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(78, 78, 78, 0.34)",
        }}
      >
        <Typography variant="h5" align="center" fontWeight="bold">
          {isEmployer ? "Register as Employer" : "Register as Jobseeker"}
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 2, textTransform: "none" }}
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
                  <Email sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
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
                  <Person sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
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
                  <Lock sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
            }}
            required
          />

          <Button fullWidth variant="contained" size="large" type="submit" sx={{ mt: 2 }}>
            Register
          </Button>

          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Already have an account? {" "}
            <Link component={RouterLink} to="/login" underline="hover" color="primary">
              Sign In
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;

