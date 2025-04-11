import React, { use,useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Box,
  Divider,
  Chip,
  CircularProgress,
  IconButton
} from "@mui/material";
import { ProfileContext } from "../../../context/ProfileContext";
import { userContext } from "../../../context/UserContext";
import { Edit, School, Work, Code, Description } from "@mui/icons-material";

const UserProfile = () => {
  const navigate = useNavigate();
  const { profileData, setProfileData } = useContext(ProfileContext);
  const { user, refetchUser } = useContext(userContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setIsLoading(false);
    }
  }, [user, setProfileData]);

  // Navigation functions
  const goToEditEducation = () => navigate("/applicant/profile/edit-education");
  const goToEditExperience = () => navigate("/applicant/profile/edit-experience");
  const goToEditSkills = () => navigate("/applicant/profile/edit-skills");
  const goToEditCV = () => navigate("/applicant/profile/edit-cv");
  const goToEditPersonal = () => navigate("/applicant/profile/edit-personal");

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#901b20' }} />
      </Box>
    );
  }

  if (!profileData) return null;

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        padding: "20px",
        justifyContent: "center",
        backgroundColor: '#f8f9fa'
      }}
    >
      <Grid item xs={12} md={8}>
        <Card
          sx={{
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: 'white'
          }}
        >
          {/* Top Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: "20px",
              paddingBottom: "20px",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Avatar
              src={profileData.img || "/default-avatar.png"}
              sx={{ 
                width: 100, 
                height: 100,
                border: '3px solid #901b20'
              }}
            />
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: '#901b20' }}>
                {profileData.name || "Your Name"}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                {profileData.about || "Add a headline or summary about yourself"}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {profileData.location || "Not provided"}
              </Typography>
              <Button
                variant="outlined"
                onClick={goToEditPersonal}
                sx={{ 
                  mt: 2,
                  color: '#901b20',
                  borderColor: '#901b20',
                  '&:hover': {
                    borderColor: '#7a161b',
                    backgroundColor: 'rgba(144, 27, 32, 0.04)'
                  }
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>

          {/* Main Section */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* Left Side */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  mb: 2, 
                  padding: "15px",
                  borderLeft: '4px solid #901b20'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <School sx={{ color: '#901b20', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Education
                  </Typography>
                </Box>
                {profileData.education?.length > 0 ? (
                  profileData.education.map((edu, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {edu.degree || 'Degree not specified'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {edu.school || 'School not specified'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {edu.fieldOfStudy || 'Field not specified'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {edu.startDate || 'Start date not specified'} - {edu.endDate || 'Present'}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No education added
                  </Typography>
                )}
                <Button
                  variant="text"
                  onClick={goToEditEducation}
                  sx={{ 
                    mt: 1,
                    color: '#901b20',
                    '&:hover': {
                      backgroundColor: 'rgba(144, 27, 32, 0.08)'
                    }
                  }}
                  startIcon={<Edit />}
                >
                  Edit Education
                </Button>
              </Card>

              <Card 
                sx={{ 
                  mb: 2, 
                  padding: "15px",
                  borderLeft: '4px solid #901b20'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Work sx={{ color: '#901b20', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Experience
                  </Typography>
                </Box>
                {profileData.experience?.length > 0 ? (
                  profileData.experience.map((exp, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {exp.title || 'Position not specified'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {exp.company || 'Company not specified'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {exp.startDate || 'Start date not specified'} - {exp.currentlyWorking ? 'Present' : exp.endDate || 'End date not specified'}
                      </Typography>
                      {exp.description && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          {exp.description}
                        </Typography>
                      )}
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No experience added
                  </Typography>
                )}
                <Button
                  variant="text"
                  onClick={goToEditExperience}
                  sx={{ 
                    mt: 1,
                    color: '#901b20',
                    '&:hover': {
                      backgroundColor: 'rgba(144, 27, 32, 0.08)'
                    }
                  }}
                  startIcon={<Edit />}
                >
                  Edit Experience
                </Button>
              </Card>
            </Grid>

            {/* Right Side */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  mb: 2, 
                  padding: "15px",
                  borderLeft: '4px solid #901b20'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Code sx={{ color: '#901b20', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Skills
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {profileData.skills?.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{
                          backgroundColor: 'white',
                          borderColor: '#901b20',
                          color: '#901b20'
                        }}
                        variant="outlined"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No skills added
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="text"
                  onClick={goToEditSkills}
                  sx={{ 
                    mt: 1,
                    color: '#901b20',
                    '&:hover': {
                      backgroundColor: 'rgba(144, 27, 32, 0.08)'
                    }
                  }}
                  startIcon={<Edit />}
                >
                  Edit Skills
                </Button>
              </Card>

              <Card 
                sx={{ 
                  padding: "15px",
                  borderLeft: '4px solid #901b20'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Description sx={{ color: '#901b20', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    CV
                  </Typography>
                </Box>
                {profileData.cv ? (
                  <Button
                    variant="outlined"
                    href={profileData.cv}
                    target="_blank"
                    startIcon={<Description />}
                    sx={{
                      color: '#901b20',
                      borderColor: '#901b20',
                      '&:hover': {
                        borderColor: '#7a161b'
                      }
                    }}
                  >
                    View CV
                  </Button>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No CV uploaded
                  </Typography>
                )}
                <Button
                  variant="text"
                  onClick={goToEditCV}
                  sx={{ 
                    mt: 1,
                    color: '#901b20',
                    '&:hover': {
                      backgroundColor: 'rgba(144, 27, 32, 0.08)'
                    }
                  }}
                  startIcon={<Edit />}
                >
                  Edit CV
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserProfile;