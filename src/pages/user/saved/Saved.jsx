import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import JobCard from "../../../components/job/JobCard";
import { useQuery } from "@tanstack/react-query";
import { getAllJobs } from "../../../services/Job";
import { getApplicationsByUser } from "../../../services/Application";
import { userContext } from "../../../context/UserContext";
import { Typography } from "@mui/material";
import CustomPagination from "../../../components/pagination/pagination";

function UserSaved() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const { user } = useContext(userContext);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    user: "",
    job: "",
    status: "",
  });

  const [searchFilters, setSearchFilters] = useState({
    user: `${user.id}`,
    job: "",
    status: "1",
  });

  const {
    data: saved,
    error: savedError,
    isLoading: savedLoading,
    refetch,
  } = useQuery({
    queryKey: ["saved", page, pageSize, searchFilters],
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

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    setSearchFilters(filters); // Update search filters
    setPage(1); // Reset to first page
    refetch(); // Fetch with new filters
  };

  const handleReset = () => {
    setFilters({ user: "", job: "", status: "" });
    setSearchFilters({ user: "", job: "", status: "" });
    setPage(1); // Reset page
    refetch(); // Fetch without filters
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100">
      <h2>Your Saved Jobs</h2>
      {/* <div className="filters mb-3 d-flex flex-column align-items-center gap-2">
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="User"
            name="user"
            value={filters.user}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Job"
            name="job"
            value={filters.job}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Status"
            name="status"
            value={filters.status}
            onChange={handleChange}
          />
        </div>
        <div className="d-flex gap-2">
          <button
            disabled={
              !(
                filters.user ||
                filters.job ||
                filters.status
              )
            }
            onClick={handleReset}
            className="btn btn-danger"
          >
            Reset
          </button>
          <button
            disabled={
              !(
                filters.user ||
                filters.job ||
                filters.status
              )
            }
            onClick={handleSearch}
            className="btn btn-primary"
          >
            Search
          </button>
        </div>
      </div> */}
      {saved && saved.length ? (
        saved?.map((save) => (
          <JobCard
            key={save.id}
            job={save.job_details}
            user={"user"}
            type={"saved"}
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
      {saved && saved.length === 0 && (
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
}

export default UserSaved;
