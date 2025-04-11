import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import Lottie from "lottie-react";
import animationData from "../../assets/animations/LoginRegister.json";

const ResetPassword = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/password-reset/get-token/${email}/`
        );
        setToken(response.data.token);
      } catch (err) {
        setError("Failed to fetch token");
      }
    };
    fetchToken();
  }, [email]);

  // Real-time password match check
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    // Check if passwords match
    if (newPassword !== value) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Check if the passwords match before submitting
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/user/password-reset/confirm/",
        { email, token, new_password: newPassword }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.token || "Something went wrong");
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
                Reset Password
              </Typography>
              <Divider sx={{ mb: 4, backgroundColor: "#901b20", height: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Enter new password"
                  variant="outlined"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#901b20' },
                      '&:hover fieldset': { borderColor: '#901b20' },
                    },
                    '& .MuiInputLabel-root': { color: '#901b20' },
                  }}
                  required
                />
                <TextField
                  fullWidth
                  label="Confirm new password"
                  variant="outlined"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#901b20' },
                      '&:hover fieldset': { borderColor: '#901b20' },
                    },
                    '& .MuiInputLabel-root': { color: '#901b20' },
                  }}
                  error={!!passwordError}
                  helperText={passwordError}
                  required
                />
                {message && (
                  <Typography color="blue" align="center">{message}</Typography>
                )}
                {error && (
                  <Typography color="red" align="center">{error}</Typography>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={!newPassword || !confirmPassword || passwordError}
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
                    opacity: !newPassword || !confirmPassword || passwordError ? 0.6 : 1,
                  }}
                >
                  Reset Password
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ResetPassword;
