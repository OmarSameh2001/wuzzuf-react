// import React, { useContext, useState } from "react";
// import {
//   TextField,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Button,
//   Typography,
// } from "@mui/material";
// import { getApplicationsByUser } from "../../../services/Application";
// import { useQuery } from "@tanstack/react-query";
// import JobCard from "../../../components/job/JobCard";
// import { userContext } from "../../../context/UserContext";
// import { useNavigate } from "react-router";
// import CustomPagination from "../../../components/pagination/pagination";

// const JobApplication = () => {
//   const { user } = useContext(userContext);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const navigate = useNavigate();

//   const [filters, setFilters] = useState({
//     user: "",
//     job: "",
//     status: "",
//   });

//   const [searchFilters, setSearchFilters] = useState({
//     user: `${user.id}`,
//     job: "",
//     status: "2,3,4,5,6",
//   });

//   const {
//     data: application,
//     error: applicationError,
//     isLoading: applicationLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["application", page, pageSize, searchFilters],
//     queryFn: async () => {
//       const res = await getApplicationsByUser({
//         filters: searchFilters,
//         page,
//         pageSize,
//       });
//       console.log(res);
//       setTotal(res.count);
//       return res.results;
//     },
//   });

//   return (
//     <div className="d-flex flex-column align-items-center w-100" style={{ minHeight: "70vh" }}>
//       <h2 className="m-3">Your Jobs Applications</h2>
//       {application?.length > 0 ? (
//         application.map((application) => (
//           <JobCard
//             key={application.id}
//             job={application.job_details}
//             user={"user"}
//           />
//         ))
//       ) : (
//         <div
//           style={{
//             minHeight: "30vh",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h4">No applications found</Typography>
//           <button
//             className="btn btn-primary"
//             onClick={() => navigate("/applicant/jobs")}
//           >
//             Browse Jobs
//           </button>
//         </div>
//       )}
//       {application && application.length > 0 && (
//         <CustomPagination
//           page={page}
//           setPage={setPage}
//           pageSize={pageSize}
//           setPageSize={setPageSize}
//           total={total}
//         />
//       )}
//     </div>
//   );
// };

// export default JobApplication;

import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from "@mui/material";
import { getApplicationsByUser } from "../../../services/Application";
import { useQuery } from "@tanstack/react-query";
import { userContext } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  WorkOutline,
  Refresh,
  Search,
  ArrowForward
} from "@mui/icons-material";
import  JobCardApp  from "../../../components/job/JobCardApp"; 

const primaryColor = "#d43132";
const secondaryColor = "#f5f5f5";

const JobApplication = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    totalPages: 1,
    totalResults: 0,
  });

  const [filters, setFilters] = useState({
    status: "2,3,4,5,6", // Default to all active statuses
  });

  const {
    data: applications,
    error: applicationsError,
    isLoading: applicationsLoading,
    refetch,
  } = useQuery({
    queryKey: ["applications", user?.id, pagination.page, pagination.pageSize, filters],
    queryFn: async () => {
      if (!user?.id) {
        console.error("User not authenticated");
        return [];
      }
      const response = await getApplicationsByUser({
        filters: {
          user: `${user.id}`,
          ...filters
        },
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(response.count / pagination.pageSize),
        totalResults: response.count,
      }));
      
      return response.results || [];
    },
  });

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (event) => {
    setPagination(prev => ({
      ...prev,
      pageSize: event.target.value,
      page: 1,
    }));
  };

  const handleStatusFilterChange = (event) => {
    setFilters(prev => ({
      ...prev,
      status: event.target.value,
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Box
      sx={{
        p: isMobile ? 1 : 3,
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
          background: "#fff",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          borderBottom: `3px solid ${primaryColor}`
        }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800,
                fontSize: isMobile ? "1.8rem" : "2.125rem",
                color: "#2d3748",
                lineHeight: 1.2,
                mb: 1
              }}
            >
              <span style={{ color: primaryColor }}>Your Job</span> Applications
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              color: "#718096",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}>
              <WorkOutline sx={{ fontSize: 18, color: primaryColor }} />
              {pagination.totalResults} applications found
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2,
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "auto"
          }}>
            <FormControl size="small" sx={{ 
              minWidth: isMobile ? "100%" : 180,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "#fff"
              }
            }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={filters.status}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="2,3,4,5,6">All Active</MenuItem>
                <MenuItem value="1">Applied</MenuItem>
                <MenuItem value="2">Techincal Assessment</MenuItem>
                <MenuItem value="3">Technical Interview</MenuItem>
                <MenuItem value="4">HR Interview</MenuItem>
                <MenuItem value="5">Offered</MenuItem>
                <MenuItem value="6">Rejected</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ 
              minWidth: isMobile ? "100%" : 140,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "#fff"
              }
            }}>
              <InputLabel id="page-size-label">Per page</InputLabel>
              <Select
                labelId="page-size-label"
                value={pagination.pageSize}
                onChange={handlePageSizeChange}
                label="Per page"
              >
                {[6, 12, 18, 24].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button 
              variant="contained"
              onClick={handleRefresh} 
              disabled={applicationsLoading}
              sx={{
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                width: isMobile ? "100%" : "auto",
                backgroundColor: "#2d3748",
                "&:hover": {
                  backgroundColor: "#1a202c",
                },
                "&:disabled": {
                  backgroundColor: "#e2e8f0",
                }
              }}
              startIcon={<Refresh />}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </motion.div>

      {applicationsLoading ? (
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            minHeight: "300px",
            background: "#fff",
            borderRadius: 3,
            p: 4,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
          }}
        >
          <motion.div
            animate={{ 
              rotate: 360,
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{
                color: primaryColor
              }}
            />
          </motion.div>
        </Box>
      ) : applicationsError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              borderLeft: `4px solid ${primaryColor}`
            }}
            icon={false}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Box sx={{ 
                backgroundColor: `${primaryColor}20`,
                p: 1,
                borderRadius: "50%",
                mr: 2,
                display: "flex"
              }}>
                <WorkOutline sx={{ color: primaryColor }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, color: "#2d3748" }}>
                  Couldn't load applications
                </Typography>
                <Typography variant="body2" sx={{ color: "#718096" }}>
                  {applicationsError.message || "Please try refreshing the page"}
                </Typography>
              </Box>
            </Box>
          </Alert>
        </motion.div>
      ) : applications?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            background: "#fff",
            p: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            textAlign: "center",
            borderLeft: `4px solid ${primaryColor}`
          }}>
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `${primaryColor}10`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2
            }}>
              <Search sx={{ 
                fontSize: 40,
                color: primaryColor 
              }} />
            </Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              mb: 1,
              color: "#2d3748"
            }}>
              No applications found
            </Typography>
            <Typography sx={{ 
              color: "#718096",
              mb: 3,
              maxWidth: 500,
              mx: "auto"
            }}>
              {filters.status === "6" 
                ? "You don't have any rejected applications." 
                : filters.status !== "2,3,4,5,6"
                  ? `You don't have any applications with this status.`
                  : "You haven't applied to any jobs yet."}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/applicant/jobs")}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                fontSize: 16,
                backgroundColor: primaryColor,
                "&:hover": {
                  backgroundColor: "#b32828",
                  boxShadow: `0 6px 20px ${primaryColor}33`,
                },
                boxShadow: `0 4px 14px ${primaryColor}33`,
              }}
              endIcon={<ArrowForward />}
            >
              Browse Jobs
            </Button>
          </Box>
        </motion.div>
      ) : (
        <>
          <Box sx={{ 
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(450px, 1fr))",
            gap: 3,
            mb: 4
          }}>
            <AnimatePresence>
              {applications?.map((application, index) => (
                < JobCardApp 
                  key={application.id}
                  application={application}
                  index={index}
                  primaryColor={primaryColor}
                />
              ))}
            </AnimatePresence>
          </Box>

          <Box
            sx={{
              mt: "auto",
              display: "flex",
              justifyContent: "center",
              py: 3,
              position: "sticky",
              bottom: 0,
              backgroundColor: "#fff",
              zIndex: 1,
              borderTop: `1px solid #e2e8f0`,
              boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)"
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
            >
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size={isMobile ? "small" : "medium"}
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontWeight: 600,
                    color: "#4a5568",
                    "&.Mui-selected": {
                      backgroundColor: primaryColor,
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#b32828",
                      }
                    },
                  }
                }}
              />
            </motion.div>
          </Box>
        </>
      )}
    </Box>
  );
};

export default JobApplication;