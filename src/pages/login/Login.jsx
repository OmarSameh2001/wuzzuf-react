import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Link,
//   Box,
//   InputAdornment,
//   Divider,
//   Grid,
//   Checkbox,
//   FormControlLabel,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { Email, Lock } from "@mui/icons-material";
import { loginUser } from "../../services/Auth";
import { userContext } from "../../context/UserContext";
import Lottie from "lottie-react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import animationData from "../../assets/animations/LoginRegister.json";
import "../../styles/registerLogin/login.css";
import {
  showErrorToast,
  showSuccessToast,
} from "../../confirmAlert/toastConfirm";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const { setUser, refetchUser, setToken, isLight } = useContext(userContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleLogin() {
    setIsLoading(true);
    try {
      const res = await loginUser(email, password);
      refetchUser(res);
      showSuccessToast("Welcome back!", 2000, isLight);
      navigate("/");
    } catch (error) {
      // Clear user/token if login failed
      
      setIsLoading(false);
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");

      console.log(error)

      // Extract message from backend if available
      const backendMessage = error.response.data.error;
      showErrorToast(backendMessage || "Login failed. Please check your email and password!", 2000, isLight);
      setError("");
      
      // // Set the custom error message
      // setSnackbarMessage(backendMessage);
      // setOpenSnackbar(true);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleLogin();
  }

  return (
    <div className="login-container" style={{backgroundImage: isLight ? "linear-gradient(135deg, #f8f9fa 0%, #e9d8d9 100%)" : 'linear-gradient(135deg, #242424 0%, #121212 100%)'}}>
      <div
        className="login-wrapper"
        style={{
          backgroundColor: isLight ? "#f7eded" : "#242424",
          boxShadow: isLight ? "0 10px 25px rgba(144, 27, 33, 0.1)" : '0 10px 25px #121212',
        }}
      >
        <div
          className="login-animation-container"
          style={{ backgroundColor: isLight ? "#f7eded" : "#121212" }}
        >
          <Lottie
            animationData={animationData}
            loop={true}
            className="login-animation"
          />
        </div>

        <div className="login-form-container">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <div className="login-divider"></div>
          </div>

          {/* Replace the error display JSX with an empty fragment since we're using toast now */}
          {error && <></>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label" style={{color: isLight ? "#495057" : "#901b21"}}>
                Email Address
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: "2.75rem" }}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label" style={{color: isLight ? "#495057" : "#901b21"}}>
                  Password
                </label>
                <RouterLink to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </RouterLink>
              </div>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: "2.75rem" }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  onChange={() => setShowPassword(!showPassword)}
                  checked={showPassword}
                />
                <span className="checkbox-label" style={{color: isLight ? "#495057" : "#901b21"}}>Show Password</span>
              </label>
            </div>

            <button
              type="submit"
              className={`login-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading || !email || password.length < 5}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <p className="signup-prompt" style={{color: isLight ? "#495057" : "#fff"}}>
              New to the website?{" "}
              <RouterLink to="/register" className="signup-link">
                Create Account
              </RouterLink>
            </p>
          </form>
        </div>
      </div>
    </div>

    // <Box
    //   sx={{
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     width: "90%",
    //     height: "90%",
    //     minHeight: "80vh",
    //   }}
    // >
    //   <Container maxWidth="lg">
    //     <Grid container spacing={2}>
    //       <Grid item xs={12} md={6}>
    //         <Box
    //           sx={{
    //             display: "flex",
    //             justifyContent: "center",
    //             alignItems: "center",
    //             height: "100%",
    //             backgroundColor: "rgba(247, 237, 237, 0.95)",
    //             borderRadius: 2,
    //           }}
    //         >
    //           <Lottie
    //             animationData={animationData}
    //             loop={true}
    //             style={{ width: "100%", height: "auto" }}
    //           />
    //         </Box>
    //       </Grid>
    //       <Grid item xs={12} md={6}>
    //         <Box
    //           sx={{
    //             p: 4,
    //             boxShadow: 3,
    //             borderRadius: 2,
    //             backgroundColor: "rgba(255, 255, 255, 0.95)",
    //             backdropFilter: "blur(10px)",
    //             border: "1px solid rgba(144, 27, 32, 0.2)",
    //             height: "100%",
    //             display: "flex",
    //             flexDirection: "column",
    //             justifyContent: "center",
    //           }}
    //         >
    //           <Typography
    //             variant="h5"
    //             align="center"
    //             fontWeight="bold"
    //             gutterBottom
    //             sx={{ color: "#901b20" }}
    //           >
    //             Login
    //           </Typography>
    //           <Divider
    //             sx={{
    //               mb: 4,
    //               backgroundColor: "#901b20",
    //               height: 2,
    //             }}
    //           />

    //           <Box
    //             component="form"
    //             onSubmit={handleSubmit}
    //             sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    //           >
    //             <TextField
    //               fullWidth
    //               label="Email Address"
    //               placeholder="john.doe@example.com"
    //               variant="outlined"
    //               type="email"
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}
    //               InputProps={{
    //                 startAdornment: (
    //                   <InputAdornment position="start">
    //                     <Email sx={{ color: "#901b20" }} />
    //                   </InputAdornment>
    //                 ),
    //               }}
    //               sx={{
    //                 "& .MuiOutlinedInput-root": {
    //                   "& fieldset": {
    //                     borderColor: "#901b20",
    //                   },
    //                   "&:hover fieldset": {
    //                     borderColor: "#901b20",
    //                   },
    //                 },
    //                 "& .MuiInputLabel-root": {
    //                   color: "#901b20",
    //                 },
    //               }}
    //               required
    //             />

    //             <TextField
    //               fullWidth
    //               label="Password"
    //               type={showPassword ? "text" : "password"}
    //               variant="outlined"
    //               placeholder="••••••••"
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)}
    //               InputProps={{
    //                 startAdornment: (
    //                   <InputAdornment position="start">
    //                     <Lock sx={{ color: "#901b20" }} />
    //                   </InputAdornment>
    //                 ),
    //               }}
    //               sx={{
    //                 "& .MuiOutlinedInput-root": {
    //                   "& fieldset": {
    //                     borderColor: "#901b20",
    //                   },
    //                   "&:hover fieldset": {
    //                     borderColor: "#901b20",
    //                   },
    //                 },
    //                 "& .MuiInputLabel-root": {
    //                   color: "#901b20",
    //                 },
    //               }}
    //               required
    //             />

    //             <FormControlLabel
    //               control={
    //                 <Checkbox
    //                   checked={showPassword}
    //                   onChange={() => setShowPassword(!showPassword)}
    //                   sx={{
    //                     color: "#901b20",
    //                     "& .MuiSvgIcon-root": {
    //                       fontSize: 18,  // Reduced the checkbox icon size
    //                     },
    //                   }}
    //                 />
    //               }
    //               label="Show Password"
    //               sx={{
    //                 color: "#901b20",
    //                 fontSize: "0.75rem",  // Reduced font size of the label
    //               }}
    //             />

    //             <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
    //               <Link
    //                 component={RouterLink}
    //                 to="/forgot-password"
    //                 underline="hover"
    //                 sx={{ color: "#901b20", fontWeight: "bold" }}
    //               >
    //                 Forgot Password?
    //               </Link>
    //             </Box>

    //             <Button
    //               fullWidth
    //               variant="contained"
    //               size="large"
    //               type="submit"
    //               disabled={!email || password.length < 5}
    //               sx={{
    //                 mt: 2,
    //                 py: 1.5,
    //                 background: "linear-gradient(45deg, #901b20 30%, #c12e3d 90%)",
    //                 boxShadow: "0 3px 5px 2px rgba(144, 27, 32, .3)",
    //                 "&:hover": {
    //                   transform: "translateY(-2px)",
    //                   transition: "transform 0.2s",
    //                   background: "#901b20",
    //                 },
    //                 opacity: !email || password.length < 5 ? 0.6 : 1,
    //               }}
    //             >
    //               Sign In
    //             </Button>

    //             <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
    //               New to the website?{" "}
    //               <Link
    //                 component={RouterLink}
    //                 to="/register"
    //                 underline="hover"
    //                 sx={{ color: "#901b20", fontWeight: "bold" }}
    //               >
    //                 Create Account
    //               </Link>
    //             </Typography>
    //           </Box>
    //         </Box>
    //       </Grid>
    //     </Grid>
    //   </Container>

    //   {/* Snackbar for error message */}
    //   <Snackbar
    //     open={openSnackbar}
    //     autoHideDuration={5000} // Set duration as desired
    //     onClose={() => setOpenSnackbar(false)}
    //     anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Positioned at the top center
    //   >
    //     <Alert
    //       onClose={() => setOpenSnackbar(false)}
    //       severity="error"
    //       sx={{
    //         width: "100%",
    //         // backgroundColor: "#f44336",
    //         color: "black",  // Text color for better contrast
    //         fontWeight: "bold",
    //         padding: "15px",  // Increased padding
    //         fontSize: "1rem", // Increased font size
    //         borderRadius: "10px", // Rounded corners
    //         border: "2px solid red", // White border to make it stand out
    //       }}
    //     >
    //       {snackbarMessage}
    //     </Alert>
    //   </Snackbar>
    // </Box>
  );
}

export default Login;
