import React, { useContext } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import {
  Button,
  Typography,
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { useNavigate, useLocation } from "react-router-dom";
import { userContext } from "../../../../context/UserContext";

const ReviewProfile = () => {
  const { profileData } = useContext(ProfileContext);
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const location = useLocation();
  const locationUserId = location.state?.userId;
  const userId = locationUserId || user?.id;

  const handleSubmit = () => {
    navigate("/applicant/profile");
  };

  const handleBack = () => {
    navigate("/applicant/profile/edit-cv", { state: { userId } });
  };

  return (
    <Grid container justifyContent="center" sx={{ p: 3 }}>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* <ProfileStepper activeStep={6} /> */}
          <Typography variant="h4" align="center" gutterBottom>
            Review Your Profile
          </Typography>

          <Box sx={{ textAlign: "center", my: 3 }}>
            <Avatar
              src={profileData.img}
              sx={{ width: 120, height: 120, mx: "auto" }}
            />
          </Box>

          <Divider>
            <Typography variant="h6">Personal Information</Typography>
          </Divider>
          <Box sx={{ my: 2 }}>
            <Typography fontWeight="bold">
              Name: <Typography component="span">{user.name}</Typography>
            </Typography>
            <Typography fontWeight="bold">
              Email: <Typography component="span">{user.email}</Typography>
            </Typography>
            <Typography fontWeight="bold">
              Phone: <Typography component="span">{user.phone || "Not provided"}</Typography>
            </Typography>
            <Typography fontWeight="bold">
              Location: <Typography component="span">{user.location || "Not provided"}</Typography>
            </Typography>
            <Typography fontWeight="bold">
              Date of Birth: <Typography component="span">{user.dob || "Not provided"}</Typography>
            </Typography>
            <Typography fontWeight="bold">
              About: <Typography component="span">{user.about || "Not provided"}</Typography>
            </Typography>
            <Typography fontWeight="bold">
              National ID: <Typography component="span">{user.national_id || "Not provided"}</Typography>
            </Typography>
            {user.national_id_img ? (
              <Avatar
                src={user.national_id_img}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  my: 1,
                  boxShadow: 3,
                }}
              />
            ) : (
              <Typography>National ID Image: Not provided</Typography>
            )}
          </Box>

          <Divider>
            <Typography variant="h6">Education</Typography>
          </Divider>
          <Box sx={{ my: 2 }}>
            {user.education?.length ? (
              user.education.map((edu, index) => (
                <Typography key={index}>
                  {`${edu.degree} at ${edu.school} (${edu.fieldOfStudy}) from ${edu.startDate} to ${edu.endDate}`}
                </Typography>
              ))
            ) : (
              <Typography>No education data available</Typography>
            )}
          </Box>

          <Divider>
            <Typography variant="h6">Experience</Typography>
          </Divider>
          <Box sx={{ my: 2 }}>
            {user.experience?.length ? (
              user.experience.map((exp, index) => (
                <Typography key={index}>
                  {`${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate})`}
                </Typography>
              ))
            ) : (
              <Typography>No experience data available</Typography>
            )}
          </Box>

          <Divider>
            <Typography variant="h6">Skills</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 2 }}>
            {user.skills?.length ? (
              user.skills.map((skill, index) => (
                <Chip key={index} label={skill} />
              ))
            ) : (
              <Typography>No skills provided</Typography>
            )}
          </Box>

          <Divider>
            <Typography variant="h6">CV</Typography>
          </Divider>
          <Box sx={{ my: 2 }}>
            {user.cv ? (
              <Typography>
                CV:{" "}
                <a
                  href={`https://res.cloudinary.com/dkvyfbtdl/raw/upload/${user.cv}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View CV
                </a>
              </Typography>
            ) : (
              <Typography>No CV uploaded</Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit Profile
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ReviewProfile;

