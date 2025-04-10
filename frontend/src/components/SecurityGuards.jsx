import React, { useState, useEffect } from "react";
import { 
  Box, Button, Tabs, Tab, Avatar, Typography, CircularProgress, 
  Dialog, DialogContent, IconButton ,TextField,DialogActions
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import axiosInstance from "../Network/axiosInstance";
import { CheckCircle, Cancel, Close } from "@mui/icons-material";
import { toast } from "sonner";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
const SecurityGuards = () => {
  const [status, setStatus] = useState("Pending");
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [noData,setNoData] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedGuardId, setSelectedGuardId] = useState(null);

  useEffect(() => {
    fetchGuards();
  }, [status]);

  const fetchGuards = async () => {
    setLoading(true);
    setNoData(false)
    try {
      const res = await axiosInstance.get(`/admin/getGuards?status=${status}`);
      setGuards(res.data);
    } catch (error) {
      if (error?.response?.status === 404) return setNoData(true)
      toast.error("Error fetching guards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.post(`/admin/approveGuard/${id}`);
      fetchGuards();
      toast.success("Security guard approved successfully")
    } catch (error) {
      toast.error("Error approving guard:", error);
    }
  };

  const handleRejectClick = (id) => {
    setSelectedGuardId(id);
    setRejectDialogOpen(true);
  };
  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectReason("");
    setSelectedGuardId(null);
  };
  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    try {
      await axiosInstance.post(`/admin/rejectGuard/${selectedGuardId}`, { reason: rejectReason });
      fetchGuards();
      toast.success("Security guard rejected successfully");
      handleCloseRejectDialog();
    } catch (error) {
      toast.error("Error rejecting guard:", error);
    }
  };

  // Open image modal
  const handleAvatarClick = (imagePath) => {
    setSelectedImage(`http://localhost:5000/uploads/${imagePath}`);
  };

  // Close image modal
  const handleCloseModal = () => {
    setSelectedImage(null);
  };
  const handelDelete = async(id)=>{
    try{
      await axiosInstance.delete(`/admin/deleteGuard/${id}`)
      fetchGuards();
      toast.success('Security Guard Deleted successfully')
    }catch(error){
      toast.error('Failed to delete guards')
    }
  }
  const columns = [
    {
      field: "profile_photo",
      headerName: "Photo",
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={`http://localhost:5000/uploads/profile_photos/${params.value}`}
          sx={{ cursor: "pointer",marginTop:'5px' }}
          onClick={() => handleAvatarClick(`profile_photos/${params.value}`)}
        />
      ),
    },
    { field: "name", headerName: "Name", width: 160,renderCell:(params)=>(<Typography sx={{color:'var(--text-color)',marginTop:'15px'}}>{params.value}</Typography>) },
    { field: "phone", headerName: "Phone", width: 140 ,renderCell:(params)=>(<Typography sx={{color:'var(--text-color)',marginTop:'15px'}}>{params.value}</Typography>) },
    { field: "email", headerName: "Email", width: 200,renderCell:(params)=>(<Typography sx={{color:'var(--text-color)',marginTop:'15px'}}>{params.value}</Typography>)  },
    { field: "address", headerName: "Address", width: 250,renderCell:(params)=>(<Typography sx={{color:'var(--text-color)',marginTop:'15px'}}>{params.value}</Typography>)  },
    { field: "id_type", headerName: "ID Type", width: 120,renderCell:(params)=>(<Typography sx={{color:'var(--text-color)',marginTop:'15px'}}>{params.value}</Typography>)  },
    {
      field: "id_picture",
      headerName: "ID Proof",
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={`http://localhost:5000/uploads/id_pictures/${params.value}`}
          sx={{ cursor: "pointer",marginTop:'5px' }}
          onClick={() => handleAvatarClick(`id_pictures/${params.value}`)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 290,
      renderCell: (params) => {
        if (status === "Pending") {
          return (
            <Box sx={{ display: "flex", gap: 1 }}>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckCircle />}
                  onClick={() => handleApprove(params.row._id)}
                >
                  Approve
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<Cancel />}
                  onClick={() => handleRejectClick(params.row._id)}
                >
                  Reject
                </Button>
              </motion.div>
            </Box>
          );
        }
      
        return (
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button variant="contained" color="error" size="small" startIcon={<DeleteForeverIcon />} onClick={()=>handelDelete(params.row._id)} >
              Delete
            </Button>
          </motion.div>
        );
      }
    }      
  ];


  return (
    <Box sx={{ width: "85%", p: 3, margin: "auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Security Guards Management
      </Typography>

      {/* Status Tabs */}
      <Tabs value={status} onChange={(e, newValue) => setStatus(newValue)} sx={{ mb: 2 }}>
        <Tab label="Pending" value="Pending" sx={{color:'var(--text-color)'}} />
        <Tab label="Approved" value="Approved"  sx={{color:'var(--text-color)'}}  />
        <Tab label="Rejected" value="Rejected"  sx={{color:'var(--text-color)'}} />
      </Tabs>

      {/* Data Table */}
      {
        !noData ?(
          loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <DataGrid
                rows={guards.map((guard) => ({ ...guard, id: guard._id }))}
                columns={columns}
                autoHeight
                hideFooter
                pagination={false}
                sx={{
                  "& .MuiDataGrid-root": {
                    borderRadius: 2,
                    boxShadow: 3,
                  },
                }}
              />
            </motion.div>
          )
        ):(<h3 style={{margin:'auto'}}> No Data presents </h3>)
      }

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onClose={handleCloseModal} maxWidth="md">
        <DialogContent sx={{ textAlign: "center", p: 2 }}>
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
            onClick={handleCloseModal}
          >
            <Close />
          </IconButton>
          <img
            src={selectedImage}
            alt="Enlarged Preview"
            style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 8 }}
          />
        </DialogContent>
      </Dialog>
      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog} maxWidth="sm" fullWidth>
        <DialogContent>
          <Typography variant="h6" mb={2}>Enter Rejection Reason</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for Rejection"
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} color="secondary">Cancel</Button>
          <Button onClick={handleRejectConfirm} color="error" variant="contained">Reject</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecurityGuards;
