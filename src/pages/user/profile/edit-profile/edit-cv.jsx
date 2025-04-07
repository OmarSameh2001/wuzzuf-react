import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { Button } from "@mui/material";

const EditCV = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [cv, setCv] = useState(profileData?.cv || null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setCv(fileUrl);
    }
  };

  const handleSave = () => {
    updateProfile("cv", cv);
    goToNextStep("/applicant/profile/review");
  };

  return (
    <div>
      <ProfileStepper activeStep={4} />
      <h2>Upload CV</h2>
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
      {cv && (
        <p>
          Uploaded: <a href={cv} download>Download CV</a>
        </p>
      )}
      <Button variant="contained" onClick={handleSave}>Next: Review</Button>
    </div>
  );
};

export default EditCV;
