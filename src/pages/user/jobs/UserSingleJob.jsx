import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ProcessColumn from "../../../components/companyProcess/ProcessColumn";
import JobDetails from "../../../components/job/JobDetails";
import { Box, Button } from "@mui/material";
import ApplicationForm from "./ApplicationForm";
// import PhasesSwitcher from '../../../components/job/PhasesSwitcher';
import Meeting from "../../../components/job/user/Meeting";
import { useQuery } from "@tanstack/react-query";
import {
  createApplication,
  getApplicationsByUser,
} from "../../../services/Application";
import { userContext } from "../../../context/UserContext";
import { getJobById } from "../../../services/Job";
const UserSingleJob = () => {
  const { jobId } = useParams();
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const [userJob, setUserJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickedColumn, setClickedColumn] = useState(1);
  // const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [apply, setApply] = useState(false);

  const [searchFilters, setSearchFilters] = useState({
    user: `${user?.id}`,
    job: `${jobId}` || null,
  });


  const formRef = useRef(null);

  const phases = [
    "Application",
    "Technical Assessment",
    "Technical Interview",
    "Hr Interview",
    "Offer",
  ];

  async function handleClick() {
    const application = {
      user: `${user.id}`,
      job: `${jobId}`,
      status: `1`,
    };
    const res = await createApplication(application);
    console.log(res);
    userAppRefetch();
  }

  const {
    data: userApp,
    error: userAppError,
    isLoading: userAppLoading,
    refetch: userAppRefetch,
  } = useQuery({
    queryKey: ["userApp", page, pageSize, searchFilters],
    queryFn: async () => {
      // console.log({ filters: searchFilters, page, pageSize })
      const res = await getApplicationsByUser({
        filters: searchFilters,
        page,
        pageSize,
      });
      // console.log(res)
      setTotal(res.count);
      return res.results[0] || {};
    },
  });
  // console.log(userApp)
  const {
    data: jobsData,
    error: jobsError,
    isLoading: jobsLoading,
  } = useQuery({
    queryKey: ["jobs", page, pageSize, searchFilters],
    queryFn: async () => {
      const res = await getJobById(jobId);
      // console.log(res);
      return res;
    },
  });

  // useEffect(() => {
  //   const fetchUserJob = async () => {
  //     try {
  //       // Fetch user-job details (Replace with actual API endpoint)
  //       const response = await axios.get(`/api/user-jobs/${jobId}`);
  //       setUserJob(response.data);
  //     } catch (err) {
  //       setError("Failed to fetch job application details.");
  //     } finally {
  //       setLoading(false); // Ensure loading is false after fetching
  //     }
  //   };

  //   fetchUserJob();
  // }, [jobId]);

  if (jobsLoading || userAppLoading)
    return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
      <JobDetails job={userApp?.job_details || jobsData} />
      {userApp && Object.keys(userApp).length !== 0 ? (
        <>
          <ProcessColumn
            setter={setClickedColumn}
            column={clickedColumn}
            phases={phases}
          />
          {clickedColumn === 1 && (
            <ApplicationForm
              questions={userApp?.job_details?.questions}
              answers={userApp?.answers}
              application={userApp}
              refetch={userAppRefetch}
            />
          )}
          {clickedColumn > 1 && (
            <Meeting
              phase={phases[clickedColumn - 1]}
              applicationData={userApp}
              clickedColumn={clickedColumn}
            />
          )}
        </>
      ) : (
        <>
          <button
            className="btn btn-primary mt-2"
            style={{ width: "fit-content" }}
            onClick={() => handleClick()}
          >
            Apply for this job!
          </button>
        </>
      )}
    </div>
  );
};

export default UserSingleJob;
