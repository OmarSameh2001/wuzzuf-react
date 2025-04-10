import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Lottie from "lottie-react";
import animationData from '../../assets/Otp.json';


const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "","",""]);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    try {
      const response = await axios.post("http://localhost:8000/user/verify-otp/", {
        email,
        otp: fullOtp,
      });

      if (response.data.message === "OTP verified successfully!") {
        alert("OTP Verified Successfully! You can now log in.");
        localStorage.removeItem("email");
        navigate("/login");
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
        minHeight: "100vh",
        // backgroundColor: "#f8f8f8",
        px: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "#fff",
          boxShadow: 3,
          textAlign: "center",
          position: "relative",
        }}
      >
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ 
            position: 'absolute',
            left: 16,
            top: 16
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ height: 180, mb: 2 }}>
          <Lottie
            animationData={animationData}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
        </Box>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Verify Your Email
        </Typography>
        <Typography variant="body2" mb={3} color="text.secondary">
          We've sent a 6-digit code to <strong>{email}</strong>
        </Typography>

        <Box component="form" onSubmit={handleVerify}>
          <Grid container spacing={1.5} justifyContent="center" sx={{ mb: 3 }}>
            {otp.map((digit, index) => (
              <Grid item xs={2} sm={2} key={index}>
                <input
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  autoFocus={index === 0}
                  style={{
                    width: "100%",
                    height: "56px",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#ff5252";
                    e.target.style.boxShadow = "0 0 0 2px rgba(255,82,82,0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0e0e0";
                    e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Typography variant="body2" mt={2} color="text.secondary">
            Didn't receive code?{" "}
            <Button 
              variant="text" 
              size="small" 
              sx={{ 
                textTransform: "none",
                color: "#ff5252",
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}
            >
              Resend OTP
            </Button>
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={otp.join("").length !== 6}
            sx={{ 
              mt: 3, 
              py: 1.5,
              backgroundColor: "#ff5252",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#e53935",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(255,82,82,0.3)"
              },
              "&:disabled": {
                backgroundColor: "#e53935",
                color: "#ffffff"
              },
              transition: "all 0.3s ease",
            }}
          >
            Verify
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default VerifyOTP;

