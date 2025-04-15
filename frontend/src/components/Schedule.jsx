import React, { useEffect, useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Dialog, DialogTitle, IconButton, DialogContent, Box } from "@mui/material";
import axiosInstance from "../Network/axiosInstance";
import { toast } from "sonner";
import CloseIcon from '@mui/icons-material/Close';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardData,setGuardData] = useState(null)
  const [viewModal,setViewModal] = useState(false)

  useEffect(() => {
    setLoading(true)
   const fetchSchedule = async()=>{
    try{
        const res = await axiosInstance.get('/admin/getSchedule')
        setSchedule(res.data.schedule)
       }catch(error){
        toast.error('Failed to fetch schedule data')
       }finally{
        setLoading(false)
       }
   }
    fetchSchedule()
  }, []);

  if (loading) return <CircularProgress />;

  const viewProgressBtn =async (guard_id)=>{
    try{
        const res  = await axiosInstance.get(`/admin/getGuard/${guard_id}`)
        setGuardData(res.data)
        setViewModal(true)
    }catch(error){
        toast.error('Failed to get guard details')
    }
  }
  return (
    <div>
      <h2>Schedule</h2>
      {schedule.map((guard, index) => (
        <div key={index}>
          <div style={{border:'2px solid',backgroundColor:'var(--text-color)',color:'var(--secondary-color)',padding:'5px',display:"flex"}}>
          <h3>Security Guard : {guard.guard_name}</h3>
          <button style={{marginLeft:'1100px'}} onClick={()=>viewProgressBtn(guard.guard_id)}>View Progress</button>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{color:'var(--text-color)', fontWeight: 'bold'}}>Client Name</TableCell>
                <TableCell sx={{color:'var(--text-color)', fontWeight: 'bold'}}>Location</TableCell>
                <TableCell sx={{color:'var(--text-color)', fontWeight: 'bold'}}>Shift</TableCell>
                <TableCell sx={{color:'var(--text-color)', fontWeight: 'bold'}}>Attendance Status</TableCell>
                <TableCell sx={{color:'var(--text-color)', fontWeight: 'bold'}}>Shift Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guard.assigned_work.map((work, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{color:'var(--text-color)'}}>{work.client_name}</TableCell>
                  <TableCell sx={{color:'var(--text-color)'}}>{work.location}</TableCell>
                  <TableCell sx={{color:'var(--text-color)'}}>{work.shift}</TableCell>
                  <TableCell sx={{color:'var(--text-color)'}}>{work.attendance_status}</TableCell>
                  <TableCell sx={{color:'var(--text-color)'}}>{work.shift_status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}

      {viewModal &&(
        <Dialog open={viewModal} onClose={()=>setViewModal(false)}>
            <DialogTitle>
                {guardData.name}
            </DialogTitle>
            <IconButton sx={{position:'absolute',right:8,top:8}} onClick={()=>setViewModal(false)}><CloseIcon/></IconButton>
            <DialogContent>
                <Box>
                    <Table>
                        <TableRow>
                            <TableCell>Phone Number</TableCell> 
                            <TableCell>{guardData.phone}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Email</TableCell> 
                            <TableCell>{guardData.email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Total Earnings</TableCell> 
                            <TableCell>{guardData.payment_details.total_earnings}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Last Payment Date</TableCell>
                            <TableCell>
                                {guardData.payment_details.last_payment_date
                                ? new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    }).format(new Date(guardData.payment_details.last_payment_date))
                                : "N/A"}
                            </TableCell>
                            </TableRow>
                    </Table>
                </Box>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Schedule;