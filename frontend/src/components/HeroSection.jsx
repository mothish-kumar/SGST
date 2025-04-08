import { Box, Typography, Button } from "@mui/material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState,useEffect } from "react";
import DrawerComponent from "./DrawerComponent";
import HireSecurityComponent from "./HireSecurityComponent";
import SecurityIcon from '@mui/icons-material/Security';

const TypingEffect = ({ text, speed = 100 }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);
    
    
    useEffect(() => {
      if (index < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + text[index]);
          setIndex(index + 1);
        }, speed);
  
        return () => clearTimeout(timeout);
      }
    }, [index, text, speed]);
  
    return (
        <span>{displayedText}</span>
    );
  };

const HeroSection = () => {
  const [openDrawer,setOpenDrawer] = useState(false)
  const [drawerContent,setDrawerContent] = useState(null)
   const handleOpenDrawer = (content) => {
      setDrawerContent(content);
      setOpenDrawer(true);
    };
    const handleClose = ()=> setOpenDrawer(false)
  return (
    <>
    <Box 
      sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        padding: "50px 10%",
        backgroundColor: "var(--background-color)",
        flexDirection: { xs: "column", md: "row" }, // Responsive layout
        height: "100vh",
      }}
    >
      
      {/* Left Side - Text Content */}
      <Box sx={{ maxWidth: "50%" }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: "bold", 
            color: "var(--primary-color)",
            fontFamily:'"Mochiy Pop One", sans-serif'
          }}
        >
          <TypingEffect text="Reliable & Professional Security Guard Services"/>
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            marginTop: "10px", 
            color: "var(--text-color)",
            fontFamily: '"Mochiy Pop One", sans-serif'
          }}
        >
          <TypingEffect text="Ensuring your safety with trusted security professionals. Book a security guard today!" speed={80}/>
        </Typography>
        
        <Button 
          variant="contained" 
          sx={{ 
            marginTop: "50px", 
            backgroundColor: "var(--secondary-color)", 
            padding: "12px 24px", 
            fontSize: "18px", 
            fontWeight: "bold",
            marginLeft:'150px',
            "&:hover": { border: "2px solid grey" }
          }}
          onClick={()=>handleOpenDrawer(<HireSecurityComponent onClose={handleClose}/>)}
        >
           <SecurityIcon sx={{marginTop:'-3px',marginRight:'2px'}}/>  Hire Security Guard
        </Button>
      </Box>

      {/* Right Side - Lottie Animation */}
      <Box 
        sx={{ 
          width: { xs: "100%", md: "75%" }, 
          display: "flex", 
          justifyContent: "center",
          alignItems: "center",

        }}
      >
        <DotLottieReact
          src="https://lottie.host/aa4e3afa-ba9a-49e1-8071-c50112bf112b/eayDhtYda5.lottie"
          loop
          autoplay
          style={{ width: "100%", maxWidth: "1000px" }} // Adjust size
        />
      </Box>

    </Box>
     {/* Drawer Component */}
     <DrawerComponent open={openDrawer} onClose={() => setOpenDrawer(false)} content={drawerContent} />
    </>
  );
};

export default HeroSection;
