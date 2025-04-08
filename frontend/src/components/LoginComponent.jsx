import React, { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, FormControlLabel, Switch } from '@mui/material';
import {toast} from 'sonner'
import axiosInstance from '../Network/axiosInstance.js'
import { useNavigate } from "react-router-dom";



const LoginComponent = ({handleSuccess}) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: 'admin', // Default role
  });
  const navigate = useNavigate();


  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = () => {
    setCredentials({ 
      ...credentials, 
      role: credentials.role === 'admin' ? 'security' : 'admin' 
    });
  };

  const handleLogin = async() => {
    if(!credentials.email || !credentials.password || !credentials.role) return toast.error('Please fill the required fields')
    if(credentials.role === 'admin'){
        try{
            const res = await axiosInstance.post('/admin/login',{email:credentials.email,password:credentials.password})
            toast.success('Logged in  Successfull ')
            const token = res.data.token
            localStorage.setItem("token",token)
            navigate('/admin');
            handleSuccess()
        }catch(error){
            console.log(error.message)
            toast.error(error.response?.data?.message || "Login failed")
        }
    }else{
        try{
            const res = await axiosInstance.post('/guard/login',{email:credentials.email,password:credentials.password})
            toast.success('Logged in  Successfull ')
            const token = res.data.token
            const  id = res.data.id
            localStorage.setItem("token",token)
            localStorage.setItem("guardId",id)
            navigate('/securityguard');
            handleSuccess()
        }catch(error){
            toast.error(error.message)
        }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ width: 400, padding: 3, boxShadow: 5, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Login
          </Typography>

          {/* Email Input */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            name="email"
            value={credentials.email}
            onChange={handleChange}
          />

          {/* Password Input */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />

          {/* Role Toggle Switch */}
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Typography variant="body1" fontWeight="bold" sx={{ mr: 1 }}>
              Admin
            </Typography>
            <FormControlLabel
              control={<Switch checked={credentials.role === 'security'} onChange={handleRoleToggle} />}
              label="Security Guard"
            />
          </Box>

          {/* Login Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 3, borderRadius: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginComponent;
