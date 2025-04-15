import React ,{useState}from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import axiosInstance from '../Network/axiosInstance';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Rating,
    TextField,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
  } from '@mui/material';

const FeedBack = () => {
    const [rating,setRating] = useState(0)
    const [comment,setComment] = useState("")
    const {bookingId }= useParams()
    const navigate = useNavigate()
    const [loading,setLoading]  = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = async(e)=>{
        e.preventDefault()
        setLoading(true)
        try{
                await axiosInstance.post(`/client/feedback/${bookingId}`,{rating,comment})
                toast.success('Feed Back Form submitted successfully')
                navigate('/')
        }catch(error){
            toast.error('Failed to post feedback')
        }finally{
            setLoading(false)
        }
    }
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', p: 3, borderRadius: 4, boxShadow: 4 }}>
        <CardContent>
          {submitted ? (
            <Typography variant="h5" align="center" color="success.main">
              Thank you for your feedback!
            </Typography>
          ) : (
            <>
              <Typography variant="h5" gutterBottom align="center">
                Rate Our Security Service
              </Typography>

              <Box component="form" onSubmit={handleSubmit} mt={2}>
                <Typography component="legend" fontWeight="bold">
                  Your Rating:
                </Typography>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                  sx={{ mb: 2 }}
                  required
                />

                <TextField
                  label="Comments"
                  multiline
                  fullWidth
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your feedback here..."
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit Feedback'}
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Feedback submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default FeedBack