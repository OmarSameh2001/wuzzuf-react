import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AxiosApi } from "../../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../../../../context/UserContext";

const EditPersonalCom = () => {
  const { user, setUser } = useContext(userContext); // 👈 use setUser here
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ img: null });
  const logoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;

  const [localData, setLocalData] = useState({
    name: "",
    email: "",
    img: "",
    location: "",
    about: "",
    phone: "",
    est: "",
    industry: "",
  });

  useEffect(() => {
    if (user) {
      setLocalData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        img: user.img,
        location: user.location,
        about: user.about,
        phone: user.phone_number,
        est: user.est ? user.est.split("T")[0] : "",
        industry: user.industry,
      }));
    }
  }, [user, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (!file.type.match("image.*")) throw new Error("Please upload a valid image.");
      if (file.size > 10 * 1024 * 1024) throw new Error("File size should be less than 10MB");

      setUploadStatus({ img: "uploading" });
      const formData = new FormData();
      formData.append("img", file);

      const response = await AxiosApi.patch(`user/profile/`, formData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedData = response.data;

      setLocalData((prev) => ({
        ...prev,
        img: updatedData.img,
      }));

      setUser((prev) => ({
        ...prev,
        img: updatedData.img,
      }));

      setUploadStatus({ img: "success" });
    } catch (error) {
      console.error("Error uploading img:", error);
      setUploadStatus({ img: "error" });
      setError(error.message);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        name: localData.name,
        location: localData.location,
        about: localData.about,
        phone_number: localData.phone,
        est: localData.est,
        industry: localData.industry,
      };

      const response = await AxiosApi.patch(`user/profile/`, payload, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      // Update global user state
      setUser((prev) => ({
        ...prev,
        ...response.data,
      }));

      setSuccess(true);
      setError(null);

      // Navigate to next step
      // navigate(`/company/profile`);
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage = err.response?.data
        ? Object.values(err.response.data).join(" ")
        : "Failed to save changes.";
      setError(errorMessage);
    }
  };

  const validateForm = () => {
    const requiredFields = ["name", "location", "phone"];
    const missing = requiredFields.filter((f) => !localData[f]);

    if (missing.length > 0) {
      setError(`Missing required fields: ${missing.join(", ")}`);
      return false;
    }

    return true;
  };

  return (
    <Box sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <h2>Edit Company Profile</h2>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar
          src={localData.img}
          sx={{ width: 80, height: 80, cursor: "pointer" }}
          onClick={() => logoRef.current.click()}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ margin: 0, cursor: "pointer" }}
            onClick={() => logoRef.current.click()}
          >
            {localData.img ? "Change Logo" : "Upload Logo"}
          </Typography>
          {uploadStatus.img === "uploading" && <CircularProgress size={14} />}
        </Box>
        <input
          type="file"
          accept="image/*"
          ref={logoRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
      </Box>

      <TextField
        label="Company Name"
        name="name"
        value={localData.name}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Email"
        name="email"
        value={localData.email}
        fullWidth
        disabled
      />

      <TextField
        label="Location"
        name="location"
        value={localData.location}
        onChange={handleChange}
        fullWidth
      />

      {/* <TextField
        label="About"
        name="about"
        value={localData.about}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
      /> */}

      <TextField
        label="Phone Number"
        name="phone"
        value={localData.phone}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Establishment Date"
        name="est"
        type="date"
        value={localData.est}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="Industry"
        name="industry"
        value={localData.industry}
        onChange={handleChange}
        fullWidth
      />

      <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditPersonalCom;
