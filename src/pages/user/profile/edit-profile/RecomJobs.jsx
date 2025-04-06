import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  CircularProgress,
  Pagination,
  Chip,
  Divider,
  Alert
} from "@mui/material";
import {ProfileContext  } from "../../../../context/ProfileContext";
import axios from 'axios';
// import { useAxios } from "../../../../services/Auth";

const RecommendedJobs = () => {
  const { profileData  } = useContext (ProfileContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    totalPages: 1,
    totalResults: 0
  });
 
  console.log("User data:", profileData);
  console.log("Jobs data:", jobs);
  console.log("id", profileData.id);
  const fetchRecommendedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!profileData?.id) {
      
        throw new Error("User not authenticated");
      }

      const response = await axios.get(`http://127.0.0.1:8000/jobs/recommendations/${profileData.id}/`, {
        params: {
          page: pagination.page,
          page_size: pagination.pageSize
        }
      });

      const data = response.data;
      setJobs(data.recommendations || []);
      setPagination(prev => ({
        ...prev,
        totalPages: data.total_pages,
        totalResults: data.total_results
      }));
    } catch (err) {
      console.error("Failed to fetch recommended jobs:", err);
      setError(err.response?.data?.error || err.message || "Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileData?.id) {
      fetchRecommendedJobs();
    }
  }, [profileData?.id, pagination.page]);

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleJobClick = (jobId) => {
    navigate(`/applicant/jobs/${jobId}`);
  };

  const handleRefresh = () => {
    fetchRecommendedJobs();
  };

  if (!profileData?.cv) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          You need to upload your CV to get job recommendations.
        </Alert>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/applicant/profile/edit-cv')}
        >
          Upload CV Now
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Recommended Jobs For You
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {pagination.totalResults} jobs matched your profile
        </Typography>
        <Button 
          variant="outlined" 
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh Recommendations
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : jobs.length === 0 ? (
        <Alert severity="info">
          No recommendations found. Try updating your profile or CV.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} key={job.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.01)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => handleJobClick(job.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {job.title}
                        </Typography>
                        <Typography variant="subtitle1" color="primary">
                          {job.company}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {job.location}
                        </Typography>
                      </Box>
                      <Box>
                        <Chip 
                          label={`${job.match_score}% Match`} 
                          color={
                            job.match_score > 75 ? 'success' : 
                            job.match_score > 50 ? 'warning' : 'error'
                          }
                        />
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {job.description.length > 200 
                        ? `${job.description.substring(0, 200)}...` 
                        : job.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {job.skills_required?.slice(0, 5).map((skill, index) => (
                        <Chip 
                          key={index} 
                          label={skill} 
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                disabled={loading}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default RecommendedJobs;



// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { 
//   Box, 
//   Typography, 
//   Card, 
//   CardContent, 
//   Button, 
//   Grid, 
//   CircularProgress,
//   Pagination,
//   Chip,
//   Divider,
//   Alert
// } from "@mui/material";
// import { ProfileContext } from "../../../../context/ProfileContext";
// import axios from 'axios';

// const RecommendedJobs = () => {
//   const location = useLocation();
//   const { profileData } = useContext(ProfileContext);
//   const navigate = useNavigate();
  
//   const [userId, setUserId] = useState(null);
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     pageSize: 5,
//     totalPages: 1,
//     totalResults: 0
//   });

//   // Get user ID from either location state or profileData
//   useEffect(() => {
//     const idFromRoute = location.state?.userId;
//     const idFromProfile = profileData?.id;
    
//     if (idFromRoute) {
//       setUserId(idFromRoute);
//     } else if (idFromProfile) {
//       setUserId(idFromProfile);
//     } else {
//       console.error("No user ID available");
//       setError("User identification failed");
//     }
//   }, [location.state, profileData]);

//   const fetchRecommendedJobs = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       if (!userId) {
//         throw new Error("User not authenticated");
//       }

//       const response = await axios.get(
//         `http://127.0.0.1:8000/jobs/recommendations/${userId}/`,
//         {
//           params: {
//             page: pagination.page,
//             page_size: pagination.pageSize
//           }
//         }
//       );

//       const data = response.data;
//       setJobs(data.recommendations || []);
//       setPagination(prev => ({
//         ...prev,
//         totalPages: data.total_pages,
//         totalResults: data.total_results
//       }));
//     } catch (err) {
//       console.error("Failed to fetch recommended jobs:", err);
//       setError(err.response?.data?.error || err.message || "Failed to fetch recommendations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchRecommendedJobs();
//     }
//   }, [userId, pagination.page]);

//   const handlePageChange = (event, newPage) => {
//     setPagination(prev => ({ ...prev, page: newPage }));
//   };

//   const handleJobClick = (jobId) => {
//     navigate(`/applicant/jobs/${jobId}`);
//   };

//   const handleRefresh = () => {
//     fetchRecommendedJobs();
//   };

//   if (!profileData?.cv) {
//     return (
//       <Box sx={{ p: 4, textAlign: 'center' }}>
//         <Alert severity="warning" sx={{ mb: 3 }}>
//           You need to upload your CV to get job recommendations.
//         </Alert>
//         <Button 
//           variant="contained" 
//           color="primary"
//           onClick={() => navigate('/applicant/profile/edit-cv')}
//         >
//           Upload CV Now
//         </Button>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 4, textAlign: 'center' }}>
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//         <Button 
//           variant="contained" 
//           color="primary"
//           onClick={handleRefresh}
//         >
//           Retry
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
//         Recommended Jobs For You
//       </Typography>
      
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//         <Typography variant="subtitle1" color="text.secondary">
//           {pagination.totalResults} jobs matched your profile
//         </Typography>
//         <Button 
//           variant="outlined" 
//           onClick={handleRefresh}
//           disabled={loading}
//         >
//           Refresh Recommendations
//         </Button>
//       </Box>

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : jobs.length === 0 ? (
//         <Alert severity="info">
//           No recommendations found. Try updating your profile or CV.
//         </Alert>
//       ) : (
//         <>
//           <Grid container spacing={3}>
//             {jobs.map((job) => (
//               <Grid item xs={12} key={job.id}>
//                 <Card 
//                   sx={{ 
//                     cursor: 'pointer',
//                     transition: 'transform 0.2s',
//                     '&:hover': {
//                       transform: 'scale(1.01)',
//                       boxShadow: 3
//                     }
//                   }}
//                   onClick={() => handleJobClick(job.id)}
//                 >
//                   <CardContent>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <Box>
//                         <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                           {job.title}
//                         </Typography>
//                         <Typography variant="subtitle1" color="primary">
//                           {job.company}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                           {job.location}
//                         </Typography>
//                       </Box>
//                       <Box>
//                         <Chip 
//                           label={`${job.match_score}% Match`} 
//                           color={
//                             job.match_score > 75 ? 'success' : 
//                             job.match_score > 50 ? 'warning' : 'error'
//                           }
//                         />
//                       </Box>
//                     </Box>
                    
//                     <Divider sx={{ my: 2 }} />
                    
//                     <Typography variant="body2" sx={{ mb: 2 }}>
//                       {job.description.length > 200 
//                         ? `${job.description.substring(0, 200)}...` 
//                         : job.description}
//                     </Typography>
                    
//                     <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                       {job.skills_required?.slice(0, 5).map((skill, index) => (
//                         <Chip 
//                           key={index} 
//                           label={skill} 
//                           size="small"
//                           color="primary"
//                           variant="outlined"
//                         />
//                       ))}
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
          
//           {pagination.totalPages > 1 && (
//             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//               <Pagination
//                 count={pagination.totalPages}
//                 page={pagination.page}
//                 onChange={handlePageChange}
//                 color="primary"
//                 disabled={loading}
//               />
//             </Box>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default RecommendedJobs;