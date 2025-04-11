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
    attend: "",
    status: "1",
  });

  const [searchFilters, setSearchFilters] = useState({
    title: "",
    location: "",
    experince: "",
    type_of_job: "",
    attend: "",
    status: "1",
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
      attend: "",
      status: "1",
    });
    setPage(1); // Reset page
    refetch(); // Fetch without filters
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100">
      <h2 style={{ color: "#901b20" }}>Available Jobs</h2>
      <div className="filters mb-3 d-flex flex-column align-items-center gap-2">
        <div className="d-flex gap-2 flex-wrap justify-content-center" style={{maxWidth: '70vw'}}>
          <input
            type="text"
            className="form-control"
            placeholder="Job Title"
            name="title"
            value={filters.title}
            onChange={handleChange}
            style={{ borderColor: "#901b20" }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Location"
            name="location"
            value={filters.location}
            onChange={handleChange}
            style={{ borderColor: "#901b20" }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Experience"
            name="experince"
            value={filters.experince}
            onChange={handleChange}
            style={{ borderColor: "#901b20" }}
          />
          <select
            name={"attend"}
            value={filters.attend || ""}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Attendance</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
          <select
            name={"type_of_job"}
            value={filters.type_of_job || ""}
            onChange={handleChange}
            style={{ borderColor: "#901b20" }}
          />
        </div>
        <div className="d-flex gap-2">
          <button
            disabled={
              !(
                filters.title ||
                filters.location ||
                filters.experince ||
                filters.type_of_job ||
                filters.attend
              )
            }
            onClick={handleReset}
            className="btn"
            style={{ backgroundColor: "#901b20", color: "white" }}
          >
            Reset
          </button>
          <button
            disabled={
              !(
                filters.title ||
                filters.location ||
                filters.experince ||
                filters.type_of_job ||
                filters.attend
              )
            }
            onClick={handleSearch}
            className="btn"
            style={{ backgroundColor: "#901b20", color: "white" }}
          >
            Search
          </button>
        </div>
      </div>
      {jobs?.map((job) => (
        <JobCard key={job.id} job={job} user={"user"} />
      ))}
      {jobLoading && (
        <div className="d-flex justify-content-center align-items-center w-100">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}  
      
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