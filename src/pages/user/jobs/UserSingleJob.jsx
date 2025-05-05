import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ProcessColumn from "../../../components/companyProcess/ProcessColumn";
import JobDetails from "../../../components/job/JobDetails";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import ApplicationForm from "./ApplicationForm";
// import PhasesSwitcher from '../../../components/job/PhasesSwitcher';
import Meeting from "../../../components/job/user/Meeting";
import { useQuery } from "@tanstack/react-query";
import {
  createApplication,
  getApplicationsByUser,
} from "../../../services/Application";
import { toast } from "react-hot-toast";
import { userContext } from "../../../context/UserContext";
import { getAllJobs, getJobById } from "../../../services/Job";
import Loading from "../../helpers/Loading";
import NotFound from "../../helpers/NotFound";
import { getCompanyById } from "../../../services/Auth";
import { id, se } from "date-fns/locale";
import CompanyBox from "../../../components/accounts/CompanyBox";
import CompanyJobsBox from "../../../components/job/CompanyJobsBox";
import { showErrorToast,showInfoToast,showSuccessToast } from "../../../confirmAlert/toastConfirm";
import Contract from "../../../components/job/user/Contract";
const UserSingleJob = () => {
  const { jobId } = useParams();
  const { user, isLight } = useContext(userContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [clickedColumn, setClickedColumn] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [companyId, setCompanyId] = useState(0);

  const [searchFilters, setSearchFilters] = useState({
    user: `${user?.id}`,
    job: `${jobId}` || null,
  });

  

  const phases = [
    "Application",
    "Technical Assessment",
    "Technical Interview",
    "Hr Interview",
    "Offer",
    "Contract",
  ];

  async function handleClick() {
    try {
      const application = {
        user: `${user.id}`,
        job: `${jobId}`,
        status: `1`,
      };
      const res = await createApplication(application);
      showSuccessToast("Applying phase started your progress will be in saved section", 2000, isLight);
      userAppRefetch();
    } catch (error) {
      showInfoToast("Complete your profile before applying!", 2000, isLight);
      console.error("Error creating application:", error);
    }
  }
  const {
    data: company,
    error: companyError,
    isLoading: companyLoading,
    refetch: companyRefetch,
  } = useQuery({
    queryKey: ["company", companyId],
    queryFn: async () => {
      const res = await getCompanyById(companyId);
      setTotal(res.count);
      return res || {};
    },
  });
  const {
    data: companyJobs,
    error: companyJobsError,
    isLoading: companyJobsLoading,
    refetch: companyJobsRefetch,
  } = useQuery({
    queryKey: ["companyJobs", companyId],
    queryFn: async () => {
      if (!companyId) {
        return {};
      }

      const res = await getAllJobs({
        filters: { company: `${companyId}` },
        page: 1,
        pageSize: 5,
      });
      setTotal(res.count);
      return res?.data?.results || {};
    },
  });
  const {
    data: userApp,
    error: userAppError,
    isLoading: userAppLoading,
    refetch: userAppRefetch,
  } = useQuery({
    queryKey: ["userApp", jobId],
    queryFn: async () => {
      const res = await getApplicationsByUser({
        filters: searchFilters,
        page,
        pageSize,
      });
      setTotal(res.count);
      return res.results[0] || {};
    },
  });
  const {
    data: jobsData,
    error: jobsError,
    isLoading: jobsLoading,
  } = useQuery({
    queryKey: ["jobs", jobId],
    queryFn: async () => {
      try {
        const res = await getJobById(jobId);
        setCompanyId(res.company);
        return res;
      } catch (err) {
        return [];
      }
    },
  });
  if (jobsLoading || userAppLoading) return <Loading />;
  if (userApp?.length === 0) return;
  if (userAppError) return <NotFound />;

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        flexDirection: isMobile ? "column" : "row",
        maxWidth: "100vw",
        background: isLight ? "#fff" : "#242424",
        minWidth: "100%",
      }}
    >
      <div
        className="mt-2 d-flex flex-column justify-content-center align-items-center"
        // style={{ maxWidth: "100vw" }}
      >
        <JobDetails job={userApp?.job_details || jobsData} />
        <div
          style={{
            border: "1px solid #e3cdcd",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isLight ? "white" : "#121212",
            marginTop: "10px",
            padding: "20px",
            minWidth: "100%",
            maxWidth: "100vw",
            borderRadius: "5px",
          }}
        >
          {userApp && Object.keys(userApp).length !== 0 ? (
            <>
              <ProcessColumn
                setter={setClickedColumn}
                column={clickedColumn}
                phases={phases}
                application={userApp}
              />
              <div
                style={{
                  minHeight: "30vh",
                  display: "flex",
                  // justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                {clickedColumn === 1 && (
                  <ApplicationForm
                    questions={userApp?.job_details?.questions}
                    answers={userApp?.answers}
                    application={userApp}
                    refetch={userAppRefetch}
                  />
                )}
                {clickedColumn > 1 && clickedColumn < 6 && (
                  <Meeting
                    phase={phases[clickedColumn - 1]}
                    applicationData={userApp}
                    clickedColumn={clickedColumn}
                  />
                )}
                {clickedColumn === 6 && (
                  <Contract
                    applicationData={userApp}
                    company={company}
                  />
                )}
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "30px",
                gap: "20px",
                background: 'transparent',
              }}
            >
              <p
                style={{
                  fontSize: "1.2rem",
                  color: isLight ? "#555" : "#fff",
                  textAlign: "center",
                  maxWidth: "500px",
                  fontStyle: "italic",
                }}
              >
                "Every journey begins with a single step. Trust the path you are
                called to walk."
              </p>

              <button
                className="btn btn-lg"
                style={{
                  width: "220px",
                  backgroundColor:
                    jobsData?.status === "0" ? "#dc3545" : "#882024 ",
                  color: "white",
                  padding: "15px 25px",
                  borderRadius: "10px",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  border: "2px solid transparent",
                  transition: "all 0.3s ease",
                  cursor: jobsData?.status === "0" ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                onClick={() => handleClick()}
                disabled={jobsData?.status === "0"}
                onMouseEnter={(e) => {
                  if (jobsData?.status !== "0")
                    e.target.style.border = "2px solid white";
                }}
                onMouseLeave={(e) => {
                  if (jobsData?.status !== "0")
                    e.target.style.border = "2px solid transparent";
                }}
              >
                {jobsData?.status === "0" ? "Job is Closed" : "Apply Now"}
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: "5px" }}>
        {company && <CompanyBox profileData={company} />}
        {companyJobs && company && companyJobs?.length > 0 && (
          <CompanyJobsBox profileData={company} job={companyJobs} />
        )}
      </div>
    </div>
  );
};

export default UserSingleJob;
