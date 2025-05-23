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
  Alert,
} from "@mui/material";
import { getApplicationsByUser } from "../../../services/Application";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import JobCardApp from "../../../components/job/JobCardApp";
import { userContext } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  WorkOutline,
  Refresh,
  Search,
  ArrowForward,
} from "@mui/icons-material";

const JobApplication = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, isLight } = useContext(userContext);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    totalPages: 1,
    totalResults: 0,
  });

  const [filters, setFilters] = useState({
    user: "",
    job: "",
    fail: 'False',
    status: "2,3,4,5,6,7",
  });
  const [statusFilter, setStatusFilter] = useState("2,3,4,5,6"); // default to all active statuses

  const [searchFilters, setSearchFilters] = useState({
    user: `${user?.id}`,
    job: "",
    status: "2,3,4,5,6",
  });

  const {
    data: application,
    error: applicationError,
    isLoading: applicationLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      "applications",
      user?.id,
      pagination.page,
      pagination.pageSize,
      filters,
    ],
    queryFn: async () => {
      if (!user?.id) {
        console.error("User not authenticated");
        return [];
      }
      const newFilters = {
        ...filters,
        user: user?.id,
      };
      const response = await getApplicationsByUser({
        filters: newFilters,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(response.count / pagination.pageSize),
        totalResults: response.count,
      }));

      return response.results || [];
    },
  });

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (event) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: event.target.value,
      page: 1,
    }));
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    if (event.target.value == 8) {
      setFilters((prev) => ({
        ...prev,
        status: "2,3,4,5,6",
        fail: 'True',
      }));

      setPagination((prev) => ({ ...prev, page: 1 }));
      return;
    }

    setFilters((prev) => ({
      ...prev,
      status: event.target.value,
      fail: 'False',
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRefresh = () => {
    refetch();
  };

  const primaryColor = "#d43132";
  const secondaryColor = "#f5f5f5";

  return (
    <Box
      sx={{
        backgroundColor: isLight ? "#f5f5f5" : "#242424",
        maxWidth: "100vw",
        minWidth: "99vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        // overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: isMobile ? 1 : 3,
          // maxWidth: "1200px",
          width: "80%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: isLight ? "#fff" : "#121212",
          margin: "10px 0",
          borderRadius: "10px",
          // color: isLight ? "#2d3748" : '#fff'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
              background: isLight ? "#fff" : "#121212",
              p: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              borderBottom: `3px solid ${primaryColor}`,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: isMobile ? "1.8rem" : "2.125rem",
                  color: isLight ? "#2d3748" : "#fff",
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                <span style={{ color: primaryColor }}>Your Job</span>{" "}
                Applications
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#718096",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <WorkOutline sx={{ fontSize: 18, color: primaryColor }} />
                {pagination.totalResults} applications found
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexDirection: isMobile ? "column" : "row",
                width: isMobile ? "100%" : "auto",
              }}
            >
              <FormControl
                size="small"
                sx={{
                  minWidth: 140,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: isLight ? "#fff" : "#121212",
                    color: isLight ? "black" : "white",
                    border: "0.5px solid #901b20",
                  },
                  "& .css-lohd6h-MuiSvgIcon-root-MuiSelect-icon": {
                    color: isLight ? "black" : "white",
                  },
                  "& .css-1rju2q6-MuiButtonBase-root-MuiMenuItem-root": {
                    color: isLight ? "black" : "white",
                    background: isLight ? "#fff" : "#121212",
                  },
                }}
              >
                <InputLabel
                  id="status-filter-label"
                  sx={{ color: isLight ? "black" : "white" }}
                >
                  Status
                </InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e)}
                  label="Status"
                >
                  <MenuItem value="2,3,4,5,6">All Active</MenuItem>
                  <MenuItem value="2">Applied</MenuItem>
                  <MenuItem value="3">Technical Assessment</MenuItem>
                  <MenuItem value="4">Technical Interview</MenuItem>
                  <MenuItem value="5">Hr Interview</MenuItem>
                  <MenuItem value="6">Offer Phase</MenuItem>
                  <MenuItem value="7">Contract Phase</MenuItem>
                  <MenuItem value="8">Rejected</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                size="small"
                sx={{
                  minWidth: 140,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: isLight ? "#fff" : "#121212",
                    color: isLight ? "black" : "white",
                    border: "0.5px solid #901b20",
                  },
                  "& .css-lohd6h-MuiSvgIcon-root-MuiSelect-icon": {
                    color: isLight ? "black" : "white",
                  },
                  "& .css-1rju2q6-MuiButtonBase-root-MuiMenuItem-root": {
                    color: isLight ? "black" : "white",
                    background: isLight ? "#fff" : "#121212",
                  },
                }}
              >
                <InputLabel
                  id="page-size-label"
                  sx={{ color: isLight ? "black" : "white" }}
                >
                  Per page
                </InputLabel>
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
                disabled={applicationLoading || isFetching}
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
                  },
                }}
                startIcon={
                  isFetching ? (
                    <CircularProgress size={20} color="white" />
                  ) : (
                    <Refresh />
                  )
                }
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </motion.div>

        {applicationLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
              background: isLight ? "#fff" : "#121212",
              borderRadius: 3,
              p: 4,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <CircularProgress
                size={60}
                thickness={4}
                sx={{
                  color: primaryColor,
                }}
              />
            </motion.div>
          </Box>
        ) : applicationError ? (
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
                borderLeft: `4px solid ${primaryColor}`,
                background: isLight ? "#fff" : "#121212",
              }}
              icon={false}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Box
                  sx={{
                    backgroundColor: isLight ? `${primaryColor}20` : "#121212",
                    p: 1,
                    borderRadius: "50%",
                    mr: 2,
                    display: "flex",
                  }}
                >
                  <WorkOutline sx={{ color: primaryColor }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: isLight ? "#2d3748" : "#fff",
                    }}
                  >
                    Couldn't load applications
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: isLight ? "#718096" : "#fff" }}
                  >
                    {applicationsError.message ||
                      "Please try refreshing the page"}
                  </Typography>
                </Box>
              </Box>
            </Alert>
          </motion.div>
        ) : application?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                background: isLight ? "#fff" : "#121212",
                p: 4,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                textAlign: "center",
                borderLeft: `4px solid ${primaryColor}`,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `${primaryColor}10`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Search
                  sx={{
                    fontSize: 40,
                    color: primaryColor,
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: isLight ? "#2d3748" : "#fff",
                }}
              >
                No applications found
              </Typography>
              <Typography
                sx={{
                  color: "#718096",
                  mb: 3,
                  maxWidth: 500,
                  mx: "auto",
                }}
              >
                {statusFilter === "7"
                  ? "You don't have any rejected applications."
                  : statusFilter !== "2,3,4,5,6"
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fill, minmax(450px, 1fr))",
                gap: 3,
                mb: 4,
              }}
            >
              <AnimatePresence>
                {application?.map((application, index) => (
                  <JobCardApp
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
                backgroundColor: isLight ? "#fff" : "#121212",
                zIndex: 1,
                // borderTop: `1px solid #e2e8f0`,
                boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              <motion.div whileHover={{ scale: 1.02 }}>
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
                      color: isLight ? "#121212" : "white",
                      "&.Mui-selected": {
                        backgroundColor: primaryColor,
                        color: isLight ? "#121212" : "#fff",
                        "&:hover": {
                          backgroundColor: "#b32828",
                        },
                      },
                    },
                  }}
                />
              </motion.div>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default JobApplication;
// import React, { useContext, useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   CircularProgress,
//   Chip,
//   IconButton,
//   useMediaQuery,
//   useTheme,
//   Pagination,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Alert
// } from "@mui/material";
// import { getApplicationsByUser } from "../../../services/Application";
// import { useQuery } from "@tanstack/react-query";
// import { userContext } from "../../../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   WorkOutline,
//   Refresh,
//   Search,
//   ArrowForward
// } from "@mui/icons-material";
// import  JobCardApp  from "../../../components/job/JobCardApp";

// const primaryColor = "#d43132";
// const secondaryColor = "#f5f5f5";

// const JobApplication = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const { user } = useContext(userContext);
//   const navigate = useNavigate();

//   const [pagination, setPagination] = useState({
//     page: 1,
//     pageSize: 6,
//     totalPages: 1,
//     totalResults: 0,
//   });

//   const [filters, setFilters] = useState({
//     status: "2,3,4,5,6", // Default to all active statuses
//   });

//   const {
//     data: applications,
//     error: applicationsError,
//     isLoading: applicationLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["applications", user?.id, pagination.page, pagination.pageSize, filters],
//     queryFn: async () => {
//       if (!user?.id) {
//         console.error("User not authenticated");
//         return [];
//       }
//       const response = await getApplicationsByUser({
//         filters: {
//           user: `${user.id}`,
//           ...filters
//         },
//         page: pagination.page,
//         pageSize: pagination.pageSize,
//       });

//       setPagination(prev => ({
//         ...prev,
//         totalPages: Math.ceil(response.count / pagination.pageSize),
//         totalResults: response.count,
//       }));

//       return response.results || [];
//     },
//   });

//   const handlePageChange = (event, newPage) => {
//     setPagination(prev => ({ ...prev, page: newPage }));
//   };

//   const handlePageSizeChange = (event) => {
//     setPagination(prev => ({
//       ...prev,
//       pageSize: event.target.value,
//       page: 1,
//     }));
//   };

//   const handleStatusFilterChange = (event) => {
//     setFilters(prev => ({
//       ...prev,
//       status: event.target.value,
//     }));
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleRefresh = () => {
//     refetch();
//   };

//   return (
//     <Box
//       sx={{
//         p: isMobile ? 1 : 3,
//         maxWidth: "1200px",
//         margin: "0 auto",
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         background: "#fff",
//       }}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Box sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 3,
//           flexWrap: "wrap",
//           gap: 2,
//           background: "#fff",
//           p: 3,
//           borderRadius: 3,
//           boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
//           borderBottom: `3px solid ${primaryColor}`
//         }}>
//           <Box>
//             <Typography
//               variant="h4"
//               sx={{
//                 fontWeight: 800,
//                 fontSize: isMobile ? "1.8rem" : "2.125rem",
//                 color: "#2d3748",
//                 lineHeight: 1.2,
//                 mb: 1
//               }}
//             >
//               <span style={{ color: primaryColor }}>Your Job</span> Applications
//             </Typography>
//             <Typography variant="subtitle1" sx={{
//               color: "#718096",
//               display: "flex",
//               alignItems: "center",
//               gap: 1
//             }}>
//               <WorkOutline sx={{ fontSize: 18, color: primaryColor }} />
//               {pagination.totalResults} applications found
//             </Typography>
//           </Box>

//           <Box sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//             flexDirection: isMobile ? "column" : "row",
//             width: isMobile ? "100%" : "auto"
//           }}>
//             <FormControl size="small" sx={{
//               minWidth: isMobile ? "100%" : 180,
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: 2,
//                 background: "#fff"
//               }
//             }}>
//               <InputLabel id="status-filter-label">Status</InputLabel>
//               <Select
//                 labelId="status-filter-label"
//                 value={filters.status}
//                 onChange={handleStatusFilterChange}
//                 label="Status"
//               >
//                 <MenuItem value="2,3,4,5,6">All Active</MenuItem>
//                 <MenuItem value="1">Applied</MenuItem>
//                 <MenuItem value="2">Techincal Assessment</MenuItem>
//                 <MenuItem value="3">Technical Interview</MenuItem>
//                 <MenuItem value="4">HR Interview</MenuItem>
//                 <MenuItem value="5">Offered</MenuItem>
//                 <MenuItem value="6">Rejected</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{
//               minWidth: isMobile ? "100%" : 140,
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: 2,
//                 background: "#fff"
//               }
//             }}>
//               <InputLabel id="page-size-label">Per page</InputLabel>
//               <Select
//                 labelId="page-size-label"
//                 value={pagination.pageSize}
//                 onChange={handlePageSizeChange}
//                 label="Per page"
//               >
//                 {[6, 12, 18, 24].map((size) => (
//                   <MenuItem key={size} value={size}>
//                     {size}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <Button
//               variant="contained"
//               onClick={handleRefresh}
//               disabled={applicationLoading}
//               sx={{
//                 px: 3,
//                 borderRadius: 2,
//                 textTransform: "none",
//                 fontWeight: 600,
//                 width: isMobile ? "100%" : "auto",
//                 backgroundColor: "#2d3748",
//                 "&:hover": {
//                   backgroundColor: "#1a202c",
//                 },
//                 "&:disabled": {
//                   backgroundColor: "#e2e8f0",
//                 }
//               }}
//               startIcon={<Refresh />}
//             >
//               Refresh
//             </Button>
//           </Box>
//         </Box>
//       </motion.div>

//       {applicationLoading ? (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: "300px",
//             background: "#fff",
//             borderRadius: 3,
//             p: 4,
//             boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
//           }}
//         >
//           <motion.div
//             animate={{
//               rotate: 360,
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "linear"
//             }}
//           >
//             <CircularProgress
//               size={60}
//               thickness={4}
//               sx={{
//                 color: primaryColor
//               }}
//             />
//           </motion.div>
//         </Box>
//       ) : applicationsError ? (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Alert
//             severity="error"
//             sx={{
//               mb: 3,
//               borderRadius: 3,
//               boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
//               borderLeft: `4px solid ${primaryColor}`
//             }}
//             icon={false}
//           >
//             <Box sx={{ display: "flex", alignItems: "flex-start" }}>
//               <Box sx={{
//                 backgroundColor: `${primaryColor}20`,
//                 p: 1,
//                 borderRadius: "50%",
//                 mr: 2,
//                 display: "flex"
//               }}>
//                 <WorkOutline sx={{ color: primaryColor }} />
//               </Box>
//               <Box>
//                 <Typography sx={{ fontWeight: 600, color: "#2d3748" }}>
//                   Couldn't load applications
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: "#718096" }}>
//                   {applicationsError.message || "Please try refreshing the page"}
//                 </Typography>
//               </Box>
//             </Box>
//           </Alert>
//         </motion.div>
//       ) : applications?.length === 0 ? (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Box sx={{
//             background: "#fff",
//             p: 4,
//             borderRadius: 3,
//             boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
//             textAlign: "center",
//             borderLeft: `4px solid ${primaryColor}`
//           }}>
//             <Box sx={{
//               width: 80,
//               height: 80,
//               borderRadius: "50%",
//               background: `${primaryColor}10`,
//               display: "inline-flex",
//               alignItems: "center",
//               justifyContent: "center",
//               mb: 2
//             }}>
//               <Search sx={{
//                 fontSize: 40,
//                 color: primaryColor
//               }} />
//             </Box>
//             <Typography variant="h6" sx={{
//               fontWeight: 700,
//               mb: 1,
//               color: "#2d3748"
//             }}>
//               No applications found
//             </Typography>
//             <Typography sx={{
//               color: "#718096",
//               mb: 3,
//               maxWidth: 500,
//               mx: "auto"
//             }}>
//               {filters.status === "6"
//                 ? "You don't have any rejected applications."
//                 : filters.status !== "2,3,4,5,6"
//                   ? `You don't have any applications with this status.`
//                   : "You haven't applied to any jobs yet."}
//             </Typography>
//             <Button
//               variant="contained"
//               onClick={() => navigate("/applicant/jobs")}
//               sx={{
//                 px: 4,
//                 py: 1.5,
//                 borderRadius: 2,
//                 fontWeight: 600,
//                 textTransform: "none",
//                 fontSize: 16,
//                 backgroundColor: primaryColor,
//                 "&:hover": {
//                   backgroundColor: "#b32828",
//                   boxShadow: `0 6px 20px ${primaryColor}33`,
//                 },
//                 boxShadow: `0 4px 14px ${primaryColor}33`,
//               }}
//               endIcon={<ArrowForward />}
//             >
//               Browse Jobs
//             </Button>
//           </Box>
//         </motion.div>
//       ) : (
//         <>
//           <Box sx={{
//             display: "grid",
//             gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(450px, 1fr))",
//             gap: 3,
//             mb: 4
//           }}>
//             <AnimatePresence>
//               {applications?.map((application, index) => (
//                 < JobCardApp
//                   key={application.id}
//                   application={application}
//                   index={index}
//                   primaryColor={primaryColor}
//                 />
//               ))}
//             </AnimatePresence>
//           </Box>

//           <Box
//             sx={{
//               mt: "auto",
//               display: "flex",
//               justifyContent: "center",
//               py: 3,
//               position: "sticky",
//               bottom: 0,
//               backgroundColor: "#fff",
//               zIndex: 1,
//               borderTop: `1px solid #e2e8f0`,
//               boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)"
//             }}
//           >
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//             >
//               <Pagination
//                 count={pagination.totalPages}
//                 page={pagination.page}
//                 onChange={handlePageChange}
//                 color="primary"
//                 shape="rounded"
//                 size={isMobile ? "small" : "medium"}
//                 sx={{
//                   "& .MuiPaginationItem-root": {
//                     fontWeight: 600,
//                     color: "#4a5568",
//                     "&.Mui-selected": {
//                       backgroundColor: primaryColor,
//                       color: "#fff",
//                       "&:hover": {
//                         backgroundColor: "#b32828",
//                       }
//                     },
//                   }
//                 }}
//               />
//             </motion.div>
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// };

// export default JobApplication;
