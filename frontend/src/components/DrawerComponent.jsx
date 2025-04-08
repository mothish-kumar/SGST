import React from "react";
import { Drawer, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DrawerComponent = ({ open, onClose, content }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, padding: 3 }}>
        
        {/* Close Button */}
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>
        
        {/* Dynamic Content */}
        {content}
      </Box>
    </Drawer>
  );
};

export default DrawerComponent;
