import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Paper,
} from "@mui/material";
import axiosInstance from "../Network/axiosInstance";
import { toast } from "sonner";
import DataTable from "../components/DataTable";

const SecurityGuardPage = () => {
  const [shiftStatus, setShiftStatus] = useState("Pending");
  const [guardData, setGuardData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [guardProfile, setGuardProfile] = useState(null);
  const id = localStorage.getItem("guardId");

  useEffect(() => {
    fetchGuardData(shiftStatus);
    fetchGuardProfile();
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

  const fetchGuardProfile = async () => {
    try {
      const res = await axiosInstance.get(`/admin/getGuard/${id}`);
      setGuardProfile(res.data);
    } catch (error) {
      toast.error("Failed to fetch Guard Profile");
    }
  };

  return (
    <Box sx={{ p: 3, marginTop: "100px" }}>
      {/* Top Bar with Profile */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        {/* Title */}
        <Typography variant="h3" fontWeight="bold">
          Security Guard Shifts
        </Typography>

        {/* Profile Section */}
        {guardProfile && (
          <Tooltip
            title={
              <Paper sx={{ p: 2 }}>
                <Typography variant="body1">
                  <strong>Total Earnings:</strong> ${guardProfile.payment_details.total_earnings}
                </Typography>
                <Typography variant="body1">
                  <strong>Last Payment Date:</strong>{" "}
                  {guardProfile.payment_details.last_payment_date
                    ? new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(guardProfile.payment_details.last_payment_date))
                    : "N/A"}
                </Typography>
              </Paper>
            }
            placement="bottom-start"
            arrow
          >
            <Box 
              display="flex" 
              alignItems="center" 
              gap={2} 
              sx={{ 
                background: 'linear-gradient(75deg, rgb(4, 11, 78)30%, rgb(0, 59, 252)90%)', 
                px:3,
                py:0.5,
                borderRadius: 5
              }}
            >
              <Avatar
                src={`http://localhost:5000/uploads/profile_photos/${guardProfile.profile_photo}`} 
                alt={guardProfile.name}
                sx={{ width: 56, height: 56 }}
              />
              <Typography variant="h6" fontWeight="bold" sx={{color:'white'}}>
                {guardProfile.name}
              </Typography>
            </Box>
          </Tooltip>
        )}
      </Box>

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
        <DataTable data={guardData} fetchData={fetchGuardData} />
      ) : (
        <Typography variant="h5" textAlign="center">
          No data available for {shiftStatus} shifts
        </Typography>
      )}
    </Box>
  );
};

export default SecurityGuardPage;