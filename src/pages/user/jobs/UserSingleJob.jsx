import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import ProcessColumn from "../../../components/companyProcess/ProcessColumn";
import JobDetails from "../../../components/job/JobDetails";
import { Box, Button } from "@mui/material";
import ApplicationForm from "./ApplicationForm";
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
    try {
      const application = {
        user: `${user.id}`,
        job: `${jobId}`,
        status: `1`,
      };
      const res = await createApplication(application);
      console.log(res);
      userAppRefetch();
    } catch (error) {
      alert('Complete your profile before applying!')
      console.error("Error creating application:", error);
    }
  }

  const {
    data: userApp,
    error: userAppError,
    isLoading: userAppLoading,
    refetch: userAppRefetch,
  } = useQuery({
    queryKey: ["userApp"],
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
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await getJobById(jobId);
      return res;
    },
  });

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
            style={{
              backgroundColor: "#901b20",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              margin: "10px 0"
            }}
          />
          <div style={{ 
            minHeight: "30vh", 
            display: "flex", 
            justifyContent: "center", 
            flexDirection: "column",
            width: "100%",
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #901b20"
          }}>
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
                style={{
                  border: "1px solid #901b20",
                  borderRadius: "5px",
                  padding: "15px"
                }}
              />
            )}
          </div>
        </>
      ) : (
        <Button
          variant="contained"
          onClick={() => handleClick()}
          style={{
            backgroundColor: "#901b20",
            color: "white",
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "1rem",
            fontWeight: "bold",
            '&:hover': {
              backgroundColor: "#7a161b"
            }
          }}
        >
          Apply for this job!
        </Button>
      )}
    </div>
  );
};

export default UserSingleJob;