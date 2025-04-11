// import {
//   Chip,
//   CircularProgress,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
// } from "@mui/material";
// import { useQuery } from "@tanstack/react-query";
// import { useContext, useEffect, useState } from "react";
// import {
//   FaCalendarPlus,
//   FaPencilAlt,
//   FaUserCheck,
//   FaUserSlash,
// } from "react-icons/fa";
// import { GiCancel } from "react-icons/gi";
// import CompanySchedule from "../Popup/Schedule";
// //   import axiosInstance from "../../../apis/config";
// import axios from "axios";
// import { userContext } from "../../context/UserContext";

// function ApplicantsTable({ phase }) {
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [total, setTotal] = useState(1);
//   const [update, setUpdate] = useState({});
//   const { user } = useContext(userContext);

//   const queryKey = ["applicants", page, rowsPerPage, phase];
//   const queryFn = async () => {
//     const response = await axios.get(`http://127.0.0.1:8000/applications/`, {
//       params: { page, page_size: rowsPerPage, status: phase + 1, company: user?.id }, //, company: 3
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     setTotal(response.data.count || 0);
//     return response.data.results;
//   };

//   const {
//     data: applicants,
//     error,
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey,
//     queryFn,
//     onSuccess: () => {
//       console.log("Data updated successfully");
//     },
//   });

//   useEffect(() => {
//     refetch();
//   }, [page, rowsPerPage, phase, refetch]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage + 1);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(event.target.value);
//   };
//   const handleNext = async (applicant, phase) => {
//     if (phase < 5) {
//       try {
//         const response = await axios.patch(
//           // `http://localhost:8000/applications/${applicant}/`,
//           `http://localhost:8000/applications/${applicant}/update_status/`,
//           { status: String(phase + 2) },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         // console.log(applicant, "Added to phase", phase);
//         // console.log(response);
//         refetch();
//         // alert('Applicant moved to next phase successfully');
//       } catch (error) {
//         console.error("Error updating application:", error);
//         if (error.response && error.response.status === 500) {
//           refetch();
//         } else {
//           alert("Failed to update application status");
//         }
//       }
//     }
//   };

//   const handleFail = async (applicant, phase) => {
//     try {
//       const response = await axios.patch(
//         // `http://localhost:8000/applications/${applicant}/`,
//         `http://localhost:8000/applications/${applicant}/update_status/`,
//         { fail: true, status: String(phase + 1) },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       // console.log(applicant, "Failed at phase", phase);
//       // console.log(response);
//       refetch();
//     } catch (error) {
//       console.error("Error updating application:", error);
//     }
//   };

//   function handleClose() {
//     setUpdate({});
//     refetch();
//   }

//   const PopupPicker = () => {
//     if (!update.id) return null;

//     return (
//       <CompanySchedule
//         applicant={update}
//         phase={phase}
//         handleClose={handleClose}
//       />
//     );
//   };

//   if (isLoading) {
//     return <CircularProgress style={{ display: "block", margin: "auto" }} />;
//   }

//   return (
//     <div
//       className="d-flex flex-column align-items-center justify-content-center"
//       style={{ maxWidth: "inherit" }}
//     >
      
//       {applicants?.length < 1 && <p style={{color:'red'}}>There are no applicants in the current phase of this job.</p>}
//       {update.id ? (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//           style={{ zIndex: 99 }}
//         >
//           <div
//             className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"
//             style={{ backdropFilter: "blur(10px)" }}
//           ></div>
//           <div
//             className="position-relative bg-white p-4 rounded-4 shadow-lg"
//             style={{
//               width: "400px",
//               maxHeight: "80vh",
//               overflowY: "auto",
//               backdropFilter: "blur(5px)",
//             }}
//           >
//             <h2 className="text-center mb-3">
//               {Number(phase) === 2 ? "Assessment Link" : "Set Schedule"}
//             </h2>
//             <GiCancel
//               style={{
//                 position: "absolute",
//                 top: 20,
//                 right: 20,
//                 scale: 2,
//                 cursor: "pointer",
//                 color: "red",
//               }}
//               onClick={handleClose}
//             />
//             <PopupPicker />
//           </div>
//         </div>
//       ) : null}
//       <Paper
//         sx={{
//           width: "90%",
//           overflow: "hidden",
//           marginX: 10,
//           maxWidth: "100vw",
//         }}
//       >
//         <TableContainer>
//           <Table stickyHeader aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 <TableCell
//                   style={{
//                     backgroundColor: "black",
//                     color: "#ffffff",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   ID
//                 </TableCell>
//                 <TableCell
//                   style={{
//                     backgroundColor: "black",
//                     color: "#ffffff",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Name
//                 </TableCell>
//                 <TableCell
//                   style={{
//                     backgroundColor: "black",
//                     color: "#ffffff",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Phone
//                 </TableCell>
//                 <TableCell
//                   style={{
//                     backgroundColor: "black",
//                     color: "#ffffff",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Email
//                 </TableCell>
//                 <TableCell
//                   style={{
//                     backgroundColor: "black",
//                     color: "#ffffff",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Status
//                 </TableCell>
//                 <TableCell
//                   style={{
//                     backgroundColor: "black",
//                     color: "#ffffff",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Action
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {applicants.map((applicant, index) => (
//                 <TableRow
//                   key={applicant.id}
//                   style={{
//                     backgroundColor: index % 2 === 0 ? "#ffffff" : "#ececec",
//                   }}
//                 >
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{applicant.user_name}</TableCell>
//                   <TableCell>{applicant.user_phone}</TableCell>
//                   <TableCell>{applicant.user_email}</TableCell>

//                   <TableCell>
//                     <Chip
//                       color={applicant.fail ? "error" : "success"}
//                       label={applicant.fail ? "Fail" : "Pending"}
//                       size="small"
//                       variant="light"
//                     />
//                   </TableCell>
//                   <TableCell align="left">
//                     {!applicant.fail ? (
//                       <>
//                         <FaUserSlash
//                           style={{
//                             cursor: "pointer",
//                             scale: 1.5,
//                             display: applicant.fail ? "none" : "initial",
//                             color: "red",
//                           }}
//                           onClick={() => handleFail(applicant.id, phase)}
//                         />
//                         <FaUserCheck
//                           style={{
//                             cursor: "pointer",
//                             scale: 1.5,
//                             marginLeft: "20px",
//                             display: phase === 5 ? "none" : "initial",
//                           }}
//                           onClick={() => handleNext(applicant.id, phase)}
//                         />
//                       </>
//                     ) : (
//                       <span>Rejected</span>
//                     )}
//                     <FaCalendarPlus
//                       style={{
//                         cursor: "pointer",
//                         scale: 1.5,
//                         marginLeft: "20px",
//                         display:
//                           Number(phase) === 2 ||
//                           Number(phase) === 3 ||
//                           Number(phase) === 4 ||
//                           Number(phase) === 5
//                             ? "inline-block"
//                             : "none",
//                         color:
//                           (Number(phase) === 2 && applicant.assessment_link) ||
//                           (Number(phase) === 3 && applicant.interview_link) ||
//                           (Number(phase) === 4 && applicant.hr_link) ||
//                           (Number(phase) === 5 && applicant.offer_link)
//                             ? "green"
//                             : "black",
//                       }}
//                       onClick={() => setUpdate(applicant)}
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25, 100]}
//           component="div"
//           count={total}
//           rowsPerPage={rowsPerPage}
//           page={page - 1}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//     </div>
//   );
// }

// export default ApplicantsTable;


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
import {
  FaCalendarPlus,
  FaPencilAlt,
  FaUserCheck,
  FaUserSlash,
} from "react-icons/fa";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { GiCancel } from "react-icons/gi";
import CompanySchedule from "../Popup/Schedule";
import axios from "axios";
import { userContext } from "../../context/UserContext";
import { useLocation, useParams } from "react-router";

function ApplicantsTable({ phase }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(1);
  const [update, setUpdate] = useState({});
  const [selected, setSelected] = useState([]);
  const { user } = useContext(userContext);
  const { id } = useParams();

  const queryKey = ["applicants", page, rowsPerPage, phase];
  const queryFn = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/applications/`, {
      params: { page, page_size: rowsPerPage, status: phase + 1, job: id }, //, company: 3
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
      // Clear selection when data changes
      setSelected([]);
    },
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, phase, refetch]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = applicants.map((app) => app.id);
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
      alert("Please select at least one applicant");
      return;
    }

    let confirmMessage = "";
    let endpoint = "";
    let data = {};

    if (action === "next") {
      if (phase >= 5) {
        alert("Cannot move beyond Offer phase");
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

    if (window.confirm(confirmMessage)) {
      try {
        // Perform bulk update
        const promises = selected.map(applicantId =>
          axios.patch(
            `http://localhost:8000/applications/${applicantId}/${endpoint}/`,
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
        alert(`Applicants ${action === "next" ? "moved" : "rejected"} successfully`);
      } catch (error) {
        console.error("Error updating applications:", error);
        alert(`Failed to ${action === "next" ? "move" : "reject"} applicants`);
      }
    }
  };

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
        const response = await axios.patch(
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
      const response = await axios.patch(
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

  function handleClose() {
    setUpdate({});
    refetch();
  }

  const PopupPicker = () => {
    if (!update.id) return null;

    return (
      <CompanySchedule
        applicant={update}
        phase={phase}
        handleClose={handleClose}
      />
    );
  };

  if (isLoading) {
    return <CircularProgress style={{ display: "block", margin: "auto" }} />;
  }

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ maxWidth: "inherit" }}
    >
      {applicants?.length < 1 && (
        <p style={{ color: "red" }}>
          There are no applicants in the current phase of this job.
        </p>
      )}
      {update.id ? (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 99 }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"
            style={{ backdropFilter: "blur(10px)" }}
          ></div>
          <div
            className="position-relative bg-white p-4 rounded-4 shadow-lg"
            style={{
              width: "400px",
              maxHeight: "80vh",
              overflowY: "auto",
              backdropFilter: "blur(5px)",
            }}
          >
            <h2 className="text-center mb-3">
              {Number(phase) === 2 ? "Assessment Link" : "Set Schedule"}
            </h2>
            <GiCancel
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                scale: 2,
                cursor: "pointer",
                color: "red",
              }}
              onClick={handleClose}
            />
            <PopupPicker />
          </div>
        </div>
      ) : null}

      {/* Bulk action buttons */}
      {selected.length > 0 && (
        <Box sx={{ width: "90%", mb: 2, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleBulkAction("next")}
            disabled={phase >= 5}
          >
            Move {selected.length} to Next Phase
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleBulkAction("reject")}
          >
            Reject {selected.length} Applicants
          </Button>
        </Box>
      )}

      <Paper
        sx={{
          width: "90%",
          overflow: "hidden",
          marginX: 10,
          maxWidth: "100vw",
        }}
      >
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < applicants?.length}
                    checked={applicants?.length > 0 && selected.length === applicants?.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "black",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "black",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "black",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  Phone
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "black",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "black",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  Status & ATS
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "black",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applicants?.map((applicant, index) => (
                <TableRow
                  key={applicant.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#ececec",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(applicant.id)}
                      onChange={(event) => handleSelect(event, applicant.id)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{applicant.user_name}</TableCell>
                  <TableCell>{applicant.user_phone}</TableCell>
                  <TableCell>{applicant.user_email}</TableCell>

                  <TableCell>
                    <Chip
                      color={applicant.fail ? "error" : "success"}
                      label={applicant.fail ? "Fail" : "Pending"}
                      size="small"
                      variant="light"
                    />
                    {applicant?.ats_res > 0 && (
                      <Chip
                        color={"primary"}
                        label={applicant.ats_res + "%"}
                        size="small"
                        variant="light"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {!applicant.fail ? (
                      <>
                        <FaUserSlash
                          style={{
                            cursor: "pointer",
                            scale: 1.5,
                            display: applicant.fail ? "none" : "initial",
                            color: "red",
                          }}
                          onClick={() => handleFail(applicant.id, phase)}
                        />
                        <FaUserCheck
                          style={{
                            cursor: "pointer",
                            scale: 1.5,
                            marginLeft: "20px",
                            display: phase === 5 ? "none" : "initial",
                          }}
                          onClick={() => handleNext(applicant.id, phase)}
                        />

                        <RiQuestionAnswerFill
                          style={{
                            cursor: "pointer",
                            scale: 1.5,
                            marginLeft: "20px",
                            display: applicant.answers && applicant.answers.length > 0 ? "intial" : "none",
                            // color: "red",
                          }}
                          onClick={() => handleFail(applicant.id, phase)}
                        />
                      </>
                    ) : (
                      <span>Rejected</span>
                    )}
                    <FaCalendarPlus
                      style={{
                        cursor: "pointer",
                        scale: 1.5,
                        marginLeft: "20px",
                        display:
                          Number(phase) === 2 ||
                          Number(phase) === 3 ||
                          Number(phase) === 4 ||
                          Number(phase) === 5
                            ? "inline-block"
                            : "none",
                        color:
                          (Number(phase) === 2 && applicant.assessment_link) ||
                          (Number(phase) === 3 && applicant.interview_link) ||
                          (Number(phase) === 4 && applicant.hr_link) ||
                          (Number(phase) === 5 && applicant.offer_link)
                            ? "green"
                            : "black",
                      }}
                      onClick={() => setUpdate(applicant)}
                    />
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
        />
      </Paper>
    </div>
  );
}

export default ApplicantsTable;