import { Navigate, useNavigate, useParams } from "react-router";
import ProcessColumn from "../../../components/companyProcess/ProcessColumn";
import ProcessCard from "../../../components/companyProcess/ProcessCard";
import { useContext, useEffect, useState } from "react";
import JobDetails from "../../../components/job/JobDetails";
import { useQuery } from "@tanstack/react-query";
import { getJobById, patchJob } from "../../../services/Job";
import { Business, CalendarMonth, People, WorkOutline } from "@mui/icons-material"
import { Button, Box, Typography, Paper, useMediaQuery, Tabs, Tab, CircularProgress } from "@mui/material"
import { userContext } from "../../../context/UserContext";
import MeetingsTable from "../../../components/companyProcess/MeetingsTable";
import '../../../styles/company/job/single_job.css';
import '../../../ComponentsStyles/process_column.css';
import DynamicSwitcher from "../../../components/companyProcess/DynamicSwitcher";
import { is } from "date-fns/locale";
import TopTalents from "../../../components/companyProcess/TopTalents";
import Loading from "../../helpers/Loading";
function SingleJob() {
  const phases = [
    "Applied",
    "Technical Assessment",
    "Technical Interview",
    "Hr Interview",
    "Offer",
    "Contract",
  ];
  const { id } = useParams();
  const [clickedColumn, setClickedColumn] = useState(1);
  const [calender, setCalender] = useState(false);
  const [isTalents, setIsTalents] = useState(false);
  const { user,isLight } = useContext(userContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)")

  const primaryColor = "#e53946"
  const backgroundColor = isLight ? "#ffffff" : "#121212"
  const textColor = isLight ? "#2d3748" : "#e2e8f0"
  const borderColor = isLight ? "#e3cdcd" : "#2d3748"
  const cardBackground = isLight ? "#ffffff" : "#1e1e1e"

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
    data: jobData,
    error: jobError,
    isLoading: jobLoading,
    refetch,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const res = await getJobById(id);
      return res;
    },
  });
  useEffect(() => {
    if (!user) return;
    if (!jobData) return;

    if (
      user.user_type !== "COMPANY" ||
      (jobData && parseInt(user.id) != jobData.company)
    ) {
      navigate("/company/jobs");
    }
  }, [user, jobData]);

  if (jobLoading)
    return (
      <Loading />
    )

    if (jobError)
      return (
        <Box
          className={`single-job-container ${isLight ? "light-mode" : "dark-mode"}`}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5" sx={{ color: primaryColor, fontWeight: 600 }}>
            Error loading job data
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/company/jobs")}
            sx={{
              backgroundColor: primaryColor,
              "&:hover": {
                backgroundColor: "#c62a37",
              },
            }}
          >
            Back to Jobs
          </Button>
        </Box>
      )
    if (jobError)
      return (
        <Box
          className={`single-job-container ${isLight ? "light-mode" : "dark-mode"}`}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5" sx={{ color: primaryColor, fontWeight: 600 }}>
            Error loading job data
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/company/jobs")}
            sx={{
              backgroundColor: primaryColor,
              "&:hover": {
                backgroundColor: "#c62a37",
              },
            }}
          >
            Back to Jobs
          </Button>
        </Box>
      )

  return (
    <div className={`single-job-container ${isLight ? "light-mode" : "dark-mode"}`} style={{minWidth:"100%"}}>
    <Box
      sx={{
        width: { xs: "100%", sm: "95%", md: "90%", lg: "80%" },
        mx: "auto",
        my: 2,
      }}
    >
      <Paper
        elevation={2}
        className="job-details-card"
        sx={{
          backgroundColor: cardBackground,
          borderRadius: "16px",
          overflow: "hidden",
          border: `1px solid ${borderColor}`,
        }}
      >
         <div className="job-page-content">
        <JobDetails job={jobData} refetch={refetch} />
        </div>
      </Paper>

      <Paper
        elevation={3}
        className="recruitment-panel"
        sx={{
          backgroundColor: cardBackground,
          borderRadius: "16px",
          border: `1px solid ${borderColor}`,
          mt: 3,
        }}
      >
        <Box className="view-toggle">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              px: 3,
              py: 2,
              borderBottom: `1px solid ${borderColor}`,
            }}
          >
            {/* <Typography variant="h5" sx={{ fontWeight: 600, color: textColor }}>
              Recruitment Process
            </Typography> */}
            <Tabs
              value={isTalents ? 1 : 0}
              orientation="horizontal"
              variant="scrollable"
              className="process-tabs"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#722732",
                  // borderBottom: `2px solid ${primaryColor}`,
                },
              }}
              sx={{
                '.process-tab':{
                  color: isLight ?'var(--gray-700)' :'red',
                  padding:'0'
                },
                '.process-tabs':{
                  borderBottom: `0px solid ${borderColor}`,
                }
              }}
            >
                <Tab
                  label={<Typography variant="h6">Recruitment Process</Typography>}
                  onClick={() => setIsTalents(false)}
                  className={`process-tab ${!isTalents ? "active" : ""}`}
                  sx={{marginRight:3}}
                />
                <Tab
                  label={<Typography variant="h6">Top Talents</Typography>}
                  onClick={() => setIsTalents(true)}
                  className={`process-tab ${isTalents ? "active" : ""}`}
                />
            </Tabs>

            {!isTalents && <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                onClick={() => setCalender(false)}
                className={`toggle-option ${!calender ? "active" : ""}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: !calender ? `${primaryColor}10` : "transparent",
                  color: !calender ? primaryColor : textColor,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: `${primaryColor}10`,
                  },
                }}
              >
                <People fontSize="small" />
                <Typography sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}>Applicants</Typography>
              </Box>

              <DynamicSwitcher setter={setCalender} getter={calender}/>

              <Box
                onClick={() => setCalender(true)}
                className={`toggle-option ${calender ? "active" : ""}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: calender ? `${primaryColor}10` : "transparent",
                  color: calender ? primaryColor : textColor,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: `${primaryColor}10`,
                  },
                }}
              >
                <CalendarMonth fontSize="small" />
                <Typography sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}>Meetings</Typography>
              </Box>
            </Box>}
          </Box>
        </Box>

        {!isTalents ? <Box className="process-content">
          {!calender ? (
            <>
              <ProcessColumn setter={setClickedColumn} column={clickedColumn} phases={phases} />
              <ProcessCard column={clickedColumn} phases={phases} job={jobData} />
            </>
          ) : (
            <>
              <ProcessColumn setter={setClickedColumn} column={clickedColumn} phases={phases.slice(2, 5)} />
              <MeetingsTable column={clickedColumn} phases={phases.slice(2, 5)} />
            </>
          )}
        </Box> : <TopTalents job={jobData.id} />}
      </Paper>
    </Box>
  </div>
  );
}

export default SingleJob;
