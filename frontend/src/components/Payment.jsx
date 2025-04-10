import React,{useState,useEffect} from 'react'
import { Box, Typography,Button,Modal,TextField,IconButton } from '@mui/material'
import { DataGrid } from "@mui/x-data-grid";
import { toast } from 'sonner';
import axiosInstance from '../Network/axiosInstance';
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";

const Payment = () => {
    const [bookings,setBookings] = useState([])
    const [paymentModel,setPaymentModal] = useState(false)
    const [loading,setLoading] = useState(false)
    const [amount,setAmount] = useState(null)
    const [selectedBooking,setSelectedBooking] = useState(null)

    const paymentButton = (booking_id)=>{
        console.log('Button clicked')
        setPaymentModal(true)
        setSelectedBooking(booking_id)
    }
    const paymentCompleteButton = async(booking_id)=>{
        setLoading(prev => ({ ...prev, [booking_id]: true }));
        try{
            await axiosInstance.post(`/admin/sendPaymentCompleteMail/${booking_id}`)
            fetchBookings()
            toast.success('Payment Updated successfully')
        }catch(error){
            toast.error('Faile to update payment completion')
        }finally{
            setLoading(prev => ({ ...prev, [booking_id]: false }));
        }
    }

    const columns = [
        { field: "client_name", headerName: "Name", flex: 1,renderCell:(params)=>(<Typography sx={{color:'var(--text-color)',marginTop:'15px'}}>{params.value}</Typography>)  },
    { field: "client_phone", headerName: "Phone", flex: 1,renderCell:(params)=>(<Typography sx={{color:'var(--text-color)',marginTop:'15px'}}>{params.value}</Typography>)  },
    { field: "client_email", headerName: "Email", flex: 1,renderCell:(params)=>(<Typography sx={{color:'var(--text-color)',marginTop:'15px'}}>{params.value}</Typography>)  },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div style={{display:'flex',gap:5}}>
            <motion.div whileHover={{ scale: 1.1 }} >
          <Button variant="contained" size="small" onClick={()=>paymentButton(params.row._id)}>
            Send Payment Mail
          </Button>
        </motion.div>
        <motion.div whileHover={{scale:1.1}}>
        <Button variant='contained' size='small' sx={{bgcolor:'green'}} onClick={()=>paymentCompleteButton(params.row._id)}>  
        {loading[params.row._id] ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Payment Complete"
          )}
         </Button>
        </motion.div>
        </div>
      ),
    },
    ]
    const fetchBookings = async()=>{
        try{
            const res = await axiosInstance.get('/admin/paymentList')
            setBookings(res.data)
        }catch(error){
            toast.error('Failed to fetch list')
        }
    }
    useEffect(()=>{
        fetchBookings()
    },[])

    
    const sendMail = async()=>{
        if(!selectedBooking) return toast.error('Select the Booking first')
            if(!amount) return toast.error('Enter amount first')
            setLoading(true)
        try{
            await axiosInstance.post(`/admin/sendPaymentMail/${selectedBooking}`,{amount})
            toast.success('Payement Mail Send Successfully')
            setPaymentModal(false)
            setAmount(null)
        }catch(error){
            toast.error('Failed to send mail')
        }finally{
            setLoading(false)
        }
    }
   
  return (
    <Box sx={{p:3}}>
        <Typography variant='h4' fontWeight="bold" sx={{mx:'auto',mb:5}} >UnPaid Payment List</Typography>
        <DataGrid rows={bookings} columns={columns} getRowId={(row) => row._id}  disablePagination pagination = {false} hideFooter autoHeight />
        <Modal open={paymentModel} onClose={()=>setPaymentModal(false)}>
                <Box sx={{p:3,mx:'auto', bgcolor:'white',mt:5,width:'50%',position: "relative",boxShadow:3,borderRadius:'8px'}}>
                <IconButton
                    onClick={() => setPaymentModal(false)}
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                    }}
                    >
                    <CloseIcon />
                    </IconButton>
                       <Typography variant='h5' sx={{mb:5,fontWeight:'bold',color:'black'}}>Enter Amount</Typography>
                       <div style={{display:'flex',gap:5}}>
                        <TextField id="outlined-number" label="Amount" type='number' slotProps={{inputLabel: {shrink: true }  }} value={amount} onChange={(e)=>setAmount(e.target.value)}/>
                            <Button variant='container' sx={{bgcolor:'green',color:'white',fontWeight:'bold'}} onClick={sendMail}>
                            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send Mail"}
                            </Button>
                       </div>
                </Box>
        </Modal>
    </Box>
  )
}

export default Payment