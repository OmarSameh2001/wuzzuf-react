import { useQuery } from "@tanstack/react-query";
import { jobTalents } from "../../services/Job";
import {
  Checkbox,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import "../../ComponentsStyles/CompanyProcess/application_table.css";
import ApplicantsTable from "./ApplicantsTable";
import Loading from "../../pages/helpers/Loading";
import { userContext } from "../../context/UserContext";
import { useContext, useState } from "react";
import { CircleUserRound, User2 } from "lucide-react";
import { TbMailShare } from "react-icons/tb";
import { useNavigate } from "react-router";
const TopTalents = ({ job }) => {
  const { isLight } = useContext(userContext);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(1);

  const navigate = useNavigate();
  const {
    data: jobTalentData,
    error: jobTalentError,
    isLoading: jobTalentLoading,
    refetch,
  } = useQuery({
    queryKey: ["jobTalent", job, page, rowsPerPage],
    queryFn: async () => {
      const res = await jobTalents(job);
      setTotal(res.count || 0);
      return res.results;
    },
  });

  if (jobTalentLoading) {
    return <Loading minHeight={"30vh"} minWidth={"100%"} />;
  }

  if (jobTalentError) {
    return (
      <div className="no-applicants-message">
        <p>There are no talents for this job.</p>
      </div>
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };
  return (
    <div className="d-flex justify-content-center my-1 flex-column align-items-center p-3">
      <h1 style={{ color: isLight ? "black" : "white" }}>Top Talents</h1>
      <Paper className="applicants-table-paper mt-2">
        <TableContainer>
          <Table
            stickyHeader
            aria-label="applicants table"
            className="recruitment-table"
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: isLight ? "gray" : " black" }}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>ATS Score</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobTalentData?.map((applicant, index) => (
                <TableRow
                  style={{
                    backgroundColor: isLight ? "white" : "rgb(136, 135, 135)",
                  }}
                  key={applicant.id}
                  className={index % 2 === 0 ? "row-even" : "row-odd"}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{applicant.name}</TableCell>
                  <TableCell>{applicant.email}</TableCell>

                  <TableCell>
                    <div className="status-chips">
                      {applicant?.ats_res > 0 && (
                        <Chip
                          label={`${(applicant.ats_res * 100).toFixed(2)}%`}
                          className="status-chip"
                          size="small"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="action-buttons">
                      <a
                        href={`${import.meta.env.VITE_FRONTEND}company/talents/${applicant.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Applicant Profile"
                      >
                        <CircleUserRound
                          style={{ color: "#2f3744" }}
                          className="action-icon"
                          size={25}
                        />
                      </a>
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${applicant.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Send Email"
                      >
                        <TbMailShare
                          style={{ color: "#2f3744" }}
                          className="action-icon"
                          onClick={() => handleNext(applicant.id, phase)}
                          size={25}
                        />
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: isLight ? "rgb(231, 227, 227)" : "rgb(80, 78, 78)",
            ".MuiTablePagination-selectIcon": {
              color: "#2f3744",
            },
            ".MuiTablePagination-actions button": {
              color: "#2f3744",
            },
          }}
        />
      </Paper>
    </div>
  );
};

export default TopTalents;
