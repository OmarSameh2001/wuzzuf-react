import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  Divider,
  Grid,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import Lottie from "lottie-react";
import animationData from "../../assets/animations/LoginRegister.json";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setMessage("");
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleForgotPassword = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/user/password-reset/", { email });
      setMessage("Password reset email sent. Please check your inbox.");
      setError("");
      setCountdown(30);
    } catch (err) {
      setError("Failed to send password reset email.");
      setMessage("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        minHeight: "80vh",
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
                backgroundColor: "rgba(247, 237, 237, 0.95)",
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
                border: "1px solid rgba(144, 27, 32, 0.2)",
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
                sx={{ color: "#901b20" }}
              >
                Forgot Password
              </Typography>
              <Divider sx={{ 
                mb: 4, 
                backgroundColor: "#901b20",
                height: 2,
              }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Enter your email"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#901b20" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#901b20' },
                      '&:hover fieldset': { borderColor: '#901b20' },
                    },
                    '& .MuiInputLabel-root': { color: '#901b20' },
                  }}
                  required
                />
                {message && countdown === 0 && (
                  <Typography
                    color="success.main"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "#4CAF50",  // Green color for success message
                    }}
                  >
                    {message}
                  </Typography>
                )}
                {error && (
                  <Typography
                    color="error.main"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "#D32F2F",  // Red color for error message
                    }}
                  >
                    {error}
                  </Typography>
                )}
                {countdown > 0 && (
                  <Typography
                    color="orange"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "#FF9800",  // Orange color for countdown message
                    }}
                  >
                    Please wait {countdown} seconds before trying again.
                  </Typography>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleForgotPassword}
                  disabled={!email || countdown > 0}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background: "linear-gradient(45deg, #901b20 30%, #c12e3d 90%)",
                    boxShadow: "0 3px 5px 2px rgba(144, 27, 32, .3)",
                    '&:hover': {
                      transform: "translateY(-2px)",
                      transition: "transform 0.2s",
                      background: "#901b20",
                    },
                    opacity: !email || countdown > 0 ? 0.6 : 1,
                  }}
                >
                  {countdown > 0 ? `Try Again in ${countdown}s` : "Send Reset Link"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
