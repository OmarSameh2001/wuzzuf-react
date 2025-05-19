import {
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
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import CompanySchedule from "../Popup/Schedule.jsx";
import { userContext } from "../../context/UserContext";
import { useLocation, useNavigate, useParams } from "react-router";
import CustomPopup from "../Popup/CustomPopup";
import {
  UserCheck,
  UserX,
  MessageSquare,
  Calendar,
  ChevronRight,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  showConfirmToast,
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../../confirmAlert/toastConfirm.jsx";
// import '../../styles/theme.css';
import "../../ComponentsStyles/CompanyProcess/application_table.css";
import { preconnect } from "react-dom";
import { set } from "date-fns";
import { TbContract } from "react-icons/tb";
// import {FaUserSlash, FaUserCheck} from 'react-icons/fa';
// import { RiQuestionAnswerFill } from 'react-icons/ri';
// import { FaCalendarPlus } from 'react-icons/fa';

function ApplicantsTable({ phase, setFilters, fetch, job }) {
  const { isLight } = useContext(userContext);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(1);

  const [selected, setSelected] = useState([]);
  const [answer, setAnswer] = useState(false);
  const [success, setSuccess] = useState(true);
  const { user, update, setUpdate } = useContext(userContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const isScreening = job?.questions?.find((q) => q.type === "video")

  const queryKey = ["applicants", page, rowsPerPage, phase, fetch, success];
  const queryFn = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/applications/`, {
      params: { page, page_size: rowsPerPage, status: phase + 1, job: id, fail: success ? 'False' : '' }, //, company: 3
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setTotal(response.data.count || 0);
    setFilters(response.data.count ? true : false);
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
      // Clear selection when data changes
      setSelected([]);
    },
  });
  const handleOpen = (user) => {
    setUpdate((prev) => ({
      ...prev,
      user,
    }));
  };

  // useEffect(() => {
  //   refetch();
  // }, [page, rowsPerPage, phase, refetch]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = applicants
        .filter((app) => app.fail === false)
        .map((app) => app.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (event, id) => {
    if (event.target.checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((item) => item !== id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selected.length === 0) {
      showErrorToast("Please select at least one applicant", 2000, isLight);
      return;
    }

    let confirmMessage = "";
    let endpoint = "";
    let data = {};

    if (action === "next") {
      if (phase >= 5) {
        showErrorToast("Cannot move beyond Offer phase", 1000, isLight);
        return;
      }
      confirmMessage = `Move ${selected.length} applicant(s) to next phase?`;
      endpoint = "update_status";
      data = { status: String(phase + 2) };
    } else if (action === "reject") {
      confirmMessage = `Reject ${selected.length} applicant(s)?`;
      endpoint = "update_status";
      data = { fail: true, status: String(phase + 1) };
    }

    // if (window.confirm(confirmMessage)) {
    showConfirmToast({
      message: confirmMessage,
      onConfirm: async () => {
        try {
          // Perform bulk update
          const promises = selected.map((applicantId) =>
            axios.patch(
              `${import.meta.env.VITE_BACKEND}applications/${applicantId}/${endpoint}/`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
              }
            )
          );

          await Promise.all(promises);
          refetch();
          showSuccessToast(
            `Applicants ${
              action === "next" ? "moved" : "rejected"
            } successfully`,
            2000,
            isLight
          );
          setSelected([]);
        } catch (error) {
          console.error("Error updating applications:", error);
          showErrorToast(
            `Failed to ${action === "next" ? "move" : "reject"} applicants`,
            2000,
            isLight
          );
        }
      },
      isLight: isLight,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  // Modern color palette
  const colors = {
    light: {
      background: "#ffffff",
      cardBg: "#ffffff",
      sectionBg: "#f8f9fa",
      text: "#333333",
      accent: "#e63946", // Modern red
      accentHover: "#d62b3a",
      secondary: "#457b9d", // Blue accent
      muted: "#6c757d",
      border: "#dee2e6",
    },
    dark: {
      background: "#121212",
      cardBg: "#1e1e1e",
      sectionBg: "#242424",
      text: "#f8f9fa",
      accent: "#e63946", // Same red accent for consistency
      accentHover: "#f25d69",
      secondary: "#64b5f6", // Lighter blue for dark mode
      muted: "#adb5bd",
      border: "#343a40",
    },
  };

  // Get current theme colors
  const theme = isLight ? colors.light : colors.dark;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  const handleNext = async (applicant, phase) => {
    showConfirmToast({
      message:
        "Are you sure you want to move this applicant to the next phase?",
      onConfirm: async () => {
        if (phase < 6) {
          try {
            const response = await axios.patch(
              `${import.meta.env.VITE_BACKEND}applications/${applicant}/update_status/`,
              { status: String(phase + 2) },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
              }
            );
            refetch();
            showSuccessToast("Applicant moved to next phase", 2000, isLight);
          } catch (error) {
            console.error("Error:", error);
            showErrorToast("Failed to update application status", 2000, isLight);
          }
        }
      },
      isLight: isLight,
    });
  };
  const handleFail = async (applicant, phase) => {
    // if (!confirm("Are you sure you want to make this applicant fail?")) {
    //   return;
    // }
    showConfirmToast({
      message: "Are you sure you want to make this applicant fail?",
      onConfirm: async () => {
        try {
          const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND}applications/${applicant}/update_status/`,
            { fail: true, status: String(phase + 1) },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          refetch();
          showSuccessToast("Applicant marked as failed", 2000, isLight);
        } catch (error) {
          console.error("Error:", error);
          showErrorToast("Failed to mark applicant as failed", 2000, isLight);
        }
      },
      isLight: isLight,
    });
  };

  function handleAnswer(applicant) {
    if (applicant?.answers && applicant?.answers.length > 0) {
      setAnswer(true);
      setUpdate({ user: applicant, settings: {answer:true, phase, handleNext, handleFail} });
    } else {
      showInfoToast("No answers found for this applicant.", 2000, isLight);
    }
  }

  function handleClose() {
    setAnswer(false);
    setUpdate({
      user: {},
      settings: {},
    });
    refetch();
  }

  if (isLoading) {
    return <CircularProgress style={{ display: "block", margin: "auto" }} />;
  }
  
  return (
    <div
      className="applicants-table-container"
      style={{ backgroundColor: theme.background }}
    >
      
      <Checkbox
        checked={success || false}
        onChange={() => setSuccess(!success)}
        sx={{
          color: "#d43132",
          "&.Mui-checked": {
            color: "#d43132",
          },
        }}
      />
      <label className="checkbox-label" onClick={() => setSuccess(!success)} style={{cursor:'pointer'}}>Non failed applicants only</label>
      {applicants?.length < 1 && (
        <div className="no-applicants-message">
          <p>There are no applicants in the current phase of this job.</p>
        </div>
      )}

      {selected.length > 0 && (
        <Box className="bulk-actions-container">
          <Button
            variant="contained"
            className="btn-next"
            onClick={() => handleBulkAction("next")}
            disabled={phase >= 5}
            startIcon={<ChevronRight />}
            sx={{
              backgroundColor: "#901b21",
              "&:hover": {
                backgroundColor: "#8c364bl",
              },
              "&:disabled": {
                backgroundColor: "#e9d8d9",
              },
            }}
          >
            Move {selected.length} to Next Phase
          </Button>
          <Button
            variant="contained"
            className="btn-reject"
            onClick={() => handleBulkAction("reject")}
            startIcon={<X />}
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#ef5350",
              },
            }}
          >
            Reject {selected.length} Applicants
          </Button>
        </Box>
      )}

      <Paper className="applicants-table-paper">
        <TableContainer>
          <Table
            stickyHeader
            aria-label="applicants table"
            className="recruitment-table"
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: isLight ? "gray" : " black" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < applicants?.length
                    }
                    checked={
                      applicants?.length > 0 &&
                      selected.length === applicants?.length - applicants.filter((item) => item.fail === true).length && selected.length > 0
                    }
                    onChange={handleSelectAll}
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                      "&.MuiCheckbox-indeterminate": {
                        color: "white",
                      },
                    }}
                    
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>ATS{isScreening && ' and Screening'}</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applicants?.map((applicant, index) => (
                <TableRow
                  style={{
                    backgroundColor: isLight ? "white" : "rgb(136, 135, 135)",
                  }}
                  key={applicant.id}
                  // className={index % 2 === 0 ? "row-even" : "row-odd"}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(applicant.id)}
                      onChange={(event) => handleSelect(event, applicant.id)}
                      sx={{
                        color: "#2f3744",
                        "&.Mui-checked": {
                          color: "#2f3744",
                        },
                      }}
                      disabled={applicant.fail}
                    />
                  </TableCell>
                  <TableCell style={{cursor: "pointer"}} onClick={() => navigate(`/company/talents/${applicant.id}`)}>{index + 1}</TableCell>
                  <TableCell style={{cursor: "pointer"}} onClick={() => navigate(`/company/talents/${applicant.id}`)}>{applicant.user_name}</TableCell>
                  <TableCell>{applicant.user_phone}</TableCell>
                  <TableCell>{applicant.user_email}</TableCell>

                  <TableCell>
                    <div className="status-chips">
                      {applicant?.fail && <Chip
                        label={applicant.fail ? "Failed" : "Pending"}
                        className={`status-chip ${
                          applicant.fail
                            ? "status-chip-error"
                            : "status-chip-success"
                        }`}
                        size="small"
                      />}
                      {applicant?.ats_res > 0 && (
                        <Chip
                          label={`${applicant.ats_res}%`}
                          className="status-chip "
                          size="small"
                        />
                      )}
                      {isScreening && applicant?.screening_res > 0 && (
                        <Chip
                          label={`${applicant.screening_res}%`}
                          className="status-chip "
                          size="small"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="action-buttons">
                      {!applicant.fail ? (
                        <>
                          <UserX
                            className="action-icon action-icon-error"
                            onClick={() => handleFail(applicant.id, phase)}
                            size={20}
                          />
                          {phase !== 6 && (
                            <UserCheck
                              className="action-icon action-icon-success"
                              onClick={() => handleNext(applicant.id, phase)}
                              size={20}
                            />
                          )}
                          {applicant.answers &&
                            applicant.answers.length > 0 && phase === 1 && (
                              <MessageSquare
                                className="action-icon action-icon-primary"
                                onClick={() => handleAnswer(applicant)}
                                size={20}
                              />
                            )}
                        </>
                      ) : (
                        <span className="rejected-text">Rejected</span>
                      )}
                      {!applicant.fail && (Number(phase) === 2 ||
                        Number(phase) === 3 ||
                        Number(phase) === 4 ||
                        Number(phase) === 5) && (
                        <Calendar
                          className={`action-icon ${
                            (Number(phase) === 2 &&
                              applicant.assessment_link) ||
                            (Number(phase) === 3 && applicant.interview_link) ||
                            (Number(phase) === 4 && applicant.hr_link) ||
                            (Number(phase) === 5 && applicant.offer_link)
                              ? "action-icon-success"
                              : "action-icon-secondary"
                          }`}
                          // onClick={() => setUpdate(applicant)}
                          onClick={() => {
                            setUpdate({
                              user: applicant,
                              settings: {
                                answer,
                                phase,
                                handleClose,
                                handleNext,
                                handleFail,
                              },
                            });
                          }}
                          size={20}
                        />
                      )}
                      {!applicant.fail && phase === 6 && (
                        <TbContract
                          className="action-icon action-icon-secondary"
                          color={applicant?.salary ? "green" : "gray"}
                          onClick={() => {
                            setUpdate({
                              user: applicant,
                              settings: {
                                contract: true,
                                phase,
                                handleClose,
                                handleNext,
                                handleFail,
                              },
                            });
                          }}
                          size={25}
                        />
                      )}
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
}

export default ApplicantsTable;
