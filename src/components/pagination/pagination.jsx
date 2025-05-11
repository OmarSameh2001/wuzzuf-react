import { Pagination, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material"
import "../../ComponentsStyles/pagination/pagination.css"
import { useContext } from "react"
import { userContext } from "../../context/UserContext"
export default function CustomPagination({
  page,
  setPage,
  pageSize,
  setPageSize,
  total,
}) {

  const { isLight } = useContext(userContext)
  const totalPages = Math.ceil(total / pageSize)
  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value)
    setPage(1) // Reset to first page when changing page size
  }

  return (
    <div className={`pagination-container ${isLight ? "light-mode" : "dark-mode"}`}>
      <Box className="pagination-content">
        <Box className="pagination-info">
          <span className="pagination-total">
            {total} {total === 1 ? "item" : "items"}
          </span>
          <span className="pagination-current">
            Page {page} of {totalPages || 1}
          </span>
        </Box>

        <Box className="pagination-controls">
          <Pagination
            count={totalPages || 1}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                color: isLight ? "#4a5568" : "#a0aec0",
                "&.Mui-selected": {
                  backgroundColor: "#e53946",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#d32f2f",
                  },
                },
                "&:hover": {
                  backgroundColor: isLight ? "rgba(229, 57, 70, 0.1)" : "rgba(229, 57, 70, 0.2)",
                },
              },
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: isLight ? "#f8f9fa" : "#2d3748",
                color: isLight ? "#2d3748" : "#e2e8f0",
                "& fieldset": {
                  borderColor: isLight ? "#e6e6e6" : "#4a5568",
                },
                "&:hover fieldset": {
                  borderColor: "#e53946",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#e53946",
                },
              },
              "& .MuiInputLabel-root": {
                color: isLight ? "#4a5568" : "#a0aec0",
                "&.Mui-focused": {
                  color: "#e53946",
                },
              },
              "& .MuiSelect-icon": {
                color: isLight ? "#4a5568" : "#a0aec0",
              },
            }}
          >
            <InputLabel id="page-size-label">Per page</InputLabel>
            <Select
              labelId="page-size-label"
              value={pageSize}
              onChange={handlePageSizeChange}
              label="Per page"
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: isLight ? "#ffffff" : "#1e1e1e",
                    color: isLight ? "#2d3748" : "#e2e8f0",
                    "& .MuiMenuItem-root": {
                      "&:hover": {
                        backgroundColor: isLight ? "rgba(229, 57, 70, 0.1)" : "rgba(229, 57, 70, 0.2)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: isLight ? "rgba(229, 57, 70, 0.1)" : "rgba(229, 57, 70, 0.2)",
                        color: "#e53946",
                        "&:hover": {
                          backgroundColor: isLight ? "rgba(229, 57, 70, 0.2)" : "rgba(229, 57, 70, 0.3)",
                        },
                      },
                    },
                  },
                },
              }}
            >
              {[3, 6, 12, 18].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </div>
  );
}

