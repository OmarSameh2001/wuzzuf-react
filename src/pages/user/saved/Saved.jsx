
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../../../components/job/JobCard";
import { useQuery } from "@tanstack/react-query";
import { getApplicationsByUser } from "../../../services/Application";
import { userContext } from "../../../context/UserContext";
import CustomPagination from "../../../components/pagination/pagination";
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { Search, Briefcase, X, FileText } from "lucide-react";
import { Building2 } from "lucide-react"; // Import Building2 icon

function UserSaved() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const primaryColor = "#d43132";
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const { user, isLight } = useContext(userContext);
  const navigate = useNavigate();

  // Search states
  // const [jobTitle, setJobTitle] = useState("");
  // const [company, setCompany] = useState("");
  const [debouncedJobTitle, setDebouncedJobTitle] = useState("");
  const [debouncedCompany, setDebouncedCompany] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    user: `${user?.id}`,
    job_title: "",
    company_name: "",
    status: "1",
  });

  const [searchFilters, setSearchFilters] = useState({
    user: `${user?.id}`,
    job_title: "",
    company_name: "",
    status: "1",
  });

  // Debounce job title input
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedJobTitle(jobTitle);
  //     setFilters((prev) => ({ ...prev, job_title: jobTitle }));
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, [jobTitle]);

  // // Debounce company input
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedCompany(company);
  //     setFilters((prev) => ({ ...prev, company_name: company }));
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, [company]);

  // Update search when debounced values change
  // useEffect(() => {
  //   if (debouncedJobTitle !== "" || debouncedCompany !== "") {
  //     setIsSearching(true);
  //     handleSearch();
  //   } else if (
  //     debouncedJobTitle === "" &&
  //     debouncedCompany === "" &&
  //     isSearching
  //   ) {
  //     setIsSearching(false);
  //     handleReset();
  //   }
  // }, [debouncedJobTitle, debouncedCompany]);

  const {
    data: saved,
    error: savedError,
    isLoading: savedLoading,
    isFetching: savedFetching,
    refetch,
  } = useQuery({
    queryKey: ["saved", page, pageSize, searchFilters],
    queryFn: async () => {
      const res = await getApplicationsByUser({
        filters: searchFilters,
        page,
        pageSize,
      });
      setTotal(res.count);
      return res.results;
    },
  });

  const handleSearch = () => {
    setSearchFilters({
      ...filters
    });
    setPage(1);
    // refetch();
  };

  const handleReset = () => {
    setFilters({
      user: `${user.id}`,
      job_title: "",
      company_name: "",
      status: "1",
    });
    setSearchFilters({
      user: `${user.id}`,
      job_title: "",
      company_name: "",
      status: "1",
    });
    setPage(1);
    // refetch();
  };

  const handleClearSearch = () => {
    // setJobTitle("");
    // setCompany("");
    // setIsSearching(false);
    handleReset();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const noChange = JSON.stringify(filters) === JSON.stringify(searchFilters);

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 2,
        backgroundColor: isLight ? "#f5f5f5" : "#242424",
        minWidth: "99vw",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80%",
          minHeight: "70vh",
          background: isLight ? "white" : "#121212",
          padding: 3,
          borderRadius: "10px",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            width: "100%",
            mb: 3,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: isLight ? "#2d3748" : '#d33326',
                mb: 1,
              }}
            >
              Your Saved Jobs
            </Typography>
            <Typography
              variant="body1"
              // color="text.secondary"
              sx={{ maxWidth: 600, color:isLight ? 'black' : 'white' }}
            >
              Track and manage all the positions you've saved for future
              reference
            </Typography>
          </Box>

          {/* <Button
            variant="contained"
            startIcon={<Search size={18} />}
            onClick={() => navigate("/applicant/jobs")}
            sx={{
              backgroundColor: primaryColor,
              borderRadius: "8px",
              px: 3,
              py: 1,
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#b32828",
                boxShadow: `0 4px 14px ${primaryColor}33`,
              },
              textTransform: "none",
            }}
          >
            Browse Jobs
          </Button> */}
        </Box>

        {/* Search Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            width: "100%",
            backgroundColor: isLight ? 'white' : '#242424'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search by job title"
                name="job_title"
                value={filters.job_title}
                onChange={(e) => setFilters({ ...filters, job_title: e.target.value })}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FileText size={18} color="#718096" />
                    </InputAdornment>
                  ),
                  endAdornment: filters.job_title ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setFilters({ ...filters, job_title: "" })}>
                        <X size={16} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#e2e8f0",
                    },
                  },
                  "& .MuiInputBase-input": {
                      backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : '#242424',
                      color: isLight ? 'black' : 'white',
                      paddingLeft: 1
                    },
                }}
              />
            </Grid>

            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search by company"
                name="company_name"
                value={filters.company_name}
                onChange={(e) => setFilters({ ...filters, company_name: e.target.value })}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Building2 size={18} color="#718096" />
                    </InputAdornment>
                  ),
                  endAdornment: filters.company_name ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setFilters({ ...filters, company_name: "" })}>
                        <X size={16} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#e2e8f0",
                    },
                  },
                  "& .MuiInputBase-input": {
                      backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : '#242424',
                      color: isLight ? 'black' : 'white',
                      paddingLeft: 1
                    },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3} style={{display:'flex'}}>
              <Button
                fullWidth
                variant="outlined"
                // disabled={!isSearching}
                onClick={handleSearch}
                startIcon={savedFetching ? <CircularProgress size={20} color="white"/> : <Search size={18} />}
                sx={{
                  height: "40px",
                  borderColor: isLight ? "#e2e8f0" : 'white',
                  color: isLight ? "#718096" : 'white',
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "#cbd5e0",
                    backgroundColor: "#121212",
                  },
                  textTransform: "none",
                  fontWeight: 600,
                }}
                disabled={noChange || savedFetching}
              >
                Search
              </Button>
              <Button
                fullWidth
                variant="outlined"
                disabled={savedFetching}
                onClick={handleReset}
                startIcon={<X size={18} />}
                sx={{
                  height: "40px",
                  borderColor: isLight ? "#e2e8f0" : 'white',
                  color: isLight ? "#718096" : 'white',
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "#cbd5e0",
                    backgroundColor: "#121212",
                  },
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>

          {isSearching && (
            <Fade in={isSearching}>
              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e2e8f0" }}>
                <Typography variant="body2" sx={{ color: "#718096" }}>
                  Filtering by:{" "}
                  {debouncedJobTitle &&
                    `Job Title containing "${debouncedJobTitle}"`}
                  {debouncedJobTitle && debouncedCompany && " and "}
                  {debouncedCompany &&
                    `Company containing "${debouncedCompany}"`}
                </Typography>
              </Box>
            </Fade>
          )}
        </Paper>

        {/* Content Section */}
        {savedLoading ? (
          <Box sx={{ width: "100%", py: 4 }}>
            {[1, 2, 3].map((_, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  width: "100%",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isLight ? "#f8fafc" : '#242424',
                }}
              >
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Loading saved jobs...
                  </Typography>
                </motion.div>
              </Paper>
            ))}
          </Box>
        ) : savedError ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "12px",
              border: "1px solid #fed7d7",
              backgroundColor: "#fff5f5",
              width: "100%",
              textAlign: "center",
              my: 4,
            }}
          >
            <Typography variant="h6" sx={{ color: "#c53030", mb: 1 }}>
              Error Loading Saved Jobs
            </Typography>
            <Typography variant="body2" sx={{ color: "#742a2a", mb: 2 }}>
              There was a problem retrieving your saved jobs. Please try again
              later.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => refetch()}
              sx={{
                borderColor: "#c53030",
                color: "#c53030",
                "&:hover": {
                  backgroundColor: "#fff5f5",
                  borderColor: "#9b2c2c",
                },
              }}
            >
              Retry
            </Button>
          </Paper>
        ) : saved && saved.length > 0 ? (
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ width: "100%" }}
          >
            {saved.length > 0 && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color={isLight ? 'black' : 'white'}>
                    Showing {saved.length} of {total} saved jobs
                    {isSearching && " matching your search"}
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  {saved.map((save, index) => (
                    <Grid item xs={12} md={6} key={save.id}>
                      {/* <Box
                        component={motion.div}
                        variants={itemVariants}
                        custom={index}
                      > */}
                        <JobCard
                          job={save.job_details}
                          user={"user"}
                          type={"saved"}
                          refetch={refetch}
                        />
                      {/* </Box> */}
                    </Grid>
                  ))}
                </Grid>

                {total > pageSize && (
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      justifyContent: "center",
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <CustomPagination
                      page={page}
                      setPage={setPage}
                      pageSize={pageSize}
                      setPageSize={setPageSize}
                      total={total}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        ) : (
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            sx={{
              width: "100%",
              py: 8,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
              backgroundColor: isLight ? "#f8fafc" : '#242424',
              borderRadius: "16px",
              border: "1px dashed #e2e8f0",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: isLight ? `${primaryColor}10` : '#121212',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Briefcase size={40} color={primaryColor} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                textAlign: "center",
                color: isLight ? "#2d3748" : '#fff',
              }}
            >
              {isSearching ? "No Matching Jobs Found" : "No Saved Jobs Found"}
            </Typography>
            <Typography
              variant="body1"
              color={isLight ? "text.secondary" : '#718096'}
              sx={{
                textAlign: "center",
                maxWidth: 500,
                mb: 2,
                px: 3,
              }}
            >
              {isSearching
                ? "Try adjusting your search criteria to find more results."
                : "You haven't saved any jobs yet. Browse available positions and save the ones you're interested in for future reference."}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={
                isSearching
                  ? handleClearSearch
                  : () => navigate("/applicant/jobs")
              }
              sx={{
                backgroundColor: primaryColor,
                borderRadius: "8px",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#b32828",
                  boxShadow: `0 4px 14px ${primaryColor}33`,
                },
                textTransform: "none",
              }}
            >
              {isSearching ? "Clear Search" : "Browse Available Jobs"}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default UserSaved;
