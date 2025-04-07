import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { Button, Box, Typography, Grid } from "@mui/material";

const EditCV = () => {
  const { profileData, updateProfile, goToNextStep } =
    useContext(ProfileContext);
  const [cv, setCv] = useState(profileData?.cv || null);
  console.log(profileData);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCv(file);
    }
  };

  const handleSave = () => {
    updateProfile("cv", cv);
    goToNextStep("/applicant/profile/review");
  };
  const handleBack = () => {
    updateProfile("cv", cv);
    goToNextStep("/applicant/profile/edit-skills");
  }

  return (
    <div>
      <ProfileStepper activeStep={4} />
      <Typography variant="h4" gutterBottom>
        Upload CV
      </Typography>
      <Box
        sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ padding: 2, textTransform: "none" }}
            >
              {cv ? "Change CV" : "Upload CV"}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                hidden
              />
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ padding: 0 }}
              onClick={() => setCv(profileData.cv || null)}
            >
              X
            </Button>
          </Grid>
          {cv && (
            <Grid item xs={12}>
              {cv.name ? (
                <Typography variant="body1">
                  Uploaded: <strong>{cv.name}</strong>
                </Typography>
              ) : cv ? (
                <Typography variant="body1">
                  Old Cv:{" "}
                  <a href={cv} target="_blank">
                    view
                  </a>
                </Typography>
              ) : null}
            </Grid>
          )}
        </Grid>
        <Button
          variant="outlined"
          onClick={handleBack}
        >
          Back: Skills
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
        >
          Next: Review
        </Button>
      </Box>
    </div>
  );
};

export default EditCV;
