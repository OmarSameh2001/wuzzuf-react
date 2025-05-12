import { useQuery } from "@tanstack/react-query";
import { getTalents, getBranches, getTracks } from "../../../services/Talents";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../../../context/UserContext";
import { useNavigate } from "react-router";
import CustomPagination from "../../../components/pagination/pagination";
import {
  TextField,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Chip,
  Avatar,
  Tooltip,
  Box,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from "@mui/material"
import {
  Search,
  LocationOn,
  Work,
  Mail,
  Phone,
  Visibility,
  BookmarkBorder,
  PersonAdd,
  FilterList,
  Refresh,
  Clear,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import '../../../styles/company/talents/talents.css';
import '../../../styles/company/companyteme.css';
import CustomAutoComplete from "../../../components/autoComplete/CustomAutoComplete";
import dayjs from 'dayjs'; // or use new Date().getFullYear() if you prefer
import TalentCard from "../../../components/talent/TalentCard";


function Talents() {
  const currentYear = dayjs().year(); 
  const years = Array.from({ length: currentYear - 1993 + 1 }, (_, i) => 1993 + i).reverse();
  const { user, isLight } = useContext(userContext);
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate();
  // const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  // const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"))
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const primaryColor = "#e53946"
  const backgroundColor = isLight ? "#ffffff" : "#121212"
  const textColor = isLight ? "#2d3748" : "#e2e8f0"
  const borderColor = isLight ? "#e3cdcd" : "#2d3748"
  const cardBackground = isLight ? "#ffffff" : "#1e1e1e"
  const sectionBackground = isLight ? "#f9f9f9" : "#242424"

  const [filters, setFilters] = useState({
    name: "",
    seniority: "",
    location: "",
    skills: "",
    specialization: "",
    iti_grad_year: "",
    track_name: "",
    branch_name: "",
  });
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    seniority: "",
    location: "",
    skills: "",
    specialization: "",
    iti_grad_year: "",
    track_name: "",
    branch_name: "",
  });

  const handleReset = () => {
    setFilters({
      name: "",
      seniority: "",
      location: "",
      skills: "",
      iti_grad_year: "",
      track_name: "",
      branch_name: "",
    });
    setSearchFilters({
      name: "",
      seniority: "",
      location: "",
      skills: "",
      iti_grad_year: "",
      track_name: "",
      branch_name: "",
  
    });
    setPage(1);
    talentsRefetch();
  };

  const { data: talents, error: talentsError, isLoading: talentsLoading, refetch: talentsRefetch } = useQuery({
    queryKey: ["talents", page, pageSize, searchFilters],
    queryFn: async () => {
      const res = await getTalents({ filters: searchFilters, page, pageSize });
      setTotal(res.count);
      return res.results;
    },
    keepPreviousData: true,
  });

  const { data: branches = [], isLoading: loadingBranches } = useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
  });
  
  const { data: tracks = [], isLoading: loadingTracks } = useQuery({
    queryKey: ["tracks"],
    queryFn: getTracks,
  });

  useEffect(() => {
    console.log(filters.branch, filters.track, filters.iti_grad_year)
  },[filters.branch, filters.track, filters.iti_grad_year])
  const getSkillsArray = (skills) => {
    if (!skills) return []

    // If skills is a string, split it by comma
    if (typeof skills === "string") {
      return skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    }

    // If skills is already an array
    if (Array.isArray(skills)) {
      return skills
        .map((skill) => {
          // If skill is an object, extract the relevant property (assuming it has a name or value property)
          if (typeof skill === "object" && skill !== null) {
            return skill.name || skill.value || JSON.stringify(skill)
          }
          return String(skill).trim()
        })
        .filter(Boolean)
    }

    // If skills is an object but not an array, return an empty array
    return []
  }
  

  // if (talentsLoading) return <div className="loading-spinner"></div>
  // if (talentsError) return <div className="error-message">Error loading talents</div>
  return (
    <div className={`talents-container ${isLight ? "light-mode" : "dark-mode"}`}>
    <div className="talents-content">
      <div className="talents-header">
        <div className="talents-header-top">
          <h1 className="talents-title" style={{ color: textColor }}>
            ITI Talents 
          </h1>
          <div className="talents-stats">
            <div className="stat-item" style={{ backgroundColor: cardBackground, borderColor }}>
              <div className="stat-icon" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                <PersonAdd />
              </div>
              <div className="stat-content">
                <span className="stat-value" style={{ color: textColor }}>
                {total}
                </span>
                <span className="stat-label" style={{ color: isLight ? "#718096" : "#a0aec0" }}>
                  Applicants
                </span>
              </div>
            </div>
          </div>
        </div>

        <Paper className="search-container">
          <Box className="search-row">
            <Box className="search-field-wrapper">
              <Search className="search-icon" />
              <TextField
                placeholder="Search applicants by name..."
                value={filters.name}
                onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
                fullWidth
                variant="outlined"
                size="small"
                className="search-input"
              />
            </Box>
          </Box>

          {/* Use Grid to divide the fields into two lines */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box className="filter-field-wrapper">
                <TextField
                  label="Skills"
                  value={filters.skills}
                  onChange={(e) => setFilters((prev) => ({ ...prev, skills: e.target.value }))}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="filter-input"
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box className="filter-field-wrapper">
                <CustomAutoComplete
                  setter={setFilters}
                  getter={filters.specialization}
                  label="Specialization"
                  value="specialization"
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box className="filter-field-wrapper">
                <CustomAutoComplete
                  setter={setFilters}
                  getter={filters.seniority}
                  value="seniority"
                  label="Experience"
                  type="experience"
                  multiple={true}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box className="filter-field-wrapper">
                <CustomAutoComplete
                  getter={filters.location}
                  setter={setFilters}
                  label="Location"
                  value="location"
                  type="egypt"
                  multiple={true}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box className="filter-field-wrapper">
                {/* <FormControl fullWidth size="small">
                  <InputLabel>Branch</InputLabel>
                  <Select
                    value={filters.branch}
                    onChange={(e) => setFilters((prev) => ({ ...prev, branch: e.target.value }))}
                    label="Branch"
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </MenuItem>
                    ))}
                  </Select> */}
                  <CustomAutoComplete
                    setter={setFilters}
                    getter={filters.branch_name}
                    options={branches.map((branch) => branch.name)}
                    label="Branch"
                    value="branch_name"
                    multiple={true}
                  />
                {/* </FormControl> */}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box className="filter-field-wrapper">
                {/* <FormControl fullWidth size="small">
                  <InputLabel>Track</InputLabel>
                  <Select
                    value={filters.track}
                    onChange={(e) => setFilters((prev) => ({ ...prev, track: e.target.value }))}
                    label="Track"
                  >
                    {tracks.map((track) => (
                      <MenuItem key={track.id} value={track.id}>
                        {track.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                <CustomAutoComplete
                  setter={setFilters}
                  getter={filters.track_name}
                  options={tracks.map((track) => track.name)}
                  label="Track"
                  value="track_name"
                  multiple={true}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={12}><Box className="filter-field-wrapper">
                {/* <FormControl fullWidth size="small">
                  <InputLabel>Graduation Year</InputLabel>
                  <Select
                    label="Graduation Year"
                    value={filters.iti_grad_year}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, iti_grad_year: e.target.value }))
                    }
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                <CustomAutoComplete
                  setter={setFilters}
                  getter={filters.iti_grad_year}
                  options={years}
                  label="Graduation Year"
                  value="iti_grad_year"
                  multiple={true}
                />
              </Box>
              
            </Grid>
          </Grid>

          <Box className="filter-actions">
            <Button
              variant="contained"
              onClick={() => {
                setSearchFilters(filters)
                setPage(1)
                talentsRefetch()
              }}
              startIcon={<Search />}
              className="filter-button filter-button--primary"
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              startIcon={<Refresh />}
              className="filter-button filter-button--secondary"
            >
              Reset
            </Button>
          </Box>
        </Paper>

        </div>

        {talentsLoading ? (
          <div className="talents-loading">
            <div className="loading-spinner"></div>
            <Typography>Loading applicants...</Typography>
          </div>
        ) : talentsError ? (
          <div className="talents-error">
            <Typography variant="h5" className="error-title">
              Error loading applicants
            </Typography>
            <Typography className="error-message">Please try again later or contact support.</Typography>
          </div>
        ) : talents?.length === 0 ? (
          <div className="talents-error">
            <Typography variant="h5" className="error-title">
              No talents found
            </Typography>
            <Typography className="error-message">No talents found for the given filters.</Typography>
          </div>
        ) : (
          <>
            <div className="talents-grid">
              <AnimatePresence>
                {talents?.map((talent, index) => {
                  // Process skills safely
                  const skillsArray = getSkillsArray(talent.skills)

                  return (
                    <TalentCard key={talent.id} talent={talent} index={index} skillsArray={skillsArray} />
                  )
                })}
              </AnimatePresence>
            </div>

            <div className="talents-pagination">
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

export default Talents;