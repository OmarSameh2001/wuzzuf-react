import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import {
  FaCalendarPlus,
  FaUserCheck,
  FaUserSlash,
} from "react-icons/fa";
import CompanySchedule from "../Popup/Schedule";
import axios from "axios";
import { userContext } from "../../context/UserContext";
import { useLocation, useParams } from "react-router";

function ApplicantsTable({ phase }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(1);
  const [update, setUpdate] = useState({});
  const { user } = useContext(userContext);
  const { id } = useParams();

  const queryKey = ["applicants", page, rowsPerPage, phase];
  const queryFn = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/applications/`, {
      params: { page, page_size: rowsPerPage, status: phase + 1, company: user?.id },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setTotal(response.data.count || 0);
    return response.data.results;
  };

  const {
    data: applicants,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn,
    onSuccess: () => {
      console.log("Data updated successfully");
    },
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, phase, refetch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  const handleNext = async (applicant, phase) => {
    if (
      !confirm(
        "Are you sure you want to move this applicant to the next phase?"
      )
    ) {
      return;
    }
    if (phase < 5) {
      try {
        await axios.patch(
          `http://localhost:8000/applications/${applicant}/update_status/`,
          { status: String(phase + 2) },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        refetch();
      } catch (error) {
        console.error("Error updating application:", error);
        if (error.response && error.response.status === 500) {
          refetch();
        } else {
          alert("Failed to update application status");
        }
      }
    }
  };

  const handleFail = async (applicant, phase) => {
    if (!confirm("Are you sure you want to make this applicant fail?")) {
      return;
    }
    try {
      await axios.patch(
        `http://localhost:8000/applications/${applicant}/update_status/`,
        { fail: true, status: String(phase + 1) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      refetch();
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const handleClose = () => {
    setUpdate({});
    refetch();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: "#901b20" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {applicants?.length < 1 && (
        <Typography color="error" textAlign="center">
          There are no applicants in the current phase of this job.
        </Typography>
      )}
      
      <Dialog open={Boolean(update.id)} onClose={handleClose}>
        <DialogTitle sx={{ color: "#901b20" }}>
          {Number(phase) === 2 ? "Assessment Link" : "Set Schedule"}
        </DialogTitle>
        <DialogContent>
          <CompanySchedule
            applicant={update}
            phase={phase}
            handleClose={handleClose}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#901b20" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          border: "1px solid rgba(144, 27, 32, 0.2)",
        }}
      >
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {["ID", "Name", "Phone", "Email", "Status", "Action"].map(
                  (header) => (
                    <TableCell
                      key={header}
                      sx={{
                        backgroundColor: "#901b20",
                        color: "#ffffff",
                        fontWeight: "bold",
                      }}
                    >
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {applicants?.map((applicant, index) => (
                <TableRow
                  key={applicant.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f5f5f5",
                    "&:hover": {
                      backgroundColor: "rgba(144, 27, 32, 0.05)",
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{applicant.user_name}</TableCell>
                  <TableCell>{applicant.user_phone}</TableCell>
                  <TableCell>{applicant.user_email}</TableCell>
                  <TableCell>
                    <Chip
                      label={applicant.fail ? "Fail" : "Pending"}
                      color={applicant.fail ? "error" : "default"}
                      sx={{
                        backgroundColor: applicant.fail
                          ? "rgba(255, 0, 0, 0.1)"
                          : "rgba(144, 27, 32, 0.1)",
                        color: applicant.fail ? "#f44336" : "#901b20",
                      }}
                    />
                  </TableCell>
                  <TableCell align="left" sx={{ display: "flex", gap: 2 }}>
                    {!applicant.fail ? (
                      <>
                        <IconButton
                          onClick={() => handleFail(applicant.id, phase)}
                          sx={{ color: "#f44336" }}
                        >
                          <FaUserSlash />
                        </IconButton>
                        {phase !== 5 && (
                          <IconButton
                            onClick={() => handleNext(applicant.id, phase)}
                            sx={{ color: "#4caf50" }}
                          >
                            <FaUserCheck />
                          </IconButton>
                        )}
                      </>
                    ) : (
                      <Typography color="error">Rejected</Typography>
                    )}
                    {(phase === 2 || phase === 3 || phase === 4 || phase === 5) && (
                      <IconButton
                        onClick={() => setUpdate(applicant)}
                        sx={{
                          color:
                            (phase === 2 && applicant.assessment_link) ||
                            (phase === 3 && applicant.interview_link) ||
                            (phase === 4 && applicant.hr_link) ||
                            (phase === 5 && applicant.offer_link)
                              ? "#4caf50"
                              : "#901b20",
                        }}
                      >
                        <FaCalendarPlus />
                      </IconButton>
                    )}
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
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: "#901b20",
              },
          }}
        />
      </Paper>
    </Box>
  );
}

export default ApplicantsTable;