import React from "react";
import { Stepper, Step, StepLabel } from "@mui/material";

const steps = ["Personal Info", "Education", "Experience", "Skills", "CV & Review"];

const ProfileStepper = ({ activeStep }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ padding: 4 }}>
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default ProfileStepper;
