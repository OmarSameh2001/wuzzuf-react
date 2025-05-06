import React, { useState, useContext, useRef, useEffect } from "react";
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
  Button,
  Box,
  CircularProgress,
  Typography,
  Alert,
  TextField,
  Grid,
  Divider,
  IconButton, // For delete icon button
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FaTrashAlt, FaUserPlus, FaFileUpload, FaSearch } from "react-icons/fa"; // Icons
import { userContext } from "../../context/UserContext";

// Import your API service functions
import { createTrack, createBranch, getBranches, getTracks } from "../../services/Api";
import { showConfirmToast } from "../../confirmAlert/toastConfirm";

function ItiInfo() {

  const [tracks, setTracks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLight } = useContext(userContext);
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

  // Custom button styles
  const buttonStyle = {
    primary: {
      backgroundColor: theme.primary,
      color: "#ffffff",
      "&:hover": {
        backgroundColor: theme.primaryHover,
      },
      transition: "all 0.3s ease",
      fontWeight: 500,
      borderRadius: "8px",
      textTransform: "none",
      boxShadow: theme.shadow,
    },
    secondary: {
      backgroundColor: "transparent",
      color: theme.primary,
      border: `1px solid ${theme.primary}`,
      "&:hover": {
        backgroundColor: isLight
          ? "rgba(67, 97, 238, 0.1)"
          : "rgba(76, 201, 240, 0.1)",
      },
      transition: "all 0.3s ease",
      fontWeight: 500,
      borderRadius: "8px",
      textTransform: "none",
    },
    danger: {
      color: theme.error,
      "&:hover": {
        backgroundColor: isLight
          ? "rgba(239, 68, 68, 0.1)"
          : "rgba(239, 68, 68, 0.2)",
      },
    },
  };

  //dialogss
  const [openAddBranch, setOpenAddBranch] = useState(false);
  const [openAddTrack, setOpenAddTrack] = useState(false);

  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchAddress, setNewBranchAddress] = useState("");
  const [newTrackName, setNewTrackName] = useState("");

  //search
  const [searchTrack, setSearchTrack] = useState("");
  const [searchBranch, setSearchBranch] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tracksData, branchesData] = await Promise.all([
          getTracks(),
          getBranches(),
        ]);
        setTracks(tracksData);
        setBranches(branchesData);

      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const filteredTracks = tracks.filter((track) =>
    track.name.toLowerCase().includes(searchTrack.toLowerCase())
  );

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchBranch.toLowerCase())
  );

 

  return (
    <Grid container spacing={10}
    sx={{
      backgroundColor: isLight ? "white" : "#121212",
      minHeight: "100vh", // Full viewport height
      justifyContent: "center", // Horizontal center
      paddingTop: "100px",
    }}>


      {/* dialogs */}

      {/* branch dialog */}
      <Dialog open={openAddBranch} onClose={() => setOpenAddBranch(false)}>
      <DialogTitle sx={{ backgroundColor: isLight ? "white" : "rgb(97, 94, 94)", color: isLight ? "black" : "white", fontWeight: "bold" }}>
        Add Branch
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: isLight ? "white" : "rgb(97, 94, 94)" }}>
        <Box component="form" onSubmit={async (e) => {
          e.preventDefault();
          try {
            await createBranch(newBranchName, newBranchAddress);
            setBranches(prev => [...prev, { name: newBranchName, address: newBranchAddress }]);
            setNewBranchName("");
            setNewBranchAddress("");
            setOpenAddBranch(false);
          } catch (err) {
            console.error(err.message);
          }
        }}>
          <TextField fullWidth label="Branch Name" value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Address" value={newBranchAddress} onChange={(e) => setNewBranchAddress(e.target.value)} required sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#882024" }}>Add Branch</Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: isLight ? "white" : "rgb(97, 94, 94)" }}>
        <Button onClick={() => setOpenAddBranch(false)} sx={{ color: "#882024" }}>Close</Button>
      </DialogActions>
    </Dialog>

    {/* track dialog */}
    <Dialog open={openAddTrack} onClose={() => setOpenAddTrack(false)}>
    <DialogTitle sx={{ backgroundColor: isLight ? "white" : "rgb(97, 94, 94)", color: isLight ? "black" : "white", fontWeight: "bold" }}>
      Add Track
    </DialogTitle>
    <DialogContent sx={{ backgroundColor: isLight ? "white" : "rgb(97, 94, 94)" }}>
      <Box component="form" onSubmit={async (e) => {
        e.preventDefault();
        try {
          await createTrack(newTrackName);
          setTracks(prev => [...prev, { name: newTrackName }]);
          setNewTrackName("");
          setOpenAddTrack(false);
        } catch (err) {
          console.error(err.message);
        }
      }}>
        <TextField fullWidth label="Track Name" value={newTrackName} onChange={(e) => setNewTrackName(e.target.value)} required sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#882024" }}>Add Track</Button>
      </Box>
    </DialogContent>
    <DialogActions sx={{ backgroundColor: isLight ? "white" : "rgb(97, 94, 94)" }}>
      <Button onClick={() => setOpenAddTrack(false)} sx={{ color: "#882024" }}>Close</Button>
    </DialogActions>
  </Dialog>



  {/* Branches Table */}
  <Grid item xs={12} md={6}>
  <Typography variant="h5" align="center" sx={{ mb: 2, color: isLight ? "black" : "white", fontWeight: "bold"  }}>
        Branches
      </Typography>
      <Button
      fullWidth
        onClick={() => setOpenAddBranch(true)}
        variant="contained"
        sx={{ backgroundColor: "#882024", mb: 2 }}
      >
        Add Branch
      </Button>
      <TextField
        label="Search Branch"
        size="small"
        variant="outlined"
        value={searchBranch}
        onChange={(e) => setSearchBranch(e.target.value)}
        fullWidth
        sx={{ mb: 1, 
          backgroundColor: isLight
          ? "white"
          : "rgba(255, 255, 255, 0.05)",
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
          color: isLight
            ? "rgba(0, 0, 0, 0.6)"
            : "rgba(255, 255, 255, 0.7)",
          "&.Mui-focused": {
            color: "white",
          },
        },
        "& .MuiInputBase-input": {
          color: theme.text,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: isLight
            ? "rgba(0, 0, 0, 0.23)"
            : "rgba(255, 255, 255, 0.23)",
        },
         }}
      />

    <Paper
      sx={{
        overflow: "hidden",
        backgroundColor: isLight ? "white" : "rgba(33, 33, 33, 0.9)",
        borderRadius: 2,
        mb: 3,
      }}
    >
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow >
              <TableCell sx={{ fontWeight: "bold",                         
              color: isLight ? "gray" : "black",
                        borderColor: isLight
                          ? "grey.300"
                          : "rgba(255, 255, 255, 0.5)",
                        textAlign: "center",
                        backgroundColor: "rgba(202, 200, 200, 0.5)", }}>Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold",
                                        color: isLight ? "gray" : "black",
                                        borderColor: isLight
                                          ? "grey.300"
                                          : "rgba(255, 255, 255, 0.5)",
                                        textAlign: "center",
                                        backgroundColor: "rgba(202, 200, 200, 0.5)",
               }}>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBranches.map((branch) => (
              <TableRow hover key={branch.id}>
                <TableCell sx={{ color: isLight ? "rgb(80, 78, 78)" : "rgb(209, 206, 206)", fontWeight: "bold"}}>{branch.name}</TableCell>
                <TableCell sx={{ color: isLight ? "rgb(80, 78, 78)" : "rgb(209, 206, 206)"}} width={"600px"}>{branch.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </Grid>

  {/* Tracks Table */}
  <Grid item xs={12} md={4}>
  <Typography  variant="h5" align="center" sx={{mb: 2, color: isLight ? "black" : "white", fontWeight: "bold" }}>
        Tracks
      </Typography>
      <Button
      fullWidth
        onClick={() => setOpenAddTrack(true)}
        variant="contained"
        sx={{ backgroundColor: "#882024", mb: 2 }}
      >
        Add Track
      </Button>
      <TextField
        label="Search Track"
        variant="outlined"
        size="small"
        value={searchTrack}
        onChange={(e) => setSearchTrack(e.target.value)}
        fullWidth
        sx={{ mb: 1,
          backgroundColor: isLight
          ? "white"
          : "rgba(255, 255, 255, 0.05)",
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
          color: isLight
            ? "rgba(0, 0, 0, 0.6)"
            : "rgba(255, 255, 255, 0.7)",
          "&.Mui-focused": {
            color: "white",
          },
        },
        "& .MuiInputBase-input": {
          color: theme.text,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: isLight
            ? "rgba(0, 0, 0, 0.23)"
            : "rgba(255, 255, 255, 0.23)",
        },
         }}
      />

    <Paper
      sx={{
        overflow: "hidden",
        backgroundColor: isLight ? "white" : "rgba(33, 33, 33, 0.9)",
        borderRadius: 2,
        mb: 3,
      }}
    >
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold",                         
              color: isLight ? "gray" : "black",
                        borderColor: isLight
                          ? "grey.300"
                          : "rgba(255, 255, 255, 0.5)",
                        textAlign: "center",
                        backgroundColor: "rgba(202, 200, 200, 0.5)", }}
                >Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTracks.map((track) => (
              <TableRow hover key={track.id}>
                <TableCell align="center" sx={{ color: isLight ? "rgb(80, 78, 78)" : "rgb(209, 206, 206)", fontWeight: "bold"}}>{track.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </Grid>
</Grid>

  );
  // const { isLight } = useContext(userContext);

  // const queryClient = useQueryClient();
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // // State for single creation form
  // const [branch, setBranch] = useState("");
  // const [ branchAddress, setBranchAddress] = useState("");
  // const [track, setTrack] = useState("");

  // const [searchQuery, setSearchQuery] = useState("");

  // const [openSingleForm, setOpenSingleForm] = useState(false);

  // const [feedback, setFeedback] = useState({ message: "", severity: "info" }); 

  // // Modern color palette
  // const colors = {
  //   light: {
  //     background: "#ffffff",
  //     primary: "#882024",
  //     cardBg: "#ffffff",
  //     sectionBg: "#f8f9fa",
  //     text: "#333333",
  //     accent: "#e63946", // Modern red
  //     accentHover: "#d62b3a",
  //     secondary: "#457b9d", // Blue accent
  //     muted: "#6c757d",
  //     border: "#dee2e6",
  //     primaryHover: "#701c1f",
  //     shadow: "0px 4px 12px rgba(0,0,0,0.1)",
  //   },
  //   dark: {
  //     background: "#121212",
  //     primary: "#f25d69",
  //     cardBg: "#1e1e1e",
  //     sectionBg: "#242424",
  //     text: "#f8f9fa",
  //     accent: "#e63946", // Same red accent for consistency
  //     accentHover: "#f25d69",
  //     secondary: "#64b5f6", // Lighter blue for dark mode
  //     muted: "#adb5bd",
  //     border: "#343a40",
  //     primaryHover: "#e63946",
  //     shadow: "0px 4px 12px rgba(0,0,0,0.3)",
  //   },
  // };

  // // Get current theme colors
  // const theme = isLight ? colors.light : colors.dark;

  // // Custom button styles
  // const buttonStyle = {
  //   primary: {
  //     backgroundColor: theme.primary,
  //     color: "#ffffff",
  //     "&:hover": {
  //       backgroundColor: theme.primaryHover,
  //     },
  //     transition: "all 0.3s ease",
  //     fontWeight: 500,
  //     borderRadius: "8px",
  //     textTransform: "none",
  //     boxShadow: theme.shadow,
  //   },
  //   secondary: {
  //     backgroundColor: "transparent",
  //     color: theme.primary,
  //     border: `1px solid ${theme.primary}`,
  //     "&:hover": {
  //       backgroundColor: isLight
  //         ? "rgba(67, 97, 238, 0.1)"
  //         : "rgba(76, 201, 240, 0.1)",
  //     },
  //     transition: "all 0.3s ease",
  //     fontWeight: 500,
  //     borderRadius: "8px",
  //     textTransform: "none",
  //   },
  //   danger: {
  //     color: theme.error,
  //     "&:hover": {
  //       backgroundColor: isLight
  //         ? "rgba(239, 68, 68, 0.1)"
  //         : "rgba(239, 68, 68, 0.2)",
  //     },
  //   },
  // };

  // // --- Data Fetching ---
  // const {
  //   data: branchData,
  //   error: fetchBranchError,
  //   isLoading: isFetchingBranches,
  //   isFetching: isRefetchingBranches,
  // } = useQuery({
  //   queryKey: ["branches", page, rowsPerPage, searchQuery],
  //   queryFn: async () => {
  //     const data = await getBranches(page + 1, rowsPerPage, searchQuery);
  //     return data;
  //   },
  //   keepPreviousData: true,
  // });

  // const {
  //   data: trackData,
  //   error: fetchTrackError,
  //   isLoading: isFetchingTracks,
  //   isFetching: isRefetchingTracks,
  // } = useQuery({
  //   queryKey: ["tracks", page, rowsPerPage, searchQuery],
  //   queryFn: async () => {
  //     const data = await getTracks(page + 1, rowsPerPage, searchQuery);
  //     return data;
  //   },
  //   keepPreviousData: true,
  // });
  
  // // --- Invalidate Query and Reset Forms ---
  // const handleMutationSuccess = (successMessage) => {
  //   queryClient.invalidateQueries({ queryKey: ["tracks"] });
  //   // Reset forms
  //   setBranch("");
  //   setBranchAddress("");
  //   setTrack("")
  // };

  // const handleMutationError = (error, defaultMessage) => {
  //   const errorMessage =
  //     error?.response?.data?.error ||
  //     error?.response?.data?.message ||
  //     error.message ||
  //     defaultMessage;
  // };

  // // --- Single Creation Mutation ---
  // const createTrackMutation = useMutation({
  //   mutationFn: createTrack,
  //   onSuccess: (data) =>
  //     handleMutationSuccess(data.message || "Branch added successfully!"),
  //   onError: (error) => handleMutationError(error, "Failed to add branch."),
  // });

  // // --- Event Handlers ---
  // const handleChangePage = (event, newPage) => setPage(newPage);
  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  // const handleSingleSubmit = (event) => {
  //   event.preventDefault();
  //   if (!track) {
  //     // showFeedback("track or branch are required.", "warning");
  //     return;
  //   }
  //   setFeedback({ message: "", severity: "info" }); // Clear previous feedback
  //   createTrackMutation.mutate({ track});
  // };

  // // --- Render Logic ---
  // const trackDatas = trackData;
  // const branchDatas = branchData;

  // return (
  //   <div
  //     style={{
  //       width: "100%",
  //       minHeight: "100vh",
  //       backgroundColor: theme.background,
  //       color: theme.text,
  //       transition: "background-color 0.3s ease, color 0.3s ease",
  //       padding: "20px",
  //     }}
  //   >
  //     <div>{trackData.map((track) => track.name)}</div>
  //     <Box
  //       sx={{
  //         padding: { xs: 2, sm: 3 },
  //         backgroundColor: "rgba(255, 255, 255, 0.1)",
  //         color: theme.text,
  //         width: { xs: "95%", sm: "90%", md: "80%", lg: "70%" },
  //         mx: "auto",
  //         my: 4,
  //         borderRadius: "12px",
  //         boxShadow: theme.shadow,
  //         transition: "all 0.3s ease",
  //       }}
  //     >
  //       {/* --- Itian Table --- */}
  //       <Typography
  //         variant="h5"
  //         gutterBottom
  //         sx={{
  //           textAlign: "center",
  //           mb: 4,
  //           color: theme.text,
  //           fontWeight: 600,
  //           position: "relative",
  //           "&:after": {
  //             content: '""',
  //             position: "absolute",
  //             bottom: "-10px",
  //             left: "50%",
  //             transform: "translateX(-50%)",
  //             width: "60px",
  //             height: "3px",
  //             backgroundColor: theme.primary,
  //             borderRadius: "2px",
  //           },
  //         }}
  //       >
  //         Tracks
  //       </Typography>

  //       {/* Search Bar */}
  //       <Grid item xs={12} md={7}>
  //         {/* Buttons to trigger modals */}
  //         <Box
  //           sx={{
  //             display: "flex",
  //             gap: 2,
  //             flexDirection: { xs: "column", sm: "row" },
  //             width: "100%",
  //             mb: 4,
  //           }}
  //         >
  //           <Button
  //             variant="contained"
  //             startIcon={<FaUserPlus />}
  //             onClick={() => setOpenSingleForm(true)}
  //             sx={{
  //               ...buttonStyle.primary,
  //               flex: { xs: "1", sm: "1 0 auto" },
  //               py: 1.2,
  //               backgroundColor: "#882024",
  //             }}
  //           >
  //             Add New Track
  //           </Button>
  //         </Box>

  //         {/* --- Modal for Single ITian Form --- */}
  //         <Dialog
  //           open={openSingleForm}
  //           onClose={() => setOpenSingleForm(false)}
  //         >
  //           <DialogTitle
  //             sx={{
  //               backgroundColor: isLight ? "white" : "rgb(97, 94, 94)",
  //               color: isLight ? "black" : "white",
  //               fontWeight: "bold",
  //             }}
  //           >
  //             Add New Track
  //           </DialogTitle>
  //           <DialogContent
  //             sx={{ backgroundColor: isLight ? "white" : "rgb(97, 94, 94)" }}
  //           >
  //             <Box component="form" onSubmit={handleSingleSubmit} noValidate>
  //               <TextField
  //                 margin="normal"
  //                 required
  //                 fullWidth
  //                 id="track"
  //                 label="Track Name"
  //                 name="track"
  //                 autoComplete="track"
  //                 value={trackData}
  //                 onChange={(e) => setTrack(e.target.value)}
  //                 disabled={createTrackMutation.isLoading}
  //                 sx={{
  //                   backgroundColor: isLight
  //                     ? "white"
  //                     : "rgba(255, 255, 255, 0.1)",
  //                   color: isLight ? "black" : "white",
  //                   "& .MuiInputLabel-root": {
  //                     color: isLight ? "black" : "white",
  //                   },
  //                   "& .MuiInputBase-root": {
  //                     color: isLight ? "black" : "white",
  //                   },
  //                 }}
  //               />
  //               <Button
  //                 type="submit"
  //                 fullWidth
  //                 variant="contained"
  //                 sx={{ mt: 2, mb: 1, backgroundColor: "#882024" }}
  //                 disabled={createTrackMutation.isLoading}
  //                 startIcon={
  //                   createTrackMutation.isLoading ? (
  //                     <CircularProgress size={20} color="inherit" />
  //                   ) : (
  //                     <FaUserPlus />
  //                   )
  //                 }
  //               >
  //                 {createTrackMutation.isLoading ? "Adding..." : "Add Track"}
  //               </Button>
  //             </Box>
  //           </DialogContent>
  //           <DialogActions
  //             sx={{ backgroundColor: isLight ? "white" : "rgb(97, 94, 94)" }}
  //           >
  //             <Button
  //               sx={{
  //                 fontWeight: 600,
  //                 color: "#882024",
  //                 backgroundColor: isLight ? "white" : "rgb(97, 94, 94)",
  //               }}
  //               onClick={() => setOpenSingleForm(false)}
  //             >
  //               Close
  //             </Button>
  //           </DialogActions>
  //         </Dialog>

  //         <Grid item xs={12} md={5} sx={{ mb: 3 }}>
  //           <TextField
  //             label="Search by Track Name"
  //             variant="outlined"
  //             size="small"
  //             fullWidth
  //             value={searchQuery}
  //             onChange={(e) => {
  //               setSearchQuery(e.target.value);
  //               setPage(0);
  //             }}
  //             InputProps={{
  //               startAdornment: (
  //                 <FaSearch style={{ marginRight: 8, opacity: 0.6 }} />
  //               ),
  //             }}
  //             sx={{
  //               backgroundColor: isLight
  //                 ? "white"
  //                 : "rgba(255, 255, 255, 0.05)",
  //               borderRadius: "8px",
  //               "& .MuiOutlinedInput-root": {
  //                 borderRadius: "8px",
  //                 "&:hover .MuiOutlinedInput-notchedOutline": {
  //                   borderColor: "#882024",
  //                 },
  //                 "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //                   borderColor: "#882024",
  //                 },
  //               },
  //               "& .MuiInputLabel-root": {
  //                 color: isLight
  //                   ? "rgba(0, 0, 0, 0.6)"
  //                   : "rgba(255, 255, 255, 0.7)",
  //                 "&.Mui-focused": {
  //                   color: "white",
  //                 },
  //               },
  //               "& .MuiInputBase-input": {
  //                 color: theme.text,
  //               },
  //               "& .MuiOutlinedInput-notchedOutline": {
  //                 borderColor: isLight
  //                   ? "rgba(0, 0, 0, 0.23)"
  //                   : "rgba(255, 255, 255, 0.23)",
  //               },
  //             }}
  //           />
  //         </Grid>
  //       </Grid>

  //       {/* Loading/Error/Empty States for Table */}
  //       {isFetchingTracks && (
  //         <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
  //           <CircularProgress
  //             sx={{
  //               color: isLight ? "primary.main" : "rgba(255, 255, 255, 0.7)",
  //             }}
  //           />
  //         </Box>
  //       )}

  //       {fetchTrackError && (
  //         <Alert
  //           severity="error"
  //           sx={{
  //             mb: 2,
  //             backgroundColor: isLight
  //               ? "rgba(255, 255, 255, 0.9)"
  //               : "rgba(33, 33, 33, 0.8)",
  //             color: isLight ? "error.main" : "white",
  //             borderColor: isLight ? "error.main" : "rgba(255, 255, 255, 0.5)",
  //             borderWidth: 1,
  //           }}
  //         >
  //           Failed to load tracks: {fetchTrackError.message}
  //         </Alert>
  //       )}

  //       {!getTracks && !fetchTrackError && trackData.length === 0 && (
  //         <Typography
  //           sx={{
  //             textAlign: "center",
  //             mt: 4,
  //             color: isLight ? "text.secondary" : "rgba(255, 255, 255, 0.7)",
  //           }}
  //         >
  //           No Tracks found.
  //         </Typography>
  //       )}

  //       {/* Actual Table */}
  //       {!getTracks && !fetchTrackError && trackData.length > 0 && (
  //         <Paper
  //           sx={{
  //             width: "100%",
  //             overflow: "hidden",
  //             backgroundColor: isLight ? "white" : "rgba(33, 33, 33, 0.9)",
  //             transition: "background-color 0.5s ease",
  //             mb: 12,
  //           }}
  //         >
  //           <TableContainer sx={{ maxHeight: 600 }}>
  //             <Table stickyHeader aria-label="itians table">
  //               <TableHead>
  //                 <TableRow>
  //                   <TableCell
  //                     sx={{
  //                       color: isLight ? "text.primary" : "black",
  //                       borderColor: isLight
  //                         ? "grey.300"
  //                         : "rgba(255, 255, 255, 0.5)",
  //                       backgroundColor: "rgba(202, 200, 200, 0.5)",
  //                     }}
  //                   >
  //                     Track Name
  //                   </TableCell>
  //                 </TableRow>
  //               </TableHead>
  //               <TableBody>
  //                 {trackData.map((tr) => (
  //                   <TableRow hover key={tr.id}>
  //                     <TableCell
  //                       sx={{ color: isLight ? "text.primary" : "white" }}
  //                     >
  //                       {tr.name}
  //                     </TableCell>
  //                   </TableRow>
  //                 ))}
  //               </TableBody>
  //             </Table>
  //           </TableContainer>
  //           <TablePagination
  //             sx={{
  //               borderTop: `1px solid ${theme.border}`,
  //               color: theme.text,
  //               ".MuiTablePagination-toolbar": {
  //                 display: "flex",
  //                 justifyContent: "center", // Center all contents
  //                 alignItems: "center",
  //                 flexWrap: "nowrap",
  //                 gap: 2, // Optional: add a little space between elements
  //               },
  //               ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
  //                 {
  //                   color: theme.muted,
  //                 },
  //               ".MuiTablePagination-select": {
  //                 color: theme.text,
  //               },
  //               ".MuiTablePagination-selectIcon": {
  //                 color: theme.muted,
  //               },
  //               ".MuiTablePagination-actions button": {
  //                 color: theme.primary,
  //                 "&.Mui-disabled": {
  //                   color: theme.muted,
  //                 },
  //               },
  //             }}
  //             rowsPerPageOptions={[5, 10, 25, 50]}
  //             component="div"
  //             count={totalItians}
  //             rowsPerPage={rowsPerPage}
  //             page={page}
  //             onPageChange={handleChangePage}
  //             onRowsPerPageChange={handleChangeRowsPerPage}
  //           />
  //         </Paper>
  //       )}
  //     </Box>
  //   </div>
  // );
}

// Header style definition
const headerStyle = {
  backgroundColor: "black",
  color: "#ffffff",
  fontWeight: "bold",
};

export default ItiInfo;
