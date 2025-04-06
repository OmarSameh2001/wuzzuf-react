import { useNavigate, useLocation } from "react-router";
import JobCard from "../../../components/job/JobCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { CircularProgress, Pagination, TextField } from "@mui/material";
import { Button } from "react-bootstrap";
import { getApplicationsByUser } from "../../../services/Application";
import { userContext } from "../../../context/UserContext";
import { getAllJobs } from "../../../services/Job";
import CustomPagination from "../../../components/pagination/pagination";

function CompanyJobs() {
//   const location = useLocation();
  const {user} = useContext(userContext)
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    title: "",
    company: user?.id 
  });
  const [searchFilters, setSearchFilters] = useState({
    title: "",
    company: user?.id 
  });

  const {
    data: companyJobs,
    error: companyJobsError,
    isLoading: companyJobsLoading,
    refetch: companyJobsRefetch,
  } = useQuery({
    queryKey: ["companyJobs", page, pageSize, searchFilters],
    queryFn: async () => {
      const res = await getAllJobs({
        filters: searchFilters,
        page,
        pageSize,
      });
      setTotal(res.data.count);
      return res.data.results;
    },
    keepPreviousData: true,
  });

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    setSearchFilters(filters);
    setPage(1);
    companyJobsRefetch();
  };

  const handleReset = () => {
    setFilters({ title: "", company: user?.id });
    setSearchFilters({ title: "", company: user?.id });
    setPage(1);
    companyJobsRefetch();
  };

  // const handlePageChange = (newPage) => {
  //   setPage(newPage);
  //   companyJobsRefetch();
  // };

  return (
    <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <header style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h1 style={{ fontSize: "2rem", margin: "1rem" }}>Company Jobs</h1>
        <Button onClick={()=>navigate('/company/jobCreate')}>Create New Job</Button>
      </header>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <TextField
          label="Search by name"
          name="title"
          value={filters.title}
          onChange={handleChange}
          style={{ margin: "1rem" }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="contained" onClick={handleReset}>
          Reset
        </Button>
      </div>
        {companyJobsLoading ? (
          <CircularProgress />
        ) : (
          companyJobs?.map((job) => (
            <JobCard key={job.id} job={job}/>
          ))
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
export default CompanyJobs;

