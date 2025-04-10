import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
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
import { Email, Lock } from "@mui/icons-material";
import { loginUser } from "../../services/Auth";
import { userContext } from "../../context/UserContext";
import Lottie from "lottie-react";
import animationData from '../../assets/LoginRegister.json'; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);

  async function handleLogin() {
    try {
      const res = await loginUser(email, password);
      localStorage.setItem("token", res.token);
      setUser(res);
      navigate("/");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleLogin();
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        hight: "90%",
        minHeight: "80vh",
        // background: "",
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
                Login
              </Typography>
              <Divider sx={{ 
                mb: 4, 
                backgroundColor: "#901b20",
                height: 2,
              }} />

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  placeholder="john.doe@example.com"
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
                      '& fieldset': {
                        borderColor: '#901b20',
                      },
                      '&:hover fieldset': {
                        borderColor: '#901b20',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#901b20',
                    },
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#901b20" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#901b20',
                      },
                      '&:hover fieldset': {
                        borderColor: '#901b20',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#901b20',
                    },
                  }}
                  required
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Link 
                    component={RouterLink} 
                    to="/forget" 
                    underline="hover" 
                    sx={{ color: "#901b20", fontWeight: 'bold' }}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={!email || password.length < 5}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background: "linear-gradient(45deg, #901b20 30%, #c12e3d 90%)",
                    boxShadow: "0 3px 5px 2px rgba(144, 27, 32, .3)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      transition: "transform 0.2s",
                      background: "#901b20",
                    },
                    opacity: !email || password.length < 5 ? 0.6 : 1,
                  }}
                >
                  Sign In
                </Button>

                <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                  New to the website?{" "}
                  <Link 
                    component={RouterLink} 
                    to="/register" 
                    underline="hover" 
                    sx={{ color: "#901b20", fontWeight: 'bold' }}
                  >
                    Create Account
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Login;