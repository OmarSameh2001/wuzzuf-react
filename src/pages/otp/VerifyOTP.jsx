import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("email"); // Retrieve email from localStorage

  console.log('email: ', email);
  console.log('otp: ', otp);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/user/verify-otp/", {
        email,
        otp,
      });

      if (response.data.message === "OTP verified successfully!") {
        alert("OTP Verified Successfully! You can now log in.");
        localStorage.removeItem("email"); // Clear stored email
        localStorage.removeItem("otp"); // Clear stored email
        navigate("/login"); // Redirect to login page
      } else {
        alert("Invalid OTP, please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed", error);
      alert("OTP verification failed. Please try again.");
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
          Verify OTP
        </Typography>

        <Box component="form" onSubmit={handleVerify} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
          <TextField
            fullWidth
            label="Enter OTP"
            type="text"
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <Button fullWidth variant="contained" size="large" type="submit" sx={{ mt: 2 }}>
            Verify OTP
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default VerifyOTP;
