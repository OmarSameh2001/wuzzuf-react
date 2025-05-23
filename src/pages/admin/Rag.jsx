import React, { useState, useContext, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Box,
  CircularProgress,
  Typography,
  Alert,
  Grid,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { FaTrashAlt, FaFileUpload } from "react-icons/fa";
import { createRag, deleteRag, getRag } from "../../services/ChatBot";
import { set } from "date-fns";
import { userContext } from "../../context/UserContext";
import {
  showConfirmToast,
  showSuccessToast,
} from "../../confirmAlert/toastConfirm";

function AdminRag() {
  const [open, setOpen] = useState(false);
  const { isLight } = useContext(userContext);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // State for file upload form
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // To reset file input

  // State for feedback messages
  const [feedback, setFeedback] = useState({ message: "", severity: "info" });

  // Modern color palette
  const colors = {
    light: {
      background: "#ffffff",
      cardBg: "#ffffff",
      sectionBg: "#f8f9fa",
      text: "#333333",
      accent: "#e63946", // Modern red
      accentHover: "#d62b3a",
      secondary: "#457b9d", // Blue accent
      muted: "#6c757d",
      border: "#dee2e6",
    },
    dark: {
      background: "#121212",
      cardBg: "#1e1e1e",
      sectionBg: "#242424",
      text: "#f8f9fa",
      accent: "#e63946", // Same red accent for consistency
      accentHover: "#f25d69",
      secondary: "#64b5f6", // Lighter blue for dark mode
      muted: "#adb5bd",
      border: "#343a40",
    },
  };

  // Get current theme colors
  const theme = isLight ? colors.light : colors.dark;

  // --- Utility to show feedback ---
  const showFeedback = (message, severity = "info") => {
    setFeedback({ message, severity });
    // Optional: auto-hide feedback after a delay
    // setTimeout(() => setFeedback({ message: "", severity: "info" }), 5000);
  };

  // --- Invalidate Query and Reset Forms ---
  const handleMutationSuccess = (successMessage) => {
    showFeedback(successMessage, "success");
    queryClient.invalidateQueries({ queryKey: ["rags"] });
    // Reset file input
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input visually
    }
    showSuccessToast(successMessage, 2000, isLight);
    setLoading(false);
  };

  const handleMutationError = (error, defaultMessage) => {
    const errorMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error.message ||
      defaultMessage;
    showFeedback(errorMessage, "error");
    setLoading(false);
  };

  // --- Data Fetching (RAG List) ---
  const {
    data: ragData,
    error: fetchError,
    isLoading: isFetchingRags,
    isFetching: isRefetchingRags,
  } = useQuery({
    queryKey: ["rags", page, rowsPerPage], // Key includes pagination
    queryFn: async () => {
      // API expects 1-based page number
      const data = await getRag(page + 1, rowsPerPage);
      return data;
    },
    keepPreviousData: true, // Keep previous data visible while fetching next page
  });

  // --- File Upload Mutation (Create RAG) ---
  const createRagMutation = useMutation({
    mutationFn: createRag, // Our placeholder or actual service call
    onSuccess: (data) =>
      handleMutationSuccess(
        data.message || "File uploaded and will be processed then reflect in the table."
      ),
    onError: (error) => handleMutationError(error, "Failed to upload file."),
  });

  // --- Deletion Mutation ---
  const deleteMutation = useMutation({
    mutationFn: deleteRag, // Our placeholder or actual service call
    onSuccess: (data, ragId) => {
      // ragId is the variable passed to mutate
      showFeedback(data.message || `RAG item deleted successfully!`, "success");
      queryClient.invalidateQueries({ queryKey: ["rags"] }); // Refetch list after deletion
    },
    onError: (error, ragId) => {
      handleMutationError(error, `Failed to delete RAG item ${ragId}.`);
    },
  });

  // --- Event Handlers ---
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      showFeedback(`Selected file: ${file.name}`, "info"); // Show selected file name
    } else {
      setSelectedFile(null);
    }
  };

  const handleBulkSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      showFeedback("Please select a file to upload.", "warning");
      return;
    }
    setLoading(true);
    setFeedback({ message: "", severity: "info" }); // Clear previous feedback

    // Create FormData object to send the file
    const formData = new FormData();
    formData.append("pdf", selectedFile); // 'pdf' should match the key expected by your backend

    createRagMutation.mutate(selectedFile); // Pass the file object to the mutation
  };

  const handleDeleteClick = (rag) => {
    // Optional: Add confirmation dialog here
    showConfirmToast({
      title: "Delete RAG",
      message: `Are you sure you want to delete RAG: ${rag.name}?`,
      onConfirm: () => {
        setFeedback({ message: "", severity: "info" }); // Clear previous feedback
        deleteMutation.mutate(rag._id); // Pass the ID to the mutation
      },
      isLight: isLight,
    });
  };

  // --- Render Logic ---
  const rags = ragData?.results || [];
  const totalRags = ragData?.count || 0;
  const headerStyle = {
    backgroundColor: isLight ? "rgba(161, 161, 161, 0.9)" : "#242424",
    color: "#ffffff",
    fontWeight: "bold",
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: theme.background,
        color: theme.text,
        transition: "background-color 0.3s ease, color 0.3s ease",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          padding: { xs: 2, sm: 3 },
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: theme.text,
          width: { xs: "95%", sm: "90%", md: "80%", lg: "70%" },
          mx: "auto",
          my: 4,
          borderRadius: "12px",
          boxShadow: theme.shadow,
          transition: "all 0.3s ease",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            textAlign: "center",
            mb: 3,
            color: isLight ? "black" : "white", // Text color for dark mode
            "& .MuiInputLabel-root": {
              color: isLight ? "black" : "white", // Label color for dark mode
            },
            "& .MuiInputBase-root": {
              color: isLight ? "black" : "white", // Input text color for dark mode
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isLight ? "grey.300" : "rgba(255, 255, 255, 0.5)", // Lighter border in dark mode
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isLight
                ? "primary.main"
                : "rgba(255, 255, 255, 0.8)", // Hover border color
            },
            fontWeight: 600,
          }}
        >
          Manage RAG Documents
        </Typography>

        {/* Display Feedback Messages
      {feedback.message && (
        <Alert
          severity={feedback.severity}
          sx={{ mb: 2 }}
          onClose={() => setFeedback({ message: "", severity: "info" })}
        >
          {feedback.message}
        </Alert>
      )}

      {/* --- File Upload Form (Bulk Creation) --- */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            {" "}
            {/* Use full width for just one form */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                backgroundColor: isLight ? "white" : "rgba(33, 33, 33, 0.9)", // Adjust background color for dark mode
                filter: isLight
                  ? "brightness(1)"
                  : "brightness(0.7) saturate(0.8)", // Adjust brightness and saturation
                transition: "background-color 0.5s ease, filter 0.5s ease", // Smooth transition for both background and filter
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: theme.text }}>
                Upload Document for RAG
              </Typography>
              <Box
                component="form"
                onSubmit={(e) => {
                  handleBulkSubmit(e);
                }}
                noValidate
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, color: theme.text }}
                >
                  Upload a PDF document (.pdf).
                </Typography>
                <Button
                  variant="outlined"
                  component="label" // Makes the button act like a label for the hidden input
                  fullWidth
                  sx={{
                    mt: 1,
                    mb: 2,
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: "#882024",
                  }}
                  disabled={createRagMutation.isLoading}
                >
                  {selectedFile
                    ? `File: ${selectedFile.name}`
                    : "Choose PDF File"}
                  <input
                    type="file"
                    hidden
                    accept=".pdf" // Accept only PDF files
                    onChange={handleFileChange}
                    ref={fileInputRef} // Assign ref
                    disabled={createRagMutation.isLoading}
                  />
                </Button>
                <Button
                  sx={{
                    mt: 1,
                    mb: 2,
                    backgroundColor: "#882024",
                    color: "white",
                  }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!selectedFile || loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <FaFileUpload />
                    )
                  }
                >
                  {loading ? "Uploading..." : "Upload and Process"}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* --- RAG Table --- */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            textAlign: "center",
            mb: 2,
            color: isLight ? "black" : "white", // Text color for dark mode
            "& .MuiInputLabel-root": {
              color: isLight ? "black" : "white", // Label color for dark mode
            },
            "& .MuiInputBase-root": {
              color: isLight ? "black" : "white", // Input text color for dark mode
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isLight ? "grey.300" : "rgba(255, 255, 255, 0.5)", // Lighter border in dark mode
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isLight
                ? "primary.main"
                : "rgba(255, 255, 255, 0.8)", // Hover border color
            },
          }}
        >
          RAG Documents
        </Typography>

        {/* Loading/Error/Empty States for Table */}
        {isFetchingRags && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {fetchError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load RAG documents: {fetchError.message}
          </Alert>
        )}

        {!isFetchingRags && !fetchError && rags.length === 0 && (
          <Typography
            sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}
          >
            No RAG documents found.
          </Typography>
        )}

        {/* Actual Table */}
        {!isFetchingRags && !fetchError && rags.length > 0 && (
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            {/* Optional: Indicate background refetching */}
            {isRefetchingRags && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 1,
                  opacity: 0.7,
                }}
              >
                <CircularProgress size={20} />
                <Typography sx={{ ml: 1 }} variant="caption">
                  Updating list...
                </Typography>
              </Box>
            )}
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="rag documents table">
                <TableHead>
                  <TableRow>
                    {/* Assuming _id and name are the relevant fields */}
                    <TableCell sx={headerStyle}>ID</TableCell>
                    <TableCell sx={headerStyle}>Name</TableCell>
                    <TableCell sx={headerStyle} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rags.map((rag) => (
                    <TableRow hover key={rag._id}>
                      <TableCell sx={isLight ? null : headerStyle}>
                        {rag._id}
                      </TableCell>
                      <TableCell sx={isLight ? null : headerStyle}>
                        {rag.name}
                      </TableCell>
                      <TableCell
                        sx={isLight ? null : headerStyle}
                        align="center"
                      >
                        <IconButton
                          aria-label="delete rag document"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(rag)} // Use _id for deletion
                          // Disable button for the specific item being deleted
                          disabled={
                            deleteMutation.isLoading &&
                            deleteMutation.variables === rag._id
                          }
                        >
                          {/* Show spinner only for the deleting item */}
                          {deleteMutation.isLoading &&
                          deleteMutation.variables === rag._id ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <FaTrashAlt />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalRags}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                backgroundColor: isLight ? "white" : "rgba(161, 161, 161, 0.9)",
                // color: isLight ? "black" : "white",
              }}
            />
          </Paper>
        )}
      </Box>
    </div>
  );
}

// Header style definition (same as AdminItian)

export default AdminRag;
