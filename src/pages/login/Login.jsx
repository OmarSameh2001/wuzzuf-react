import React, { useState } from "react";
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
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { loginUser } from "../../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const res = await loginUser(email, password);
      localStorage.setItem("token", res.token);
      navigate("/"); // Navigate to the home page after successful login
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
        <h2 align="center" className="b612-bold" style={{ fontWeight: "bold" }}>
          Welcome back
        </h2>
        <Divider sx={{ mb: 4 }} />

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
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
                  <Email sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
            }}
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
                  <Lock sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Link component={RouterLink} to="/forget" underline="hover" color="primary">
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
              background: "rgba(148,187,233)",
              borderRadius: 1,
              mt: 2,
              "&:hover": {
                background: "linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
              },
              opacity: !email || password.length < 8 ? 0.6 : 1,
            }}
          >
            Sign In
          </Button>

          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            New to the website?{" "}
            <Link component={RouterLink} to="/register" underline="hover" color="primary">
              Create Account
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
