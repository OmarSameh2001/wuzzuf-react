import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Chip,
  IconButton,
  Collapse,
  TextField,
} from "@mui/material";
import { userContext } from "../../../context/UserContext";
import { AxiosApi } from "../../../services/Api";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  BookmarkBorder,
  Bookmark,
  LocationOn,
  Business,
  WorkOutline,
  Schedule,
  Refresh,
  ArrowForward,
  Upload,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import CustomAutoComplete from "../../../components/autoComplete/CustomAutoComplete";
import { SearchIcon } from "lucide-react";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { FiTrendingUp } from "react-icons/fi";
import { TbPercentage } from "react-icons/tb";
const RecommendedJobs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, isLight } = useContext(userContext);

  const navigate = useNavigate();
  // const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expand, setExpand] = useState(false);

  const primaryColor = isLight ? "#d43132" : "#901b26";
  const secondaryColor = "#f5f5f5";
  const experienceOptions = [
    "Intern",
    "Junior",
    "Mid-Level",
    "Senior",
    "Lead",
    "Manager",
  ];

  const [filters, setFilters] = useState({
    title: "",
    location: "",
    experince: "",
    type_of_job: "",
    attend: "",
    status: "1",
    ordering: "",
    specialization: "",
    company_name: "",
  });

  const [searchFilters, setSearchFilters] = useState({
    title: "",
    location: "",
    experince: "",
    type_of_job: "",
    attend: "",
    status: "1",
    ordering: "",
    specialization: "",
    company_name: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    totalPages: 1,
    totalResults: 0,
  });
  const {
    data: jobs,
    error: jobsError,
    isLoading: jobsLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["jobsRecomm", user?.id, pagination.page, pagination.pageSize, searchFilters],
    queryFn: async () => {
      if (!user?.id) {
        console.error("User not authenticated");
        return [];
      }
      try {
        const params = new URLSearchParams({
          ...searchFilters,
          page: pagination.page,
          page_size: pagination.pageSize,
        });
        const response = await AxiosApi.get(`jobs/recom/${user.id}/?${params.toString()}`);
        const data = response.data;
        setPagination((prev) => ({
          ...prev,
          totalPages: Math.ceil(data.total_results / pagination.pageSize),
          totalResults: data.total_results,
        }));
        return data.recommendations || [];
      } catch (error) {
       console.error(error);
       setPagination((prev) => ({ ...prev, totalPages: 1, totalResults: 0 }));
        return []; 
      }
      
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

  const handleJobClick = (jobId) => {
    navigate(`/applicant/jobs/${jobId}`);
  };

  const handleRefresh = () => {
    refetch();
  };
  const hasFilters = Object.values(filters).some(
    (value) => value !== "" && value !== "1"
  );
  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearchFilters(filters);
  };

  const handleReset = () => {
    setFilters({
      title: "",
      location: "",
      experince: "",
      type_of_job: "",
      attend: "",
      status: "1",
      ordering: "",
      specialization: "",
      company_name: "",
    });
    setSearchFilters({
      title: "",
      location: "",
      experince: "",
      type_of_job: "",
      attend: "",
      status: "1",
      ordering: "",
      specialization: "",
      company_name: "",
    });
    setFilters(defaultFilters);
    setSearchFilters(defaultFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
    refetch(); // Fetch without filters
  };

  if (!user?.cv) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          background: isLight
            ? "linear-gradient(135deg, #f9f9f9 0%, #fff 100%)"
            : "linear-gradient(135deg, #161616 0%, #2c2c2c 100%)",
          borderRadius: 3,
          mx: isMobile ? 1 : 3,
          my: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              backgroundColor: "#fff4f4",
              p: 3,
              borderRadius: 3,
              borderLeft: `4px solid ${primaryColor}`,
              maxWidth: 600,
              mb: 4,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: primaryColor,
                mb: 1,
              }}
            >
              <WorkOutline sx={{ verticalAlign: "middle", mr: 1 }} />
              Complete Your Profile
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Upload your CV to unlock personalized job recommendations tailored
              to your skills and experience.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/applicant/profile/edit-cv")}
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
              startIcon={<Upload />}
            >
              Upload CV Now
            </Button>
          </Box>
        </motion.div>
      </Box>
    );
  }
  useEffect(() => {
    console.log(filters)
  }, [filters]);
  return (
    <Box
      sx={{ background: isLight ? "#f9f9f9" : "#242424", minWidth: "100vw" }}
    >
      <Box
        sx={{
          p: isMobile ? 1 : 3,
          maxWidth: "1200px",
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: isLight ? "#fff" : "#121212",
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
              background: isLight ? "#fff" : "#242424",
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
                <span style={{ color: primaryColor }}>Recommended</span> Jobs
                For You
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
                <Business sx={{ fontSize: 18, color: primaryColor }} />
                {pagination.totalResults} jobs matched your profile and filters
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
                  style={{ color: isLight ? "black" : "white" }}
                >
                  Jobs per page
                </InputLabel>
                <Select
                  labelId="page-size-label"
                  value={pagination.pageSize}
                  onChange={handlePageSizeChange}
                  label="Jobs per page"
                >
                  {[6, 12, 18, 20, 24].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleRefresh}
                disabled={jobsLoading || isFetching}
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
                startIcon={isFetching ? <CircularProgress size={20} color="white"/> : <Refresh />}
              >
                Refresh
              </Button>
              
            </Box>
          </Box>
          <Box
          sx={{
            background: isLight ? "#fff" : "#242424",
            p: 3,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            mb: 3,
            borderBottom: `3px solid ${primaryColor}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: isLight ? "#2d3748" : "white",
            }}
          >
            Search Filters
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              size="small"
              label="Job Title"
              name="title"
              value={filters.title}
              onChange={handleChange}
              sx={{
                flex: "1 1 200px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: isLight ? "#fff" : "#121212",
                  color: isLight ? "black" : "white",
                  "& fieldset": {
                    borderColor: "#901b20",
                  },
                  "&:hover fieldset": {
                    borderColor: "#901b20",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: isLight ? "black" : "white",
                },
                "& .MuiInputBase-input": {
                  backgroundColor: isLight
                    ? "rgba(255, 255, 255, 0.95)"
                    : "#121212",
                  color: isLight ? "black" : "white",
                  paddingLeft: 1,
                  borderRadius: "10px",
                },
              }}
            />

            {/* <TextField
              size="small"
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              sx={{
                flex: "1 1 200px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: isLight ? "#fff" : "#121212",
                  color: isLight ? "black" : "white",
                  "& fieldset": {
                    borderColor: "#901b20",
                  },
                  "&:hover fieldset": {
                    borderColor: "#901b20",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: isLight ? "black" : "white",
                },
                "& .MuiInputBase-input": {
                  backgroundColor: isLight
                    ? "rgba(255, 255, 255, 0.95)"
                    : "#121212",
                  color: isLight ? "black" : "white",
                  paddingLeft: 1,
                  borderRadius: "10px",
                },
              }}
            /> */}

            <TextField
              size="small"
              label="Company"
              name="company_name"
              value={filters.company_name}
              onChange={handleChange}
              sx={{
                flex: "1 1 200px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: isLight ? "#fff" : "#121212",
                  color: isLight ? "black" : "white",
                  "& fieldset": {
                    borderColor: "#901b20",
                  },
                  "&:hover fieldset": {
                    borderColor: "#901b20",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: isLight ? "black" : "white",
                },
                "& .MuiInputBase-input": {
                  backgroundColor: isLight
                    ? "rgba(255, 255, 255, 0.95)"
                    : "#121212",
                  color: isLight ? "black" : "white",
                  paddingLeft: 1,
                  borderRadius: "10px",
                },
              }}
            />
            
          </Box>
          <Collapse in={expand} timeout={500} orientation="vertical">
            <Box sx={{ display: "flex", gap: 2, flexDirection: "column", mb: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
            <CustomAutoComplete
              getter={filters.location}
              setter={setFilters}
              label={"Location"}
              value={"location"}
              border={"#901b20"}
              background={isLight ? "#fff" : "#121212"}
              multiple={true}
              type={'egypt'}
            />
            <CustomAutoComplete
                  options={experienceOptions}
                  getter={filters.experince}
                  setter={setFilters}
                  value={"experince"}
                  label={"Experince"}
                  border={"#901b20"}
                  background={isLight ? "#fff" : "#121212"}
                  multiple={true}
                />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
            <CustomAutoComplete
              getter={filters.attend}
              setter={setFilters}
              options={["Onsite", "Hybrid", "Remote"]}
              label={"Attendance"}
              value={"attend"}
              border={"#901b20"}
              background={isLight ? "#fff" : "#121212"}
              multiple={true}
            />
            <CustomAutoComplete
              getter={filters.type_of_job}
              setter={setFilters}
              options={["Full-time", "Part-time", "Internship", "Freelance"]}
              label={"Job Type"}
              value={"type_of_job"}
              border={"#901b20"}
              background={isLight ? "#fff" : "#121212"}
              multiple={true}
            />
            </Box>

            <CustomAutoComplete
              setter={setFilters}
              getter={filters.specialization}
              border={"#901b20"}
              background={isLight ? "#fff" : "#121212"}
              value={"specialization"}
              label={"Specialization"}
              multiple={true}
            />
          </Box>
          </Collapse>
          <Box sx={{ display: "flex", justifyContent: 'space-between', flexWrap:'wrap' }}>
            <Box sx={{ display: "flex", gap: 2}}>
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={!hasFilters}
              sx={{
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                borderColor: primaryColor,
                color: primaryColor,
                "&:hover": {
                  borderColor: "#b32828",
                  backgroundColor: `${primaryColor}10`,
                },
                "&:disabled": {
                  borderColor: "#e2e8f0",
                  color: "#a0aec0",
                },
              }}
              startIcon={<FaFilterCircleXmark />}
            >
              Reset
            </Button>

            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={!hasFilters}
              sx={{
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: primaryColor,
                "&:hover": {
                  backgroundColor: "#b32828",
                  boxShadow: `0 6px 20px ${primaryColor}33`,
                },
                "&:disabled": {
                  backgroundColor: "#e2e8f0",
                },
                boxShadow: `0 4px 14px ${primaryColor}33`,
              }}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
            </Box>
            <Button
              variant="contained"
              onClick={() => setExpand(!expand)}
              sx={{
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: primaryColor,
                "&:hover": {
                  backgroundColor: "#b32828",
                  boxShadow: `0 6px 20px ${primaryColor}33`,
                },
                "&:disabled": {
                  backgroundColor: "#e2e8f0",
                },
                boxShadow: `0 4px 14px ${primaryColor}33`,
              }}
              startIcon={expand ? <ExpandLess /> : <ExpandMore />}
            >
              {expand ? "Close Filters" : "Expand Filters"}
            </Button>
          </Box>
        </Box>
        </motion.div>

        {jobsLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
              background: isLight ? "#fff" : "#242424",
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
        ) : jobsError ? (
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
              }}
              icon={false}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Box
                  sx={{
                    backgroundColor: `${primaryColor}20`,
                    p: 1,
                    borderRadius: "50%",
                    mr: 2,
                    display: "flex",
                  }}
                >
                  <Business sx={{ color: primaryColor }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: "#2d3748" }}>
                    Couldn't load recommendations
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    {jobsError.message || "Please try refreshing the page"}
                  </Typography>
                </Box>
              </Box>
            </Alert>
          </motion.div>
        ) : jobs?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                background: isLight ? "#fff" : "#242424",
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
                <WorkOutline
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
                  color: "#2d3748",
                }}
              >
                No matching jobs found
              </Typography>
              <Typography
                sx={{
                  color: "#718096",
                  mb: 3,
                  maxWidth: 500,
                  mx: "auto",
                }}
              >
                We couldn't find any jobs matching your profile. Try updating
                your skills or broadening your search criteria.
              </Typography>
              <Button
                variant="outlined"
                onClick={handleRefresh}
                sx={{
                  borderColor: primaryColor,
                  color: primaryColor,
                  fontWeight: 600,
                  px: 4,
                  "&:hover": {
                    backgroundColor: `${primaryColor}10`,
                    borderColor: primaryColor,
                  },
                }}
              >
                Try Again
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
                {jobs?.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                    }}
                    whileHover={{
                      y: -5,
                    }}
                  >
                    <Box
                      onClick={() => handleJobClick(job.id)}
                      sx={{
                        border: "1px solid",
                        borderColor: "#e2e8f0",
                        borderRadius: "12px",
                        padding: isMobile ? 2 : 3,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        backgroundColor: isLight ? "#fff" : "#242424",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        "&:hover": {
                          borderColor: primaryColor,
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        },
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Bookmark button */}
                      {/* <IconButton
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          zIndex: 2,
                          color: "#cbd5e0",
                          "&:hover": {
                            color: primaryColor,
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle bookmark logic here
                        }}
                      >
                        <BookmarkBorder />
                      </IconButton> */}

                      {/* Match score ribbon */}
                      {job.score && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: primaryColor,
                            color: "white",
                            px: 2,
                            py: 0.5,
                            borderBottomLeftRadius: 12,
                            fontSize: 12,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            zIndex: 1,
                          }}
                        >
                          {(job.score * 100).toFixed(2)}% Match
                        </Box>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "12px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #edf2f7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
                            mr: 2,
                          }}
                        >
                          <img
                            src={
                              job.company_logo ||
                              "https://static.thenounproject.com/png/3198584-200.png"
                            }
                            alt={job.company_name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: isLight ? "#2d3748" : "#fff",
                              mb: 0.5,
                              pr: 4,
                            }}
                          >
                            {job.title}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <Chip
                              icon={<Business sx={{ fontSize: 16 }} />}
                              label={job.company_name}
                              size="small"
                              sx={{
                                backgroundColor: isLight ? "#f8fafc" : '#121212',
                                color: isLight ? "#4a5568" : '#fff',
                                fontWeight: 500,
                              }}
                            />
                            <Chip
                              icon={<LocationOn sx={{ fontSize: 16 }} />}
                              label={job.location}
                              size="small"
                              sx={{
                                backgroundColor: isLight ? "#f8fafc" : '#121212',
                                color: isLight ? "#4a5568" : '#fff',
                                fontWeight: 500,
                              }}
                            />
                            <Chip
                              icon={<FiTrendingUp sx={{ fontSize: 16 }} />}
                              label={job.experince}
                              size="small"
                              sx={{
                                backgroundColor: isLight ? "#f8fafc" : '#121212',
                                color: isLight ? "#4a5568" : '#fff',
                                fontWeight: 500,
                              }}
                            />
                          </Box>
                          {job.type_of_job && (
                            <Box>
                            <Chip
                              icon={<Schedule sx={{ fontSize: 16 }} />}
                              label={job.type_of_job}
                              size="small"
                              sx={{
                                backgroundColor: isLight ? `${primaryColor}10` : '#121212',
                                color: isLight ? primaryColor : 'red',
                                fontWeight: 500,
                              }}
                            />
                            {/* <Chip
                              icon={<TbPercentage sx={{ fontSize: 16 }} />}
                              label={(job.score * 100).toFixed(2)}
                              size="small"
                              sx={{
                                backgroundColor: isLight ? `${primaryColor}10` : '#121212',
                                color: primaryColor,
                                fontWeight: 500,
                              }}
                            /> */}
                          </Box>
                          )}
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 2,
                          color: "#4a5568",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          lineHeight: 1.6,
                          position: "relative",
                          "&:after": {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "32px",
                            background:
                              isLight ? "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))" : "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))",
                          },
                        }}
                      >
                        {job.description}
                      </Typography>

                      {job.skills_required?.length > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 3,
                            pt: 2,
                            borderTop: `1px solid #edf2f7`,
                          }}
                        >
                          {job.skills_required
                            .slice(0, 5)
                            .map((skill, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Chip
                                  label={skill}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${primaryColor}10`,
                                    color: primaryColor,
                                    fontWeight: 500,
                                  }}
                                />
                              </motion.div>
                            ))}
                          {job.skills_required.length > 5 && (
                            <Chip
                              label={`+${job.skills_required.length - 5} more`}
                              size="small"
                              sx={{
                                backgroundColor: "#edf2f7",
                                color: "#718096",
                              }}
                            />
                          )}
                        </Box>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: "auto",
                          pt: 2,
                        }}
                      >
                        {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Schedule
                            sx={{
                              fontSize: 16,
                              color: "#718096",
                              mr: 1,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "#718096" }}
                          >
                            Posted{" "}
                            {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </Box> */}

                        <Button
                          variant="contained"
                          onClick={(e) => handleApplyClick(job.id, e)}
                          sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            fontWeight: 600,
                            backgroundColor: primaryColor,
                            "&:hover": {
                              backgroundColor: "#b32828",
                              boxShadow: `0 4px 14px ${primaryColor}33`,
                            },
                            textTransform: "none",
                            fontSize: 14,
                          }}
                          endIcon={<ArrowForward />}
                        >
                          Apply Now
                        </Button>
                      </Box>
                    </Box>
                  </motion.div>
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
                backgroundColor:  isLight ? "#fff" : "#121212",
                zIndex: 1,
                borderTop: `1px solid #e2e8f0`,
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
                      color: isLight ? "#4a5568" : "#e2e8f0",
                      backgroundColor: isLight ? "transparent" : "#242424",
                      "&.Mui-selected": {
                        backgroundColor: primaryColor,
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#b32828",
                        },
                        "&.MuiPaginationItem-ellipsis": {
                        color: isLight ? "#4a5568" : "#e2e8f0",
                        },
                      },
                      "& .MuiSvgIcon-root": {
                        color: isLight ? "#4a5568" : "#e2e8f0",
                      },
                      "& .MuiPaginationItem-ellipsis": {
                        
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

export default RecommendedJobs;
