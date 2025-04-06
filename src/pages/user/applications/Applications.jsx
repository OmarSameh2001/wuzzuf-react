import React, { useContext, useState } from "react";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
} from "@mui/material";
import { getApplicationsByUser } from "../../../services/Application";
import { useQuery } from "@tanstack/react-query";
import JobCard from "../../../components/job/JobCard";
import { userContext } from "../../../context/UserContext";
import { useNavigate } from "react-router";
import CustomPagination from "../../../components/pagination/pagination";

const JobApplication = () => {
  const { user } = useContext(userContext);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    user: "",
    job: "",
    status: "",
  });

  const [searchFilters, setSearchFilters] = useState({
    user: `${user.id}`,
    job: "",
    status: "2,3,4,5,6",
  });

  const {
    data: application,
    error: applicationError,
    isLoading: applicationLoading,
    refetch,
  } = useQuery({
    queryKey: ["application", page, pageSize, searchFilters],
    queryFn: async () => {
      const res = await getApplicationsByUser({
        filters: searchFilters,
        page,
        pageSize,
      });
      console.log(res);
      setTotal(res.count);
      return res.results;
    },
  });

  return (
    <div className="d-flex flex-column align-items-center w-100">
      <h2>Your Jobs Applications</h2>
      {application?.length > 0 ? (
        application.map((application) => (
          <JobCard
            key={application.id}
            job={application.job_details}
            user={"user"}
          />
        ))
      ) : (
        <div
          style={{
            minHeight: "30vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">No applications found</Typography>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/applicant/jobs")}
          >
            Browse Jobs
          </button>
        </div>
      )}
      {application && application.length > 0 && (
        <CustomPagination
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          total={total}
        />
      )}
    </div>
  );
};

export default JobApplication;
