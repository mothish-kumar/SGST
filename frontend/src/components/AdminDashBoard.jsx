import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import axiosInstance from "../Network/axiosInstance";
import "chart.js/auto";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axiosInstance.get("/admin/getDashboardData");
      setDashboardData(res.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" fontWeight="bold" mb={3}>
        Admin Dashboard
      </Typography>

      {/* Dashboard Stats - Force 3 Cards Per Row */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
        }}
      >
        {[
          { label: "Total Clients", value: dashboardData.totalClients },
          { label: "Total Security Guards", value: dashboardData.totalGuards },
          { label: "Total Bookings", value: dashboardData.totalBookings },
          { label: "Ongoing Works", value: dashboardData.ongoingWorks },
          { label: "Pending Payments", value: dashboardData.pendingPayments },
          { label: "Completed Payments", value: dashboardData.completedPayments },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            style={{ flex: "1 1 calc(33.333% - 24px)", minWidth: 300 }}
          >
            <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  {item.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Charts Section - Centered */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, width: 400 }}>
          <CardContent>
            <Typography variant="h6" mb={2} textAlign="center">
              Booking Status
            </Typography>
            <Pie
              data={{
                labels: ["Accepted", "Rejected", "Pending"],
                datasets: [
                  {
                    data: [
                      dashboardData.acceptedBookings,
                      dashboardData.rejectedBookings,
                      dashboardData.pendingBookings,
                    ],
                    backgroundColor: ["#4CAF50", "#F44336", "#FF9800"],
                  },
                ],
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
