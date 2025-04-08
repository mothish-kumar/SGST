import React, { useEffect, useState } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import axiosInstance from "../Network/axiosInstance";
import { toast } from "sonner";
import DataTable from "../components/DataTable";

const SecurityGuardPage = () => {
  const [shiftStatus, setShiftStatus] = useState("Pending");
  const [guardData, setGuardData] = useState([]);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    fetchGuardData(shiftStatus);
  }, [shiftStatus]);

  const fetchGuardData = async (status) => {
    setNoData(false); // Reset before fetching
    setGuardData([]); // Clear old data

    try {
      const res = await axiosInstance.get(`/guard/assignedWork?status=${status}`);

      if (res.data.length === 0) {
        setNoData(true);
      } else {
        setGuardData(res.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setNoData(true);
      } else {
        toast.error("Failed to fetch data");
      }
    }
  };

  return (
    <Box sx={{ p: 3, marginTop: "100px" }}>
      {/* Title */}
      <Typography variant="h3" fontWeight="bold" mb={2}>
        Security Guard Shifts
      </Typography>

      {/* Filter Dropdown */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Typography variant="body1">Filter by Shift Status:</Typography>
        <Select
          value={shiftStatus}
          onChange={(e) => setShiftStatus(e.target.value)}
          sx={{ minWidth: 200, color: "var(--text-color)" }}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Ongoing">Ongoing</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </Box>

      {/* Data Table or No Data Message */}
      {!noData ? (
        <DataTable data={guardData} />
      ) : (
        <Typography variant="h5" textAlign="center">
          No data available for {shiftStatus} shifts
        </Typography>
      )}
    </Box>
  );
};

export default SecurityGuardPage;
