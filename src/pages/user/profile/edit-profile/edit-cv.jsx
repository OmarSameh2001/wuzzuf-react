import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { Button, Typography, Paper, IconButton } from "@mui/material";
import { CloudUpload, Delete, FileDownload } from "@mui/icons-material";

const EditCV = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [cv, setCv] = useState(profileData?.cv || null);
  const [fileName, setFileName] = useState(profileData?.cvName || "");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a PDF or Word document.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB. Please upload a smaller file.");
        return;
      }

      // Store file and name
      const fileUrl = URL.createObjectURL(file);
      setCv(fileUrl);
      setFileName(file.name);
    }
  };

  const handleRemoveFile = () => {
    setCv(null);
    setFileName("");
  };

  const handleSave = () => {
    updateProfile("cv", cv);
    updateProfile("cvName", fileName);
    goToNextStep("/user/profile/review");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <ProfileStepper activeStep={4} />
      <Typography variant="h5" gutterBottom>Upload CV</Typography>

      <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          id="cv-upload"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <label htmlFor="cv-upload">
          <Button variant="contained" component="span" startIcon={<CloudUpload />}>
            Upload CV
          </Button>
        </label>

        {cv && (
          <div style={{ marginTop: "15px" }}>
            <Typography variant="body1">{fileName}</Typography>
            <IconButton color="primary" href={cv} download={fileName}>
              <FileDownload />
            </IconButton>
            <IconButton color="error" onClick={handleRemoveFile}>
              <Delete />
            </IconButton>
          </div>
        )}
      </Paper>

      <Button
        variant="contained"
        onClick={handleSave}
        fullWidth
        sx={{ marginTop: 2 }}
        disabled={!cv}
      >
        Next: Review
      </Button>
    </div>
  );
};

export default EditCV;
