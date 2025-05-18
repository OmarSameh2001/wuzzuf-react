import React, { useState, useContext } from "react";
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
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Alert, // For showing errors/success
} from "@mui/material";
import { FaCheckCircle, FaSearch } from "react-icons/fa"; // Using a check icon for verify


// Import your API service functions
import { getUnverifiedCompanies, verifyCompany } from "../../services/Admin"; // Adjust path as needed
import CompanyVerification from "./CompanyVerification";

import { userContext } from "../../context/UserContext";
import { showErrorToast, showSuccessToast } from "../../confirmAlert/toastConfirm";


function AdminCompany() {
  const { isLight } = useContext(userContext);
  const queryClient = useQueryClient(); // Get QueryClient instance
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [verificationStatus, setVerificationStatus] = useState({ // For feedback
    message: "",
    severity: "info", // 'success' or 'error'
    companyId: null,
  });
  const [searchQuery, setSearchQuery] = useState("");

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


  // --- Data Fetching ---
  const {
    data: companyData, // Rename data to be more specific
    error: fetchError,
    isLoading: isFetching,
    isFetching: isRefetching, // Indicates background refetching
  } = useQuery({
    // Unique query key including pagination parameters
    queryKey: ["unverifiedCompanies", page, rowsPerPage, searchQuery],
    queryFn: async () => {
      const data = await getUnverifiedCompanies(page + 1, rowsPerPage, searchQuery);
      return data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  if (isFetching) {
  }
  
  if (fetchError) {
  }

  // --- Data Mutation (Verification) ---
  const verifyMutation = useMutation({
    mutationFn: verifyCompany, // The function that performs the PATCH request
    onSuccess: (data, companyId) => {
      showSuccessToast("Company verified successfully!", 2000, isLight);
      setVerificationStatus({
        message: data.message || `Company verified successfully!`,
        severity: "success",
        companyId: companyId,
      });
      // Invalidate the query to trigger a refetch
      // This will refetch the *current* page
      queryClient.invalidateQueries({ queryKey: ["unverifiedCompanies"] });
      // Optionally, clear the success message after a few seconds
      setTimeout(() => setVerificationStatus({ message: "", severity: "info", companyId: null }), 3000);
    },
    onError: (error, companyId) => {
      showErrorToast("Failed to verify company", 2000, isLight);
      console.error("Verification failed:", error);
      setVerificationStatus({
        message: `Failed to verify company ${companyId}. ${error?.response?.data?.detail || error.message}`,
        severity: "error",
        companyId: companyId,
      });
      // Optionally, clear the error message after some time
      setTimeout(() => setVerificationStatus({ message: "", severity: "info", companyId: null }), 5000);
    },
  });

  // --- Event Handlers ---
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  const handleVerifyClick = (companyId) => {
     setVerificationStatus({ message: "", severity: "info", companyId: null }); // Clear previous status
     verifyMutation.mutate(companyId); // Trigger the mutation
  };

  // --- Render Logic ---
  const companies = companyData?.results || [];
  const totalCompanies = companyData?.count || 0;

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

      <Typography variant="h5" gutterBottom sx={{ textAlign: "center", mb: 3, fontWeight: 600,
      color: isLight ? "black" : "white"
      }}>
        Verify Companies
      </Typography>

      <TextField
        label="Search by Name or Email"
        variant="outlined"
        fullWidth
        size="small"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(0); // reset to first page when searching
        }}
        InputProps={{
                        startAdornment: <FaSearch style={{ marginRight: 8, opacity: 0.6, }} />,
                      }}
                      sx={{
                        mb: 3,
                        backgroundColor: isLight ? "white" : "rgba(255, 255, 255, 0.05)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#882024",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#882024",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: isLight ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.7)",
                          "&.Mui-focused": {
                            color: "white",
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: theme.text,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isLight ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)",
                        },
                      }}
      />

      {/* Display Feedback Messages */}
      {verificationStatus.message && verificationStatus.companyId && (
        <Alert severity={verificationStatus.severity} sx={{ mb: 2 }}>
          {verificationStatus.message}
        </Alert>
      )}

      {isFetching && ( // Show main loading spinner only on initial load/page change
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {fetchError && ( // Show fetch error
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load companies: {fetchError.message}
        </Alert>
      )}

      {!isFetching && !fetchError && companies.length === 0 && (
         <Typography sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
             No unverified companies found.
         </Typography>
      )}

      {!isFetching && !fetchError && companies.length > 0 && (
        <Paper sx={{ width: "100%", overflow: "hidden", mt: isRefetching ? 1 : 0 }}>
           {/* Optional: Indicate background refetching */}
           {isRefetching && (
             <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, opacity: 0.7}}>
               <CircularProgress size={20} />
               <Typography sx={{ml: 1}} variant="caption">Updating...</Typography>
             </Box>
           )}
         <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="unverified companies table">
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{
                      color: isLight ? "text.primary" : "black",
                      borderColor: isLight
                        ? "grey.300"
                        : "rgba(255, 255, 255, 0.5)",
                      backgroundColor: "rgba(202, 200, 200, 0.5)",
                    }}
                  >
                    Company Name
                  </TableCell>
                  <TableCell 
                    sx={{
                      color: isLight ? "text.primary" : "black",
                      borderColor: isLight
                        ? "grey.300"
                        : "rgba(255, 255, 255, 0.5)",
                      backgroundColor: "rgba(202, 200, 200, 0.5)",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell 
                    sx={{
                      color: isLight ? "text.primary" : "black",
                      borderColor: isLight
                        ? "grey.300"
                        : "rgba(255, 255, 255, 0.5)",
                      backgroundColor: "rgba(202, 200, 200, 0.5)",
                    }}
                  >
                    Accounts
                  </TableCell>
                  <TableCell 
                    sx={{
                      color: isLight ? "text.primary" : "black",
                      borderColor: isLight
                        ? "grey.300"
                        : "rgba(255, 255, 255, 0.5)",
                      backgroundColor: "rgba(202, 200, 200, 0.5)",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company, index) => (
                  <TableRow
                    key={company.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? 
                      (isLight ? "#ffffff" : "#333333") : 
                      (isLight ? "#f9f9f9" : "#444444"),
                    }}
                  >
                    <TableCell sx={{ color: isLight ? "text.primary" : "white" }}>
                      {company.name || "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: isLight ? "text.primary" : "white" }}>
                      {company.email || "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: isLight ? "text.primary" : "white" }}>
                      {company.accounts ? (
                        Object.entries(company.accounts).map(([key, value]) => (
                          value ? (
                            <a
                              key={key}
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: isLight ? "#000" : "#fff" }}
                            >
                              {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                            </a>
                          ) : null
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <CompanyVerification
                        companyId={company.id}
                        onSuccess={() =>
                          queryClient.invalidateQueries({ queryKey: ["unverifiedCompanies"] })
                        }
                        buttonProps={{
                          variant: "contained",
                          size: "small",
                          sx: {
                            backgroundColor: "#882024",
                            color: "#fff",
                            "&:hover": {
                              backgroundColor: "rgb(85, 18, 20)",
                            },
                            textTransform: "none",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            px: 2,
                            py: 1,
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            sx={{
              borderTop: `1px solid ${theme.border}`,
                  color: theme.text,
                  backgroundColor: isLight ? "white" : "#333333",
                  ".MuiTablePagination-toolbar": {
                    display: "flex",
                    justifyContent: "center", // Center all contents
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: 2,
                  }, 
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                    color: theme.muted,
                  },
                  ".MuiTablePagination-select": {
                    color: theme.text,
                  },
                  ".MuiTablePagination-selectIcon": {
                    color: theme.muted,
                  },
                  ".MuiTablePagination-actions button": {
                    color: theme.primary,
                    "&.Mui-disabled": {
                      color: theme.muted,
                    },
                  },
            }}
            rowsPerPageOptions={[5, 10, 25, 50]} // Standard options
            component="div"
            count={totalCompanies} // Total number of items from API
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
    </div>
  );
}

// Header style definition
const headerStyle = {
  backgroundColor: "black", // Or theme primary color: theme.palette.primary.main
  color: "#ffffff",
  fontWeight: "bold",
};

export default AdminCompany;