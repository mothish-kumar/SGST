import { useState, useEffect } from "react";
import { Box, Button, Tab, Tabs, Modal, Typography,Divider,Grid,Card,CardContent ,CardHeader,Checkbox, FormControlLabel,Avatar} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import axiosInstance from '../Network/axiosInstance.js'
import { Close, Info } from "@mui/icons-material";
import {toast} from 'sonner'
import { CircularProgress } from "@mui/material";


const Bookings = () => {
  const [status, setStatus] = useState("Pending");
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [guards, setGuards] = useState([]);
  const [openGuardModal, setOpenGuardModal] = useState(false);
  const [selectedGuards, setSelectedGuards] = useState([]);
  const [loading,setLoading] = useState(false)
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
const [guardDetails, setGuardDetails] = useState(null);
const [loadingGuard, setLoadingGuard] = useState(false);
const [openViewModal,setOpenViewModal] = useState(false)

  useEffect(() => {
    fetchBookings();
  }, [status]);

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get(`/admin/bookings?status=${status}`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    }
  };

  const handleOpen = (booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooking(null);
  };

  const fetchGuards = async () => {
    try {
      const response = await axiosInstance.get("/admin/getGuards?status=Approved");
      setGuards(response.data);
    } catch (error) {
      console.error("Error fetching guards", error);
    }
  };
  const handleAcceptBooking = () => {
    fetchGuards();
    setOpenGuardModal(true);

  };
  const handleGuardSelection = (guardId) => {
    setSelectedGuards((prev) =>
      prev.includes(guardId) ? prev.filter((id) => id !== guardId) : [...prev, guardId]
    );
  };
  const submitGuardSelection = async () => {
    if (selectedGuards.length === 0) {
      toast.error("Please select at least one guard.");
      return;
    }
    setLoading(true)
    try {
      await axiosInstance.post(`/admin/acceptBooking/${selectedBooking._id}`, { guardIds: selectedGuards });
      toast.success("Booking accepted successfully!");
      setOpenGuardModal(false);
      setOpen(false);
      fetchBookings();
    } catch (error) {
      console.error("Error accepting booking", error);
    }finally{
      setLoading(false)
    }
  };

  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
  
    setLoading(true);
    try {
      await axiosInstance.post(`/admin/rejectBooking/${selectedBooking._id}`, {
        reason: rejectReason,
      });
  
      toast.success("Booking rejected successfully!");
      setOpenRejectModal(false);
      setOpen(false);
      fetchBookings(); 
    } catch (error) {
      console.error("Error rejecting booking", error);
      toast.error("Failed to reject booking.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGuardDetails = async () => {
    console.log(selectedBooking)
    if (!selectedBooking.assigned_guard_id || selectedBooking.assigned_guard_id.length === 0) {
      toast.error("No guard assigned to this booking.");
      return;
    }
  
    const guardIds = selectedBooking.assigned_guard_id; 
  
    setLoadingGuard(true);
    try {
      const guardDetailsList = await Promise.all(
        guardIds.map(async (guardId) => {
          const { data } = await axiosInstance.get(`/admin/getGuard/${guardId}`);
          return data;
        })
      );
  
      setGuardDetails(guardDetailsList); 
      setOpenViewModal(true);
    } catch (error) {
      console.error("Error fetching guard details", error);
      toast.error("Failed to fetch guard details.");
    } finally {
      setLoadingGuard(false);
    }
  };
  
  

  const columns = [
    { field: "name", headerName: "Name", flex: 1,renderCell:(params)=>(<Typography sx={{color:'var(--text-color)',marginTop:'15px'}}>{params.value}</Typography>)  },
    { field: "phone", headerName: "Phone", flex: 1,renderCell:(params)=>(<Typography sx={{color:'var(--text-color)',marginTop:'15px'}}>{params.value}</Typography>)  },
    { field: "shift", headerName: "Shift", flex: 1,renderCell:(params)=>(<Typography sx={{color:'var(--text-color)',marginTop:'15px'}}>{params.value}</Typography>)  },
    { field: "status", headerName: "Status", flex: 1,renderCell:(params)=>(<Typography sx={{color:'var(--text-color)',marginTop:'15px'}}>{params.value}</Typography>)  },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <motion.div whileHover={{ scale: 1.1 }}>
          <Button variant="contained" size="small" onClick={() => handleOpen(params.row)}>
            View Details
          </Button>
        </motion.div>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Tabs value={status} onChange={(e, newValue) => setStatus(newValue)}>
        <Tab label="Pending" value="Pending" sx={{color:'var(--text-color)'}} />
        <Tab label="Accepted" value="Accepted" sx={{color:'var(--text-color)'}}  />
        <Tab label="Rejected" value="Rejected" sx={{color:'var(--text-color)'}} />
      </Tabs>
      <Box sx={{  mt: 2 }}>
        <DataGrid rows={bookings} columns={columns} getRowId={(row) => row._id}  disablePagination pagination = {false} hideFooter autoHeight />
      </Box>
        <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 3,
          bgcolor: "var(--background-color)",
          width: "90%",  
          maxWidth: 500, 
          mx: "auto",
          mt: 5,
          borderRadius: 3,
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
          outline: "none",
          maxHeight: "80vh",  
          overflowY: "auto",  
        }}
      >
        {selectedBooking && (
          <>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "var(--text-color)", display: "flex", alignItems: "center" }}>
                <Info sx={{ mr: 1, fontSize: "22px" }} /> Booking Details
              </Typography>
              <Button onClick={handleClose} sx={{ minWidth: "30px", padding: 0 }}>
                <Close fontSize="small" />
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Scrollable Details Section */}
            <Grid container spacing={1.5}>
              {Object.entries(selectedBooking).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Card 
                    sx={{ 
                      backgroundColor: "var(--card-bg)", 
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", 
                      borderRadius: 2,
                      minWidth: 180,
                    }}
                  >
                    <CardHeader
                      title={key.replace(/_/g, " ").toUpperCase()}
                      sx={{
                        backgroundColor: "var(--primary-color)",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        textAlign: "center",
                        py: 0.8,
                        paddingX: 1,
                      }}
                    />
                    <CardContent sx={{ py: 1, textAlign: "center" }}>
                      <Typography variant="body2" sx={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        {String(value)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {status === "Pending" && (
                <>
                  <Divider sx={{ mt: 2, mb: 2 }} />
                  <Box display="flex" justifyContent="center" gap={3}>
                    <Button onClick={handleAcceptBooking}  variant="contained" color="success" sx={{ borderRadius: 2, px: 4, fontSize: "0.875rem" }}>
                      Accept Booking
                    </Button>
                    <Button  onClick={() => setOpenRejectModal(true)}  variant="contained" sx={{ borderRadius: 2, px: 4, fontSize: "0.875rem", backgroundColor:'red' }}>
                      Reject Booking
                    </Button>
                  </Box>
                </>
              )}
              {status === "Accepted" &&(
                <>
                <Divider sx={{ mt: 2, mb: 2 }} />
                  <Box display="flex" justifyContent="center">
                    <Button onClick={fetchGuardDetails}   variant="contained" color="warning" sx={{ borderRadius: 2, px: 4, fontSize: "0.875rem" }}>
                      View Guard 
                    </Button>
                  </Box>
                </>
              )}
          </>
        )}
      </Box>  
    </Modal>
      {/* Guard Selection Modal */}
      <Modal open={openGuardModal} onClose={() => setOpenGuardModal(false)}>
        <Box sx={{ p: 3, bgcolor: "white", width: "90%", maxWidth: 500, mx: "auto", mt: 5, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold">Select Guards</Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={1.5}>
            {guards.map((guard) => (
              <Grid item xs={12} key={guard._id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedGuards.includes(guard._id)}
                      onChange={() => handleGuardSelection(guard._id)}
                    />
                  }
                  label={`${guard.name} - ${guard.phone}`}
                />
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" gap={3} mt={2}>
          <Button 
              variant="contained" 
              color="primary" 
              onClick={submitGuardSelection} 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Confirm Selection"}
            </Button>
            <Button variant="contained" onClick={() => setOpenGuardModal(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Rejection Modal */}
      <Modal open={openRejectModal} onClose={() => setOpenRejectModal(false)}>
  <Box sx={{ p: 3, bgcolor: "white", width: "90%", maxWidth: 500, mx: "auto", mt: 5, borderRadius: 3 }}>
    <Typography variant="h6" fontWeight="bold">Reject Booking</Typography>
    <Divider sx={{ my: 2 }} />
    
    <Typography variant="body2" sx={{ mb: 1 }}>Enter the reason for rejection:</Typography>
    <textarea
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
      rows={3}
      style={{
        width: "100%",
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid gray",
        fontSize: "0.9rem",
      }}
    />

    <Box display="flex" justifyContent="center" gap={3} mt={2}>
      <Button 
        variant="contained" 
        color="error" 
        onClick={submitRejection}
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Confirm Rejection"}
      </Button>
      <Button variant="contained" onClick={() => setOpenRejectModal(false)}>
        Cancel
      </Button>
    </Box>
  </Box>
</Modal>
{/* View button Modal */}
<Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
  <Box sx={{ p: 3, bgcolor: "white", width: "90%", maxWidth: 700, mx: "auto", mt: 5, borderRadius: 3 }}>
    <Typography variant="h6" fontWeight="bold">Assigned Guards</Typography>
    <Divider sx={{ my: 2 }} />

    {loadingGuard ? (
      <CircularProgress size={30} />
    ) : guardDetails && guardDetails.length > 0 ? (
      <Box>
        {guardDetails.map((guard, index) => (
          <Box key={guard._id} display="flex" gap={2} sx={{ mb: 3 }}>
            {/* Left Side - Profile Info */}
            <Box flex={1}>
              <Avatar 
                src={`http://localhost:5000/uploads/profile_photos/${guard.profile_photo}`} 
                sx={{ width: 80, height: 80, mb: 2 }} 
              />
              <Typography variant="h6">{guard.name}</Typography>
              <Typography variant="body2"><strong>Phone:</strong> {guard.phone}</Typography>
              <Typography variant="body2"><strong>Email:</strong> {guard.email}</Typography>
              <Typography variant="body2"><strong>Address:</strong> {guard.address}</Typography>
              <Typography variant="body2"><strong>Status:</strong> {guard.status}</Typography>
              <Typography variant="body2"><strong>Rating:</strong> ⭐ {guard.rating}</Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Right Side - Work & Earnings */}
            <Box flex={1}>
              <Typography variant="body2"><strong>Total Earnings:</strong> ${guard.payment_details.total_earnings}</Typography>
              <Typography variant="body2"><strong>ID Type:</strong> {guard.id_type}</Typography>
              <img 
                src={`http://localhost:5000/uploads/id_pictures/${guard.id_picture}`} 
                alt="ID" 
                style={{ width: "100px", borderRadius: "5px", marginTop: "5px" }} 
              />

              <Typography variant="body2" sx={{ mt: 2 }}><strong>Assigned Work:</strong></Typography>
              <ul>
                {guard.assigned_work.slice(0, 3).map((work) => (
                  <li key={work._id}>
                    {work.client_name} - {work.shift} ({work.attendance_status})
                  </li>
                ))}
              </ul>
            </Box>
          </Box>
        ))}
      </Box>
    ) : (
      <Typography>No guard details found.</Typography>
    )}

    <Box display="flex" justifyContent="center" mt={2}>
      <Button variant="contained" onClick={() => setOpenViewModal(false)}>
        Close
      </Button>
    </Box>
  </Box>
</Modal>

    </Box>
  );
};

export default Bookings;
