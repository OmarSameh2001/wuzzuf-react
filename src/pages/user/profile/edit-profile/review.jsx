import React, { useContext, useState } from "react";  // Added useState here
import { ProfileContext } from "../../../../context/ProfileContext";
import { 
  Button, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
  ListItemText, 
  Box,
  Paper,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../../../services/Auth";
import { userContext } from "../../../../context/UserContext";
import { ArrowBack, CheckCircle, Description, School, Work, Person } from "@mui/icons-material";

const ReviewProfile = () => {
  const { profileData, setProfileData } = useContext(ProfileContext);
  const { setUser } = useContext(userContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);  // Now this will work
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const profileFormData = new FormData();
      profileFormData.append("name", profileData.name);
      profileFormData.append("email", profileData.email);
      profileFormData.append("phone", profileData.phone || "");
      profileFormData.append("location", profileData.location || "");
      profileFormData.append("dob", profileData.dob || "");
      profileFormData.append("about", profileData.about || "");
      profileFormData.append("national_id", profileData.national_id || "");
      profileFormData.append("national_id_img", profileData.national_id_img || "");
      profileFormData.append("img", profileData.img || "");
      profileFormData.append("education", JSON.stringify(profileData.education || []));
      profileFormData.append("experience", JSON.stringify(profileData.experience || []));
      profileFormData.append("skills", JSON.stringify(profileData.skills || []));
      profileFormData.append("cv", profileData.cv || "");

      const response = await updateUserProfile(profileData.id, profileFormData);
      const parsedResponse = {
        ...response.data,
        skills: safeParseJSON(response.data.skills, []),
        education: safeParseJSON(response.data.education, []),
        experience: safeParseJSON(response.data.experience, []),
      };
      
      setUser(parsedResponse);
      setProfileData(parsedResponse);
      navigate("/applicant/profile");
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const safeParseJSON = (json, fallback) => {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  };

  const handleBack = () => {
    navigate("/applicant/profile/edit-cv");
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      padding: 3,
      background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <ProfileStepper activeStep={5} />
      
      <Paper elevation={3} sx={{ 
        width: '100%',
        maxWidth: 800,
        padding: 4,
        marginTop: 3,
        borderRadius: 3
      }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            color: '#901b20',
            marginBottom: 3,
            textAlign: 'center',
            fontWeight: 600
          }}
        >
          Review Your Profile
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderLeft: '4px solid #901b20' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person color="primary" sx={{ mr: 1, color: '#901b20' }} />
              <Typography variant="h6" sx={{ color: '#901b20' }}>
                Personal Information
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Avatar 
                src={profileData.img} 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: { xs: 2, md: 0 },
                  border: '3px solid #901b20'
                }} 
              />
              
              <Box sx={{ flex: 1 }}>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Name" 
                      secondary={profileData.name || "Not provided"} 
                      secondaryTypographyProps={{ color: 'text.primary' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Email" 
                      secondary={profileData.email || "Not provided"} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Phone" 
                      secondary={profileData.phone || "Not provided"} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Location" 
                      secondary={profileData.location || "Not provided"} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Date of Birth" 
                      secondary={profileData.dob || "Not provided"} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="About" 
                      secondary={profileData.about || "Not provided"} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="National ID" 
                      secondary={profileData.national_id || "Not provided"} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="National ID Image" 
                      secondary={
                        profileData.national_id_img ? (
                          <Avatar 
                            src={profileData.national_id_img} 
                            sx={{ width: 100, height: 60, borderRadius: 1, mt: 1 }}
                            variant="square"
                          />
                        ) : "Not provided"
                      } 
                    />
                  </ListItem>
                </List>
              </Box>
            </Box>
          </Paper>

          {/* Education Section */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderLeft: '4px solid #901b20' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <School color="primary" sx={{ mr: 1, color: '#901b20' }} />
              <Typography variant="h6" sx={{ color: '#901b20' }}>
                Education
              </Typography>
            </Box>
            
            {profileData.education?.length > 0 ? (
              <List dense>
                {profileData.education.map((edu, index) => (
                  <ListItem key={index} sx={{ mb: 2 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {edu.degree || 'Degree not specified'}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography component="div" variant="body2">
                            {edu.school || 'School not specified'}
                          </Typography>
                          <Typography component="div" variant="body2">
                            {edu.fieldOfStudy || 'Field of study not specified'}
                          </Typography>
                          <Typography component="div" variant="body2">
                            {edu.startDate || 'Start date not specified'} - {edu.endDate || 'Present'}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No education data available
              </Typography>
            )}
          </Paper>

          {/* Experience Section */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderLeft: '4px solid #901b20' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Work color="primary" sx={{ mr: 1, color: '#901b20' }} />
              <Typography variant="h6" sx={{ color: '#901b20' }}>
                Work Experience
              </Typography>
            </Box>
            
            {profileData.experience?.length > 0 ? (
              <List dense>
                {profileData.experience.map((exp, index) => (
                  <ListItem key={index} sx={{ mb: 2 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {exp.title || 'Position not specified'}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography component="div" variant="body2">
                            {exp.company || 'Company not specified'}
                          </Typography>
                          <Typography component="div" variant="body2">
                            {exp.employmentType || 'Employment type not specified'}
                          </Typography>
                          <Typography component="div" variant="body2">
                            {exp.startDate || 'Start date not specified'} - {exp.currentlyWorking ? 'Present' : exp.endDate || 'End date not specified'}
                          </Typography>
                          {exp.description && (
                            <Typography component="div" variant="body2" sx={{ mt: 1 }}>
                              {exp.description}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No experience data available
              </Typography>
            )}
          </Paper>

          {/* Skills Section */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderLeft: '4px solid #901b20' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle color="primary" sx={{ mr: 1, color: '#901b20' }} />
              <Typography variant="h6" sx={{ color: '#901b20' }}>
                Skills
              </Typography>
            </Box>
            
            {profileData.skills?.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profileData.skills.map((skill, index) => (
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
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No skills data available
              </Typography>
            )}
          </Paper>

          {/* CV Section */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderLeft: '4px solid #901b20' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Description color="primary" sx={{ mr: 1, color: '#901b20' }} />
              <Typography variant="h6" sx={{ color: '#901b20' }}>
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
                View Uploaded CV
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No CV uploaded
              </Typography>
            )}
          </Paper>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined"
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{
                color: '#901b20',
                borderColor: '#901b20',
                '&:hover': {
                  borderColor: '#7a161b',
                  backgroundColor: 'rgba(144, 27, 32, 0.04)'
                }
              }}
            >
              Back to CV
            </Button>
            
            <Button 
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                backgroundColor: '#901b20',
                padding: '10px 24px',
                '&:hover': {
                  backgroundColor: '#7a161b',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(144, 27, 32, 0.3)'
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                  Submitting...
                </>
              ) : (
                'Submit Profile'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReviewProfile;