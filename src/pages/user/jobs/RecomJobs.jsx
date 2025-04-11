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
} from "@mui/material";
import { userContext } from "../../../context/UserContext";
import { AxiosApi } from "../../../services/Api";
import { color } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const RecommendedJobs = () => {
  const { user } = useContext(userContext);
  console.log("User:", user);
  const navigate = useNavigate();
  // const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    totalPages: 1,
    totalResults: 0,
  });
  // console.log("User:", user.id);
  // const fetchRecommendedJobs = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     if (!user?.id) throw new Error("User not authenticated");

  //     const response = await AxiosApi.get(`jobs/recom/${user.id}/`, {
  //       params: {
  //         page: pagination.page,
  //         page_size: pagination.pageSize
  //       },
  //       timeout: 10000
  //     });

  //     const data = response.data;
  //     if (!data.recommendations || !data.total_results) {
  //       throw new Error("Invalid response structure from server");
  //     }

  //     setJobs(data.recommendations);
  //     setPagination(prev => ({
  //       ...prev,
  //       totalPages: Math.ceil(data.total_results / pagination.pageSize),
  //       totalResults: data.total_results
  //     }));

  //   } catch (err) {
  //     let errorMessage = "Failed to fetch recommendations";

  //     if (err.response) {
  //       if (err.response.status === 400) {
  //         errorMessage = "Invalid request - please check your CV URL";
  //       } else if (err.response.status === 401) {
  //         navigate('/login');
  //         return;
  //       } else {
  //         errorMessage = err.response.data?.error || err.response.data?.detail || errorMessage;
  //       }
  //     } else if (err.message.includes("timeout")) {
  //       errorMessage = "Request timed out - please try again";
  //     } else {
  //       errorMessage = "Network error - could not connect to server";
  //     }

  //     setError(errorMessage);
  //     console.error("Fetch error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (user?.id) {
  //     fetchRecommendedJobs();
  //   }
  // }, [user?.id, pagination.page, pagination.pageSize]); //
  const {
    data: jobs,
    error: jobsError,
    isLoading: jobsLoading,
    refetch,
  } = useQuery({
    queryKey: ["jobsRecomm", user?.id, pagination.page, pagination.pageSize],
    queryFn: async () => {
      if (!user?.id) {
        console.error("User not authenticated");
        return [];
      }
      const response = await AxiosApi.get(`jobs/recom/${user.id}/`, {
        params: {
          page: pagination.page,
          page_size: pagination.pageSize,
        },
        timeout: 10000,
      });
      const data = response.data;
      console.log(data);
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(data.total_results / pagination.pageSize),
        totalResults: data.total_results,
      }));
      return data.recommendations || [];
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

  if (!user?.cv) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          You need to upload your CV to get job recommendations.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/applicant/profile/edit-cv")}
        >
          Upload CV Now
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "100vh", // Make sure the container takes full height
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
        Recommended Jobs For You
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="subtitle1" color="text.secondary">
          {pagination.totalResults} jobs matched your profile
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="page-size-label">Jobs per page</InputLabel>
            <Select
              labelId="page-size-label"
              value={pagination.pageSize}
              onChange={handlePageSizeChange}
              label="Jobs per page"
            >
              {[5, 10, 15, 20, 25].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={handleRefresh} disabled={loading}>
            Refresh
          </Button>
        </Box>
      </Box>

      {jobsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : jobsError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {jobsError.message || "Failed to fetch recommendations"}
        </Alert>
      ) : jobs.length === 0 ? (
        <Alert severity="info">
          No recommendations found. Try updating your profile or CV.
        </Alert>
      ) : (
        <>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {console.log("Jobs:", jobs)}
            {jobs?.map((job, index) => (
              <Box
                key={index}
                onClick={() => handleJobClick(job.id)}
                sx={{
                  border: "1px solid #e1e9ee",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  padding: 2,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.01)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={
                      job.company_logo ||
                      "https://static.thenounproject.com/png/3198584-200.png"
                    }
                    alt={job.company_name}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      marginRight: 16,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.company_name} - {job.location}
                    </Typography>
                  </Box>
                  {/* <Box sx={{
                    backgroundColor: job.match_score > 75 ? '#4caf50' : job.match_score > 50 ? '#ff9800' : '#f44336',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}>
                    {job.match_score}% Match
                  </Box> */}
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    color: "#333",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {job.description}
                </Typography>

                {job.skills_required?.length > 0 && (
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}
                  >
                    {job.skills_required.slice(0, 5).map((skill, index) => (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: "#f5f5f5",
                          px: 1,
                          py: 0.5,
                          borderRadius: "4px",
                          fontSize: "14px",
                          color: "#555",
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </div>
          {/* Pagination */}

          {/* {/* <Box sx={{
            // position: 'sticky',
            bottom: 0,
            backgroundColor: 'white',
            zIndex: 10,
            py: 2,
            display: 'flex',
            justifyContent: 'center',
            borderTop: '1px solid #ddd',
            boxShadow: "0px -4px 6px rgba(0, 0, 0, 0.1)"
          }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
            />
          </Box> */}

          {/* )} */}
          {/* Normal Pagination */}
          <Box
            sx={{
              mt: 4,
              justifyContent: "center",
              zIndex: 5,
              display: "flex",
              py: 2,
            }}
          >
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default RecommendedJobs;
