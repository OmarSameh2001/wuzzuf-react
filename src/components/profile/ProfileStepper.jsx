import React from "react";
import { Stepper, Step, StepLabel } from "@mui/material";

const steps = ["Personal Info", "Education", "Experience", "Skills", "CV ","Review"];

const ProfileStepper = ({ activeStep }) => {
  return (
    <Stepper 
      activeStep={activeStep} 
      alternativeLabel 
      sx={{ 
        padding: 4,
        "& .MuiStepConnector-line": {
          borderColor: "#901b20"
        },
        "& .MuiStepIcon-root.Mui-active": {
          color: "#901b20"
        },
        "& .MuiStepIcon-root.Mui-completed": {
          color: "#901b20"
        }
      }}
    >
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel 
            StepIconProps={{
              style: {
                color: activeStep > index ? "#901b20" : "#ccc"
              }
            }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default ProfileStepper;