import React from "react";
import { Box, Typography, Button, Grid, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const ContactSection = () => {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: "center",
        backgroundColor: "var(--background-color)",
      }}
    >
      {/* Title */}
      <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "var(--primary-color)" }}>
        Get in Touch
      </Typography>

      {/* Contact Info */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <LocationOnIcon sx={{ color: "#1976D2" }} />
              <Typography variant="body1">Salem,India</Typography>
            </Box>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={4}>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <PhoneIcon sx={{ color: "#1976D2" }} />
              <Typography variant="body1">+1 234 567 890</Typography>
            </Box>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={4}>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <EmailIcon sx={{ color: "#1976D2" }} />
              <Typography variant="body1">support@securityservices.com</Typography>
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      {/* Social Media Icons */}
      <Box mt={3} display="flex" justifyContent="center" gap={2}>
        <motion.div whileHover={{ scale: 1.2 }}>
          <IconButton href="#" sx={{ color: "#1877F2" }}>
            <FacebookIcon />
          </IconButton>
        </motion.div>
        <motion.div whileHover={{ scale: 1.2 }}>
          <IconButton href="#" sx={{ color: "#1DA1F2" }}>
            <TwitterIcon />
          </IconButton>
        </motion.div>
        <motion.div whileHover={{ scale: 1.2 }}>
          <IconButton href="#" sx={{ color: "#0077B5" }}>
            <LinkedInIcon />
          </IconButton>
        </motion.div>
      </Box>
    </Box>
  );
};

export default ContactSection;
