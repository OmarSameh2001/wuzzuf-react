"use client"

import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Button,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Chip,
  IconButton,
  Container,
  Paper,
  Skeleton,
  Tooltip,
} from "@mui/material"
import { userContext } from "../../../context/UserContext"
import { AxiosApi } from "../../../services/Api"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
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
  Bolt,
  AccessTime,
  Star,
} from "@mui/icons-material"

const RecommendedJobs = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const { user } = useContext(userContext)
  const navigate = useNavigate()
  const [savedJobs, setSavedJobs] = useState([])

  // Colors
  const primaryColor = "#d43132"
  const secondaryColor = "#f5f5f5"
  const darkGray = "#2d3748"
  const mediumGray = "#718096"
  const lightGray = "#e2e8f0"

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    totalPages: 1,
    totalResults: 0,
  })

  const {
    data: jobs,
    error: jobsError,
    isLoading: jobsLoading,
    refetch,
  } = useQuery({
    queryKey: ["jobsRecomm", user?.id, pagination.page, pagination.pageSize],
    queryFn: async () => {
      if (!user?.id) {
        console.error("User not authenticated")
        return []
      }
      const response = await AxiosApi.get(`jobs/recom/${user.id}/`, {
        params: {
          page: pagination.page,
          page_size: pagination.pageSize,
        },
        timeout: 10000,
      })
      const data = response.data
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(data.total_results / pagination.pageSize),
        totalResults: data.total_results,
      }))
      return data.recommendations || []
    },
  })

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePageSizeChange = (event) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: event.target.value,
      page: 1,
    }))
  }

  const handleJobClick = (jobId) => {
    navigate(`/applicant/jobs/${jobId}`)
  }

  const handleRefresh = () => {
    refetch()
  }

  const handleSaveJob = (e, jobId) => {
    e.stopPropagation()
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId))
    } else {
      setSavedJobs([...savedJobs, jobId])
    }
    // Here you would typically make an API call to save/unsave the job
  }

  const handleApplyClick = (jobId, e) => {
    e.stopPropagation()
    navigate(`/applicant/jobs/${jobId}/apply`)
  }

  // No CV uploaded state
  if (!user?.cv) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              background: "linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%)",
              border: `1px solid ${lightGray}`,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: `${primaryColor}10`,
                zIndex: 0,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1, maxWidth: 600, mx: "auto", textAlign: "center" }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: `${primaryColor}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <WorkOutline sx={{ fontSize: 48, color: primaryColor }} />
                </Box>
              </motion.div>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  background: `linear-gradient(90deg, ${darkGray} 0%, ${primaryColor} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Unlock Personalized Job Matches
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                Our AI-powered recommendation engine will analyze your CV to find the perfect job opportunities that
                match your skills, experience, and career goals.
              </Typography>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/applicant/profile/edit-cv")}
                  sx={{
                    px: 4,
                    py: 1.8,
                    borderRadius: 3,
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: 16,
                    backgroundColor: primaryColor,
                    "&:hover": {
                      backgroundColor: "#b32828",
                      boxShadow: `0 8px 25px ${primaryColor}40`,
                    },
                    boxShadow: `0 6px 20px ${primaryColor}30`,
                  }}
                  startIcon={<Upload />}
                >
                  Upload Your CV Now
                </Button>
              </motion.div>

              <Box sx={{ mt: 5, display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Bolt sx={{ color: primaryColor }} />
                  <Typography variant="body2" color="text.secondary">
                    Personalized Matches
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Star sx={{ color: primaryColor }} />
                  <Typography variant="body2" color="text.secondary">
                    Top Opportunities
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTime sx={{ color: primaryColor }} />
                  <Typography variant="body2" color="text.secondary">
                    Latest Openings
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            mb: 3,
            border: `1px solid ${lightGray}`,
            background: "linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.8rem", md: "2.125rem" },
                  color: darkGray,
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                <span style={{ color: primaryColor }}>Recommended</span> Jobs
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  icon={<Bolt sx={{ fontSize: 16, color: primaryColor }} />}
                  label={`${pagination.totalResults} matches found`}
                  sx={{
                    backgroundColor: `${primaryColor}10`,
                    color: primaryColor,
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 1,
                  }}
                />
                <Typography variant="body2" sx={{ color: mediumGray }}>
                  based on your profile
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: "100%", sm: 140 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "#fff",
                  },
                }}
              >
                <InputLabel id="page-size-label">Jobs per page</InputLabel>
                <Select
                  labelId="page-size-label"
                  value={pagination.pageSize}
                  onChange={handlePageSizeChange}
                  label="Jobs per page"
                >
                  {[6, 12, 18, 24, 30].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="contained"
                  onClick={handleRefresh}
                  disabled={jobsLoading}
                  sx={{
                    px: 3,
                    py: 1.2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    width: { xs: "100%", sm: "auto" },
                    backgroundColor: darkGray,
                    "&:hover": {
                      backgroundColor: "#1a202c",
                    },
                    "&:disabled": {
                      backgroundColor: "#e2e8f0",
                    },
                  }}
                  startIcon={<Refresh />}
                >
                  Refresh
                </Button>
              </motion.div>
            </Box>
          </Box>
        </Paper>
      </motion.div>

      {/* Loading state */}
      {jobsLoading && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(auto-fill, minmax(450px, 1fr))" },
            gap: 3,
            mb: 4,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Paper
              key={item}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${lightGray}`,
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Skeleton variant="rounded" width={64} height={64} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" height={32} />
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Skeleton variant="rounded" width={100} height={24} />
                    <Skeleton variant="rounded" width={120} height={24} />
                  </Box>
                </Box>
              </Box>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="95%" height={20} />
              <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
                <Skeleton variant="rounded" width={70} height={24} />
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={90} height={24} />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, pt: 2 }}>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="rounded" width={120} height={36} />
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Error state */}
      {!jobsLoading && jobsError && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: `1px solid ${lightGray}`,
              borderLeft: `4px solid ${primaryColor}`,
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
              <Box
                sx={{
                  backgroundColor: `${primaryColor}15`,
                  p: 2,
                  borderRadius: "50%",
                  display: "flex",
                }}
              >
                <Business sx={{ color: primaryColor, fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: darkGray, mb: 1 }}>
                  Couldn't load recommendations
                </Typography>
                <Typography sx={{ color: mediumGray, mb: 3 }}>
                  {jobsError.message ||
                    "We're having trouble connecting to our servers. Please try refreshing the page."}
                </Typography>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="outlined"
                    onClick={handleRefresh}
                    sx={{
                      borderColor: primaryColor,
                      color: primaryColor,
                      fontWeight: 600,
                      px: 4,
                      py: 1.2,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: `${primaryColor}10`,
                        borderColor: primaryColor,
                      },
                    }}
                    startIcon={<Refresh />}
                  >
                    Try Again
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Empty state */}
      {!jobsLoading && !jobsError && jobs?.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 3,
              border: `1px solid ${lightGray}`,
              textAlign: "center",
              mb: 3,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: `${primaryColor}15`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <WorkOutline
                  sx={{
                    fontSize: 48,
                    color: primaryColor,
                  }}
                />
              </Box>
            </motion.div>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: darkGray,
              }}
            >
              No matching jobs found
            </Typography>

            <Typography
              sx={{
                color: mediumGray,
                mb: 4,
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              We couldn't find any jobs matching your profile at the moment. Try updating your skills or broadening your
              search criteria. New opportunities are added daily, so check back soon!
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="contained"
                  onClick={handleRefresh}
                  sx={{
                    backgroundColor: primaryColor,
                    color: "white",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "#b32828",
                    },
                  }}
                  startIcon={<Refresh />}
                >
                  Refresh Results
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/applicant/profile/edit-cv")}
                  sx={{
                    borderColor: darkGray,
                    color: darkGray,
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: `${darkGray}10`,
                      borderColor: darkGray,
                    },
                  }}
                >
                  Update Profile
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Job listings */}
      {!jobsLoading && !jobsError && jobs?.length > 0 && (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(auto-fill, minmax(450px, 1fr))",
              },
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
                    transition: { duration: 0.2 },
                  }}
                >
                  <Paper
                    elevation={0}
                    onClick={() => handleJobClick(job.id)}
                    sx={{
                      border: "1px solid",
                      borderColor: lightGray,
                      borderRadius: 3,
                      padding: 3,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      backgroundColor: "#fff",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        borderColor: primaryColor,
                        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)",
                      },
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Bookmark button */}
                    <Tooltip title={savedJobs.includes(job.id) ? "Remove from saved" : "Save job"}>
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          zIndex: 2,
                          color: savedJobs.includes(job.id) ? primaryColor : "#cbd5e0",
                          "&:hover": {
                            color: savedJobs.includes(job.id) ? "#b32828" : primaryColor,
                            backgroundColor: `${primaryColor}10`,
                          },
                        }}
                        onClick={(e) => handleSaveJob(e, job.id)}
                      >
                        {savedJobs.includes(job.id) ? <Bookmark /> : <BookmarkBorder />}
                      </IconButton>
                    </Tooltip>

                    {/* Match score ribbon */}
                    {job.match_score && (
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
                          fontSize: 13,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          zIndex: 1,
                        }}
                      >
                        <Bolt sx={{ fontSize: 16 }} />
                        {job.match_score}% Match
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
                          borderRadius: 2,
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
                            "https://static.thenounproject.com/png/3198584-200.png" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
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
                            color: darkGray,
                            mb: 0.5,
                            pr: 4,
                            lineHeight: 1.3,
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
                              backgroundColor: "#f8fafc",
                              color: "#4a5568",
                              fontWeight: 500,
                              borderRadius: 1.5,
                            }}
                          />
                          <Chip
                            icon={<LocationOn sx={{ fontSize: 16 }} />}
                            label={job.location}
                            size="small"
                            sx={{
                              backgroundColor: "#f8fafc",
                              color: "#4a5568",
                              fontWeight: 500,
                              borderRadius: 1.5,
                            }}
                          />
                        </Box>
                        {job.type_of_job && (
                          <Chip
                            icon={<Schedule sx={{ fontSize: 16 }} />}
                            label={job.type_of_job}
                            size="small"
                            sx={{
                              backgroundColor: `${primaryColor}10`,
                              color: primaryColor,
                              fontWeight: 600,
                              borderRadius: 1.5,
                            }}
                          />
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
                        lineHeight: 1.7,
                        position: "relative",
                        "&:after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "32px",
                          background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
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
                        {job.skills_required.slice(0, 5).map((skill, index) => (
                          <motion.div key={index} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            <Chip
                              label={skill}
                              size="small"
                              sx={{
                                backgroundColor: `${primaryColor}10`,
                                color: primaryColor,
                                fontWeight: 600,
                                borderRadius: 1.5,
                              }}
                            />
                          </motion.div>
                        ))}
                        {job.skills_required.length > 5 && (
                          <Tooltip title={job.skills_required.slice(5).join(", ")}>
                            <Chip
                              label={`+${job.skills_required.length - 5} more`}
                              size="small"
                              sx={{
                                backgroundColor: "#edf2f7",
                                color: "#718096",
                                borderRadius: 1.5,
                              }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: "auto",
                        pt: 3,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTime
                          sx={{
                            fontSize: 16,
                            color: "#718096",
                            mr: 1,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: "#718096", fontWeight: 500 }}>
                          {new Date(job.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Typography>
                      </Box>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                              boxShadow: `0   {
                              backgroundColor: "#b32828",
                              boxShadow: \`0 4px 14px ${primaryColor}33`,
                            },
                            textTransform: "none",
                            fontSize: 14,
                          }}
                          endIcon={<ArrowForward />}
                        >
                          Apply Now
                        </Button>
                      </motion.div>
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>

          {/* Pagination */}
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 3,
              backgroundColor: "#fff",
              zIndex: 1,
              borderTop: `1px solid ${lightGray}`,
              borderRadius: 3,
              mt: 3,
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" sx={{ color: mediumGray, mb: 1 }}>
                Showing {(pagination.page - 1) * pagination.pageSize + 1} -{" "}
                {Math.min(pagination.page * pagination.pageSize, pagination.totalResults)} of {pagination.totalResults}{" "}
                jobs
              </Typography>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size={isMobile ? "small" : "medium"}
                  showFirstButton
                  showLastButton
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontWeight: 600,
                      color: darkGray,
                      "&.Mui-selected": {
                        backgroundColor: primaryColor,
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#b32828",
                        },
                      },
                    },
                  }}
                />
              </motion.div>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  )
}

export default RecommendedJobs
