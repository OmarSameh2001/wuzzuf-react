import React, { useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../../components/job/JobCard";
import { useQuery } from "@tanstack/react-query";
import { getAllJobs } from "../../../services/Job";
import CustomPagination from "../../../components/pagination/pagination";

function UserJobs() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    title: "",
    location: "",
    experince: "",
    type_of_job: "",
  });

  const [searchFilters, setSearchFilters] = useState({
    title: "",
    location: "",
    experince: "",
    type_of_job: "",
  });

  const {
    data: jobs,
    error: jobError,
    isLoading: jobLoading,
    refetch,
  } = useQuery({
    queryKey: ["jobs", page, pageSize, searchFilters],
    queryFn: async () => {
      const res = await getAllJobs({ filters: searchFilters, page, pageSize });
      setTotal(res.data.count);
      return res.data.results;
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
    setFilters({ title: "", location: "", experince: "", type_of_job: "" });
    setSearchFilters({
      title: "",
      location: "",
      experince: "",
      type_of_job: "",
    });
    setPage(1); // Reset page
    refetch(); // Fetch without filters
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100">
      <h2>Available Jobs</h2>
      <div className="filters mb-3 d-flex flex-column align-items-center gap-2">
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Job Title"
            name="title"
            value={filters.title}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Location"
            name="location"
            value={filters.location}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Experience"
            name="experince"
            value={filters.experince}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Type"
            name="type_of_job"
            value={filters.type_of_job}
            onChange={handleChange}
          />
        </div>
        <div className="d-flex gap-2">
          <button
            disabled={
              !(
                filters.title ||
                filters.location ||
                filters.experince ||
                filters.type_of_job
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
                filters.title ||
                filters.location ||
                filters.experince ||
                filters.type_of_job
              )
            }
            onClick={handleSearch}
            className="btn btn-primary"
          >
            Search
          </button>
        </div>
      </div>
      {jobs?.map((job) => (
        <JobCard key={job.id} job={job} user={"user"} />
      ))}
      <CustomPagination
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
      />
    </div>
  );
}

export default UserJobs;
