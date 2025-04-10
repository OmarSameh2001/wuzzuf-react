import React from "react";
import { Button, Select, MenuItem, FormControl } from "@mui/material";

export default function CustomPagination({
  page,
  setPage,
  pageSize,
  setPageSize,
  total,
}) {
  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "12px", alignItems: "center" }}>
      <Button
        variant="contained"
        disabled={page === 1}
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        sx={{
          backgroundColor: "#901b20",
          "&:hover": {
            backgroundColor: "#7a161b",
          },
          "&:disabled": {
            backgroundColor: "#cccccc",
          }
        }}
      >
        Previous
      </Button>
      
      <FormControl variant="outlined" size="small">
        <Select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#901b20",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#901b20",
            },
            "& .MuiSelect-icon": {
              color: "#901b20",
            },
          }}
        >
          {[10, 20, 30].map((size) => (
            <MenuItem key={size} value={size}>
              {size} per page
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Button
        variant="contained"
        disabled={page * pageSize >= total}
        onClick={() => setPage((prev) => prev + 1)}
        sx={{
          backgroundColor: "#901b20",
          "&:hover": {
            backgroundColor: "#7a161b",
          },
          "&:disabled": {
            backgroundColor: "#cccccc",
          }
        }}
      >
        Next
      </Button>
    </div>
  );
}