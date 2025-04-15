import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Collapse,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import axiosInstance from "../Network/axiosInstance";
import {toast} from 'sonner'
import {connectSocket,getSocket,disconnectSocket} from "../Network/socket";

const DataTable = ({ data,fetchData }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const guardId = localStorage.getItem("guardId")
  const [loading,setLoading] = useState(false)

  const handleStartWork = async (booking_id) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
  
        try {
          await axiosInstance.post(`/guard/startWork/${booking_id}`, { lat, lng });
  
          toast.success("Work started successfully!");
  
          let socket = getSocket();
          if (!socket) {
            socket = connectSocket();
          }
  
          socket.emit("guardLocation", { guardId, lat, lng });

          const intervalId = setInterval(() => {
            navigator.geolocation.getCurrentPosition((pos) => {
              const newLat = pos.coords.latitude;
              const newLng = pos.coords.longitude;
              socket.emit("guardLocation", { guardId, lat: newLat, lng: newLng });
              console.log("Sending location to admin:", guardId, newLat, newLng);
            });
          }, 5000); 
          
          
          fetchData("Pending");
  
          window.addEventListener("beforeunload", () => clearInterval(intervalId));
        } catch (error) {
          console.log(error.message);
          toast.error("Failed to start work. Please try again.");
        }
      },
      () => {
        toast.error("Failed to retrieve location.");
      }
    );
  };
  

  const handleCompleteWork = async(booking_id)=>{
    setLoading(true)
    try{
        await axiosInstance.post(`/guard/completeWork/${booking_id}`)
        toast.success('Work has been completed')
        disconnectSocket()
        window.location.reload()
    }catch(error){
        toast.error('Failed to update Complete Work')
    }finally{
        setLoading(false)
    }
  }
  return (
    <div style={{display:'flex',justifyContent:'center'}}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3,maxWidth:'1000px' }}>
      <Table>
        {/* Table Header */}
        <TableHead sx={{ backgroundColor: "var(--primary-color)" }}>
          <TableRow>
            <TableCell sx={{ color: "white" }}>Client Name</TableCell>
            <TableCell sx={{ color: "white" }}>Location</TableCell>
            <TableCell sx={{ color: "white" }}>Shift</TableCell>
            <TableCell sx={{ color: "white" }}>Status</TableCell>
            <TableCell sx={{ color: "white" }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {data.map((row, index) => (
            <React.Fragment key={row._id}>
              <TableRow>
                <TableCell>{row.client_name}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.shift}</TableCell>
                <TableCell>{row.shift_status}</TableCell>
                <TableCell>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                    >
                      {expandedRow === index ? "Hide Details" : "View Details"}
                    </Button>
                  </motion.div>
                </TableCell>
              </TableRow>

              {/* Expanded Row */}
              <TableRow>
                <TableCell colSpan={6} sx={{ p: 0 }}>
                  <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                    <Paper sx={{ p: 2, m: 1, backgroundColor: "#f4f4f4", borderRadius: 2 }}>
                      <strong>Client Email:</strong> {row.booking_id.client_email} <br />
                      <strong>Client Phone:</strong> {row.booking_id.client_phone} <br />
                      <strong>Address:</strong> {row.booking_id.address} <br />
                      {row.shift_status === "Completed" && (
                        <>
                          <strong>Start Time:</strong> {new Date(row.start_time).toLocaleString()} <br />
                          <strong>End Time:</strong> {new Date(row.end_time).toLocaleString()} <br />
                        </>
                      )}
                      {row.shift_status === "Pending" &&(
                         <Button variant="contained" color="success" onClick={() => handleStartWork(row.booking_id._id)}>
                         Start Work
                       </Button>
                      ) }
                      {row.shift_status === "Ongoing" &&(
                         <Button variant="contained" color="success" onClick={()=>handleCompleteWork(row.booking_id._id)} disabled={loading === row.booking_id._id} >
                        {loading === row.booking_id._id ? (
                            <CircularProgress size={24} sx={{ color: "white" }} /> // Show loader
                            ) : (
                            "Complete Work"
                            )}
                       </Button>
                      ) }
                    </Paper>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};

export default DataTable;
