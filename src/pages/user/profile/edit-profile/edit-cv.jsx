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
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a PDF or Word document.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB. Please upload a smaller file.");
        return;
      }

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
    goToNextStep("/applicant/profile/review");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <ProfileStepper activeStep={4} />
      <Typography variant="h5" gutterBottom sx={{ color: "#901b20" }}>
        Upload CV
      </Typography>

      <Paper
        elevation={3}
        sx={{
          padding: 2,
          textAlign: "center",
          border: "1px solid #e3b6b8",
        }}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          id="cv-upload"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <label htmlFor="cv-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUpload />}
            sx={{
              backgroundColor: "#901b20",
              "&:hover": { backgroundColor: "#701319" },
            }}
          >
            Upload CV
          </Button>
        </label>

        {cv && (
          <div style={{ marginTop: "15px" }}>
            <Typography variant="body1" sx={{ color: "#333", fontWeight: "500" }}>
              {fileName}
            </Typography>
            <IconButton color="success" href={cv} download={fileName}>
              <FileDownload />
            </IconButton>
            <IconButton sx={{ color: "#FF5C58" }} onClick={handleRemoveFile}>
              <Delete />
            </IconButton>
          </div>
        )}
      </Paper>

      <Button
        variant="contained"
        onClick={handleSave}
        fullWidth
        disabled={!cv}
        sx={{
          marginTop: 2,
          backgroundColor: "#901b20",
          "&:hover": { backgroundColor: "#701319" },
        }}
      >
        Next: Review
      </Button>
    </div>
  );
};

export default EditCV;
