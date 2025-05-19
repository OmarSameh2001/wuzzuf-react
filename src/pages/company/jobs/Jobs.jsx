import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import JobCardCompany from "../../../components/job/JobCardCompany"; 
import { useContext, useState } from "react";
import { TextField, Button, Box, Typography, FormControlLabel, Checkbox, CircularProgress } from "@mui/material";
import { Add, Search, Refresh, CheckBox } from "@mui/icons-material"
import { userContext } from "../../../context/UserContext";
import { getAllJobs } from "../../../services/Job";
import CustomPagination from "../../../components/pagination/pagination";

import '../../../styles/company/companyteme.css';
import '../../../styles/company/job/jobs_company.css';
import { motion, AnimatePresence } from "framer-motion"
function CompanyJobs() {
  //   const location = useLocation();
  const { user, isLight } = useContext(userContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    company: user?.id,
    status: '',
  });
  const [searchFilters, setSearchFilters] = useState({
    title: "",
    company: user?.id,
    status: ''
  });

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


  const {
    data: companyJobs,
    error: companyJobsError,
    isLoading: companyJobsLoading,
    isFetching: companyJobsFetching,
    refetch: companyJobsRefetch,
  } = useQuery({
    queryKey: ["companyJobs", page, pageSize, searchFilters],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }
      const res = await getAllJobs({
        filters: searchFilters,
        page,
        pageSize,
      });
      setTotal(res.data.count);
      return res.data.results;
    },
    keepPreviousData: true,
  });

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    setSearchFilters(filters);
    setPage(1);
    // companyJobsRefetch();
  };

  const handleReset = () => {
    setFilters({ title: "", company: user?.id, status: '' });
    setSearchFilters({ title: "", company: user?.id, status: '' });
    setPage(1);
    // companyJobsRefetch();
  };

  const handleActive = () => {
    setActive(!active);
    if (!active) {
      setFilters({ ...filters, status: '1' });
    } else {
      setFilters({ ...filters, status: '' });
    }
    // companyJobsRefetch();
  };

  // const handlePageChange = (newPage) => {
  //   setPage(newPage);
  //   companyJobsRefetch();
  // };

  const noChange = JSON.stringify(filters) === JSON.stringify(searchFilters);

  return (
    <div className={`company-jobs ${isLight ? "light-mode" : "dark-mode"}`} style={{ backgroundColor: isLight ? "#f8f9fa" : "#121212" }}>
      <div className="container">
        <div className="company-jobs__header">
          <h1 className="company-jobs__title">Company Jobs</h1>
          <button
            className="company-jobs__add-button"
            onClick={() => navigate("/company/jobCreate")}
            title="Add New Job"
          >
            <Add />
          </button>
        </div>
        <div className="company-jobs__search">
              <Box className="search-field-wrapper" sx={{ display: "flex", alignItems: "center", width: "100%", gap: "16px" }}>
                {/* <Search className="search-icon" /> */}
                <TextField
                  label="Search by job title"
                  name="title"
                  value={filters.title}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="company-jobs__search-input"
                  
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="active"
                      checked={active}
                      onChange={handleActive}
                      sx={{ cursor: "pointer" }}
                    />
                  }
                  label="Active"
                  sx={{ color: isLight ? "#000" : "#fff" }}
                />
              </Box>
              <Box className="search-buttons d-flex gap-2">
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={companyJobsFetching ? <CircularProgress size={20} /> : <Search />}
                  disabled={companyJobsFetching || noChange}
                  className="company-jobs__button company-jobs__button--primary"
                >
                  <span className="button-text">Search</span>
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<Refresh />}
                  disabled={companyJobsFetching}
                  className="company-jobs__button company-jobs__button--secondary"
                >
                  <span className="button-text">Reset</span>
                </Button>
              </Box>
            </div>

        {companyJobsLoading ? (
          <div className="company-jobs__loading d-flex flex-column align-items-center">
            <div className="loading-spinner"></div>
            <Typography sx={{ mt: 2 }}>Loading jobs...</Typography>
          </div>
        ) : companyJobsError ? (
          <div className="company-jobs__empty">
            <Typography variant="h5" className="company-jobs__empty-title">
              Error loading jobs
            </Typography>
            <Typography className="company-jobs__empty-text">Please try again later or contact support.</Typography>
            <Button
              variant="contained"
              onClick={() => companyJobsRefetch()}
              className="company-jobs__button company-jobs__button--primary"
            >
              Try Again
            </Button>
          </div>
        ) : companyJobs && companyJobs.length < 1 ? (
          <div className="company-jobs__empty">
            <Typography variant="h5" className="company-jobs__empty-title">
              No jobs found
            </Typography>
            <Typography className="company-jobs__empty-text">Create your first job posting to get started</Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/company/jobCreate")}
              startIcon={<Add />}
              className="company-jobs__button company-jobs__button--primary company-jobs__add-button--large"
            >
              Create New Job
            </Button>
          </div>
        ) : (
          <>
            

            <AnimatePresence>
              <div className="company-jobs__list">
                {companyJobs?.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="job-card-wrapper"
                  >
                    <JobCardCompany job={job} index={index} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            <div className="company-jobs__pagination">
              <CustomPagination
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                total={total}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default CompanyJobs;
