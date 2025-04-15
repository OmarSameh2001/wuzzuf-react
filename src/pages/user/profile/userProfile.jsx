
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Avatar,
  Grid,
  Box,
  Divider,
  Chip,
  Paper,
  Container,
  LinearProgress,
  IconButton,
  Tooltip,
  Grow,
  Fade,
  Slide,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  Edit,
  School,
  Work,
  Code,
  Description,
  LocationOn,
  Person,
  Star,
  LinkedIn,
  GitHub,
  Twitter,
  InsertLink
} from "@mui/icons-material";
import { userContext } from "../../../context/UserContext";
import { ThemeProvider, createTheme, keyframes } from '@mui/material/styles';
import { styled } from '@mui/system';

// Custom color palette
const primaryColor = '#d06c79'; // Soft red/pink
const secondaryColor = '#4a7b9d'; // Complementary blue
const accentColor = '#d32c2c'; // Peach accent
const backgroundColor = '#f9f5f4'; // Warm white background
const darkTextColor = '#3a3a3a'; // Dark gray for text
const lightTextColor = '#5d5d5d'; // Lighter gray for secondary text

// Animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Styled components
const ProfileCard = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
  color: 'white',
  fontWeight: 600,
  borderRadius: '12px',
  padding: '10px 24px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  color: primaryColor,
  borderColor: primaryColor,
  borderRadius: '12px',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(208, 108, 121, 0.08)',
    borderColor: primaryColor,
  },
}));

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryColor,
      contrastText: '#ffffff',
    },
    background: {
      default: backgroundColor,
      paper: '#ffffff',
    },
    text: {
      primary: darkTextColor,
      secondary: lightTextColor,
    },
  },
  typography: {
    fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: darkTextColor,
    },
    h5: {
      fontWeight: 700,
      color: darkTextColor,
    },
    h6: {
      fontWeight: 600,
      color: darkTextColor,
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px !important',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, refetchUser } = useContext(userContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    refetchUser();
  }, []);

  // Navigation functions
  const goToEditEducation = () => navigate("/applicant/profile/edit-education");
  const goToEditExperience = () => navigate("/applicant/profile/edit-experience");
  const goToEditSkills = () => navigate("/applicant/profile/edit-skills");
  const goToEditCV = () => user?.id && navigate("/applicant/profile/edit-cv", { state: { userId: user.id } });
  const goToEditPersonal = () => user?.id && navigate("/applicant/profile/edit-personal", { state: { userId: user.id } });
  const ShowRecommendedJobs = () => user?.id && navigate(`/applicant/profile/recom`, { state: { userId: user.id } });

  const calculateProfileCompleteness = () => {
    let completeness = 20;
    if (user?.name) completeness += 10;
    if (user?.about) completeness += 10;
    if (user?.location) completeness += 5;
    if (user?.img) completeness += 5;
    if (user?.education?.length > 0) completeness += 15;
    if (user?.experience?.length > 0) completeness += 15;
    if (user?.skills?.length > 0) completeness += 10;
    if (user?.cv) completeness += 10;
    return Math.min(completeness, 100);
  };

  if (!user) return null;

  const profileCompleteness = calculateProfileCompleteness();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        backgroundColor: backgroundColor, 
        minHeight: '100vh',
        py: isMobile ? 2 : 4,
        px: isMobile ? 1 : 0,
      }}>
        <Container maxWidth="xl" sx={{ px: isMobile ? 2 : 4 }}>
          {/* Profile Header */}
          <Slide direction="down" in={true} mountOnEnter unmountOnExit>
            <ProfileCard elevation={4} sx={{ mb: 3 }}>
              <Box sx={{ 
                height: isMobile ? 100 : 150, 
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
              }} />
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row', 
                alignItems: isMobile ? 'center' : 'flex-start',
                p: isMobile ? 2 : 3, 
                position: 'relative',
                mt: isMobile ? -6 : -8
              }}>
                <Avatar
                  src={user.img || "/default-avatar.png"}
                  sx={{ 
                    width: isMobile ? 96 : 120, 
                    height: isMobile ? 96 : 120, 
                    border: '4px solid white',
                    boxShadow: 3,
                    animation: `${float} 4s ease-in-out infinite`,
                  }}
                />
                
                <Box sx={{ 
                  ml: isMobile ? 0 : 3, 
                  mt: isMobile ? 2 : 0,
                  flex: 1,
                  textAlign: isMobile ? 'center' : 'left',
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexDirection: isMobile ? 'column' : 'row',
                  }}>
                    <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 700 }}>
                      {user.name || "Your Name"}
                    </Typography>
                    <PrimaryButton
                      startIcon={<Edit />}
                      onClick={goToEditPersonal}
                      sx={{ 
                        mt: isMobile ? 2 : 0,
                        animation: `${pulse} 2s infinite`,
                        '&:hover': {
                          animation: 'none',
                        }
                      }}
                    >
                      Edit Profile
                    </PrimaryButton>
                  </Box>
                  
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                    {user.email || "Add a headline or summary about yourself"}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mt: 1, 
                    flexWrap: 'wrap',
                    justifyContent: isMobile ? 'center' : 'flex-start',
                  }}>
                    {user.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                          {user.location}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', mt: isMobile ? 1 : 0 }}>
                      <Tooltip title="LinkedIn">
                        <IconButton size="small" sx={{ mr: 1, color: primaryColor }}>
                          <LinkedIn fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="GitHub">
                        <IconButton size="small" sx={{ mr: 1, color: primaryColor }}>
                          <GitHub fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Personal Website">
                        <IconButton size="small" sx={{ color: primaryColor }}>
                          <InsertLink fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              {/* Profile completeness bar */}
              <Fade in={true} timeout={1000}>
                <Box sx={{ px: 3, pb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Profile Completeness
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {profileCompleteness}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={profileCompleteness} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'rgba(208, 108, 121, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {profileCompleteness >= 80 ? 'Great job! Your profile looks complete.' :
                     profileCompleteness >= 50 ? 'Almost there! Add more details to improve your profile.' :
                     'Your profile needs more information to stand out.'}
                  </Typography>
                </Box>
              </Fade>
            </ProfileCard>
          </Slide>

          <Grid container spacing={isMobile ? 2 : 3}>
            {/* Left Column */}
            <Grid item xs={12} md={8}>
              {/* About Section */}
              <Grow in={true} timeout={800}>
                <ProfileCard elevation={3} sx={{ p: isMobile ? 2 : 3, mb: isMobile ? 2 : 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 1, color: secondaryColor }} />
                      About
                    </Typography>
                    <SecondaryButton 
                      size="small" 
                      startIcon={<Edit />} 
                      onClick={goToEditPersonal}
                    >
                      Edit
                    </SecondaryButton>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {user.about || "Tell potential employers about yourself, your skills, and what you're looking for."}
                  </Typography>
                </ProfileCard>
              </Grow>

              {/* Experience Section */}
              <Grow in={true} timeout={1000}>
                <ProfileCard elevation={3} sx={{ p: isMobile ? 2 : 3, mb: isMobile ? 2 : 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Work sx={{ mr: 1, color: secondaryColor }} />
                      Experience
                    </Typography>
                    <SecondaryButton 
                      size="small" 
                      startIcon={<Edit />} 
                      onClick={goToEditExperience}
                    >
                      {user.experience?.length > 0 ? 'Edit' : 'Add'}
                    </SecondaryButton>
                  </Box>
                  
                  {user.experience?.length > 0 ? (
                    user.experience.map((exp, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {exp.title}
                        </Typography>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                          {exp.company}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </Typography>
                        {exp.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {exp.description}
                          </Typography>
                        )}
                        {index < user.experience.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No experience added yet.
                    </Typography>
                  )}
                </ProfileCard>
              </Grow>

              {/* Education Section */}
              <Grow in={true} timeout={1200}>
                <ProfileCard elevation={3} sx={{ p: isMobile ? 2 : 3, mb: isMobile ? 2 : 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <School sx={{ mr: 1, color: secondaryColor }} />
                      Education
                    </Typography>
                    <SecondaryButton 
                      size="small" 
                      startIcon={<Edit />} 
                      onClick={goToEditEducation}
                    >
                      {user.education?.length > 0 ? 'Edit' : 'Add'}
                    </SecondaryButton>
                  </Box>
                  
                  {user.education?.length > 0 ? (
                    user.education.map((edu, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {edu.degree}
                        </Typography>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                          {edu.school}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {edu.fieldOfStudy}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {edu.startDate} - {edu.endDate || 'Present'}
                        </Typography>
                        {index < user.education.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No education added yet.
                    </Typography>
                  )}
                </ProfileCard>
              </Grow>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={4}>
              {/* Skills Section */}
              <Grow in={true} timeout={800}>
                <ProfileCard elevation={3} sx={{ p: isMobile ? 2 : 3, mb: isMobile ? 2 : 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Code sx={{ mr: 1, color: secondaryColor }} />
                      Skills
                    </Typography>
                    <SecondaryButton 
                      size="small" 
                      startIcon={<Edit />} 
                      onClick={goToEditSkills}
                    >
                      {user.skills?.length > 0 ? 'Edit' : 'Add'}
                    </SecondaryButton>
                  </Box>
                  
                  {user.skills?.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {user.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(208, 108, 121, 0.1)',
                            borderColor: primaryColor,
                            color: darkTextColor,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: primaryColor,
                              color: '#fff',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No skills added yet.
                    </Typography>
                  )}
                </ProfileCard>
              </Grow>

              {/* CV Section */}
              <Grow in={true} timeout={1000}>
                <ProfileCard elevation={3} sx={{ p: isMobile ? 2 : 3, mb: isMobile ? 2 : 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Description sx={{ mr: 1, color: secondaryColor }} />
                      Resume
                    </Typography>
                    <SecondaryButton 
                      size="small" 
                      startIcon={<Edit />} 
                      onClick={goToEditCV}
                    >
                      {user.cv ? 'Update' : 'Upload'}
                    </SecondaryButton>
                  </Box>
                  
                  {user.cv ? (
                    <SecondaryButton
                      variant="outlined"
                      fullWidth
                      component="a"
                      href={user.cv.endsWith(".pdf") ? user.cv : `${user.cv}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </SecondaryButton>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No resume uploaded yet.
                    </Typography>
                  )}
                </ProfileCard>
              </Grow>

              {/* Recommendations Section */}
              <Grow in={true} timeout={1200}>
                <ProfileCard elevation={3} sx={{ p: isMobile ? 2 : 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ mr: 1, color: secondaryColor }} />
                      Recommendations
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Get personalized job recommendations based on your profile.
                  </Typography>
                  <PrimaryButton
                    fullWidth
                    onClick={ShowRecommendedJobs}
                  >
                    View Recommended Jobs
                  </PrimaryButton>
                </ProfileCard>
              </Grow>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default UserProfile;