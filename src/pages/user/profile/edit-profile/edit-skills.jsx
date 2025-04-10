import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { 
  Button, 
  TextField, 
  Box, 
  Chip, 
  Grid, 
  Typography, 
  Paper,
  Divider,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  ArrowBack, 
  ArrowForward, 
  AddCircleOutline,
  HelpOutline
} from "@mui/icons-material";

const MAX_SKILLS = 15;

const EditSkills = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [skills, setSkills] = useState(profileData?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState("");

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    
    if (!trimmedSkill) {
      setError("Skill cannot be empty");
      return;
    }
    
    if (skills.includes(trimmedSkill)) {
      setError("Skill already exists");
      return;
    }
    
    if (skills.length >= MAX_SKILLS) {
      setError(`Maximum ${MAX_SKILLS} skills allowed`);
      return;
    }

    setSkills([...skills, trimmedSkill]);
    setNewSkill("");
    setError("");
  };

  const handleDeleteSkill = (skillToDelete) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile("skills", skills);
    goToNextStep("/applicant/profile/edit-cv");
  };

  const handleBack = () => {
    updateProfile("skills", skills);
    goToNextStep("/applicant/profile/edit-experience");
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
      <ProfileStepper activeStep={3} />
      
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
          Edit Your Skills
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSave}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={9}>
              <TextField
                label="Add a new skill"
                value={newSkill}
                onChange={(e) => {
                  setNewSkill(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                fullWidth
                error={!!error}
                helperText={error}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Press Enter to add skill">
                      <HelpOutline color="action" sx={{ ml: 1 }} />
                    </Tooltip>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button 
                variant="outlined"
                onClick={handleAddSkill}
                startIcon={<AddCircleOutline />}
                disabled={!newSkill.trim() || skills.includes(newSkill.trim()) || skills.length >= MAX_SKILLS}
                fullWidth
                sx={{
                  color: '#901b20',
                  borderColor: '#901b20',
                  '&:hover': {
                    borderColor: '#7a161b',
                    backgroundColor: 'rgba(144, 27, 32, 0.04)'
                  },
                  height: '56px'
                }}
              >
                Add Skill
              </Button>
            </Grid>
          </Grid>

          {skills.length > 0 ? (
            <Paper elevation={0} sx={{ 
              padding: 3,
              backgroundColor: '#f5f5f5',
              borderRadius: 2
            }}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: '#901b20' }}>
                Your Skills ({skills.length}/{MAX_SKILLS})
              </Typography>
              <Box sx={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: 1,
                minHeight: 60
              }}>
                {skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                    sx={{
                      backgroundColor: 'white',
                      borderColor: '#901b20',
                      color: '#901b20',
                      '& .MuiChip-deleteIcon': {
                        color: '#901b20',
                        '&:hover': {
                          color: '#7a161b'
                        }
                      }
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Paper>
          ) : (
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'center', 
                color: 'text.secondary',
                fontStyle: 'italic',
                py: 4
              }}
            >
              No skills added yet. Start adding your skills above.
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

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
              Back to Experience
            </Button>
            
            <Button 
              type="submit"
              variant="contained"
              endIcon={<ArrowForward />}
              disabled={skills.length === 0}
              sx={{
                backgroundColor: '#901b20',
                '&:hover': {
                  backgroundColor: '#7a161b',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(144, 27, 32, 0.3)'
                },
                '&:disabled': {
                  backgroundColor: '#e0e0e0'
                }
              }}
            >
              Continue to CV
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditSkills;