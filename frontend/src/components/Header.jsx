import React,{useContext,useEffect,useState} from 'react'
import { ThemeContext } from '../utilities/ThemeContext.jsx'
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar,Tooltip,Button } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import '@fontsource/luckiest-guy';
import ApplyJobComponent from './ApplyJobComponent.jsx';
import LoginComponent from './LoginComponent.jsx';
import DrawerComponent from './DrawerComponent.jsx';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const [openDrawer,setOpenDrawer] = useState(false)
    const [drawerContent,setDrawerContent] = useState(null)
    const [isLoggedIn,setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
    },[])
    const handleOpenDrawer = (content) => {
      setDrawerContent(content);
      setOpenDrawer(true);
    };
    const handleClose = ()=> setOpenDrawer(false)
    const handleLoginSuccess = () => {
      setIsLoggedIn(true); 
      handleClose();        
    };
    const handleLogout = () => {
      localStorage.removeItem('token'); 
      setIsLoggedIn(false); 
      navigate('/')
    };
    return (
      <AppBar position="fixed" sx={{ backgroundColor: 'var(--primary-color)', padding: '5px 20px' ,borderRadius: '50px',marginTop:'5px'}}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src='/pageIcon.svg' alt="Logo" sx={{ width: 70, height: 50, marginRight: 1}} />
            <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: "Luckiest Guy",  
              color: 'white',
              letterSpacing: 1.8,
              textShadow: '10px 10px 10px rgba(0,0,0,0.5)',
              marginTop:'5px'
            }}
          >
            SECURITY GUARD SYSTEM AND TRACKING
          </Typography>
          </Box>
            
          <Box sx={{display:'flex',gap:3,alignItems:'center'}}>
          {!isLoggedIn && (
            <>
              <Tooltip title="Apply a job as Security Guard" arrow>
                <Button color='inherit' sx={{fontWeight:'bold'}} onClick={() => handleOpenDrawer(<ApplyJobComponent onClose={handleClose} />)}>
                  Apply Job ? 
                </Button>
              </Tooltip>
              <Tooltip title="Login Here" arrow>
                <IconButton color="inherit" onClick={() => handleOpenDrawer(<LoginComponent handleSuccess={handleLoginSuccess} />)}>
                  <LoginIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          {/* Show Logout if logged in */}
          {isLoggedIn && (
            <Tooltip title="Logout" arrow>
              <IconButton color="inherit" onClick={handleLogout}>
                  <LogoutIcon/>
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Choose Theme" arrow >
          <IconButton onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} color="inherit">
            {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
          </Tooltip>
          </Box>
        </Toolbar>
        {/* Drawer Component */}
      <DrawerComponent open={openDrawer} onClose={() => setOpenDrawer(false)} content={drawerContent} />
      </AppBar>
    );
}

export default Header