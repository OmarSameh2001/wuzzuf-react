import React, { useState, useEffect, useContext } from "react";
import { AxiosApi } from "../../../../services/Api";
import {
  Container,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  styled,
} from "@mui/material";
import { Check, School } from "@mui/icons-material";
import { getTracks, getBranches } from "../../../../services/Api";
import { userContext } from "../../../../context/UserContext";
import { showErrorToast, showSuccessToast } from "../../../../confirmAlert/toastConfirm";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const SaveButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "8px",
  fontWeight: 700,
  textTransform: "none",
  fontSize: "1.1rem",
  minWidth: 200,
  letterSpacing: 0.5,
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
}));

const EditITI = () => {
  const { user, isLight } = useContext(userContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const locationUserId = location.state?.userId;
  const userId = locationUserId || user?.id;
  const [tracks, setTracks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedTrackId, setSelectedTrackId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const primaryColor = isLight ? "#901b26" : "#d7323e";
  const secondaryColor = isLight ? "#d7323e" : "#901b26";
  const textPrimary = isLight ? "#2d2829" : "#fff";
  const navigate = useNavigate();
  const [selectedGradYear, setSelectedGradYear] = useState("");

  // Generate an array of years from 1993 to current year
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1993; // Change this to the starting year you need
    const years = [];

    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }

    return years;
  };
  
  const yearList = generateYears();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trackRes, branchRes, userRes] = await Promise.all([
          getTracks(),
          getBranches(),
          AxiosApi.get(`user/jobseekers/${userId}/`),
        ]);
  
        setTracks(trackRes);
        setBranches(branchRes);
  
        const userData = userRes.data;
        setSelectedTrackId(userData.track?.id || "");
        setSelectedBranchId(userData.branch?.id || "");
        setSelectedGradYear(userData.iti_grad_year || "");
      } catch (err) {
        setError("Failed to fetch track, branch, or user data.");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("track_id", selectedTrackId);
      formData.append("branch_id", selectedBranchId);
      formData.append("iti_grad_year", selectedGradYear); // Append the graduation year

      await AxiosApi.patch(`user/jobseekers/${userId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSuccessToast("Track and branch updated!", 2000, isLight);

          // Redirect after a short delay (optional)
          setTimeout(() => {
            navigate("/applicant/profile");
          }, 1000); // waits for toast to finish (optional)

    } catch (err) {
      console.error(err);
      showErrorToast("Failed to update track/branch", 2000, isLight);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress sx={{ color: primaryColor }} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading tracks and branches...
        </Typography>
      </Box>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: isLight ? "#transparent" : "#2d2829",
        color: theme.text,
        transition: "background-color 0.3s ease, color 0.3s ease",
        padding: "20px",
      }}
    >
    <Container maxWidth="sm" sx={{ 
      py: 4, 
      backgroundColor: isLight ? "#transparent" : "#2d2829", 
      color: isLight ? "#2d2829" : "white", 
      padding: { xs: 2, sm: 3 },
          width: { xs: "95%", sm: "90%", md: "80%", lg: "70%" },
          mx: "auto",
          my: 4,
          borderRadius: "12px",
          boxShadow: theme.shadow,
          transition: "all 0.3s ease", }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: textPrimary,
            fontSize: isMobile ? "1.8rem" : "2.125rem",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <School fontSize="large" sx={{ color: primaryColor }} />
          Edit ITI Info
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl fullWidth required sx={{
              backgroundColor: isLight
              ? "white"
              : "rgba(255, 255, 255, 0.05)",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#882024",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#882024",
              },
            },
            "& .MuiInputLabel-root": {
              color: isLight
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.7)",
              "&.Mui-focused": {
                color: "white",
              },
            },
            "& .MuiInputBase-input": {
              color: theme.text,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isLight
                ? "rgba(0, 0, 0, 0.23)"
                : "rgba(255, 255, 255, 0.23)",
            },
            }}>
              <InputLabel id="track-label">Track</InputLabel>
              <Select
                labelId="track-label"
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
              >
                {tracks.map((track) => (
                    <MenuItem key={track.id} value={track.id}>
                      {track.name}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
          <FormControl fullWidth required sx={{
            backgroundColor: isLight
            ? "white"
            : "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#882024",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#882024",
            },
          },
          "& .MuiInputLabel-root": {
            color: isLight
              ? "rgba(0, 0, 0, 0.6)"
              : "rgba(255, 255, 255, 0.7)",
            "&.Mui-focused": {
              color: "white",
            },
          },
          "& .MuiInputBase-input": {
            color: theme.text,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: isLight
              ? "rgba(0, 0, 0, 0.23)"
              : "rgba(255, 255, 255, 0.23)",
          },
          }}>
            <InputLabel id="track-grad">Graduation Year</InputLabel>
            <Select
              labelId="track-grad"
              value={selectedGradYear}
              onChange={(e) => setSelectedGradYear(e.target.value)}
            >
              {yearList.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required sx={{
              backgroundColor: isLight
              ? "white"
              : "rgba(255, 255, 255, 0.05)",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#882024",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#882024",
              },
            },
            "& .MuiInputLabel-root": {
              color: isLight
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.7)",
              "&.Mui-focused": {
                color: "white",
              },
            },
            "& .MuiInputBase-input": {
              color: theme.text,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isLight
                ? "rgba(0, 0, 0, 0.23)"
                : "rgba(255, 255, 255, 0.23)",
            },
            }}>
              <InputLabel id="branch-label">Branch</InputLabel>
              <Select
                labelId="branch-label"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
              >
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <SaveButton
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: primaryColor,
                "&:hover": {
                  backgroundColor: secondaryColor,
                  boxShadow: "0px 4px 12px rgba(215, 50, 62, 0.4)",
                },
              }}
              startIcon={<Check />}
            >
              Save Changes
            </SaveButton>
          </Grid>
        </Grid>
      </form>
    </Container>
    </div>
  );
};

export default EditITI;
