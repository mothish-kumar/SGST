import React from "react";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import { motion } from "framer-motion";

const steps = [
  { icon: <EventNoteIcon fontSize="large" />, title: "Request a Security Guard", desc: "Fill out a simple booking form." },
  { icon: <VerifiedUserIcon fontSize="large" />, title: "Admin Approves & Assigns", desc: "Get instant updates via email." },
  { icon: <LocationOnIcon fontSize="large" />, title: "Guard Arrives at Your Location", desc: "Track in real-time." },
  { icon: <PaymentIcon fontSize="large" />, title: "Easy Payment & Feedback", desc: "Secure QR-based payments & service review." },
];

const HowItWorksComponent = () => {
  return (
    <Box sx={{ py: 8, px: 3, textAlign: "center", backgroundColor: "var(--background-color)" }}>
      {/* Title */}
      <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "var(--primary-color)" }}>
        How Our Service Works?
      </Typography>

      {/* Steps Grid */}
      <Grid container spacing={3} justifyContent="center">
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  p: 3,
                  backgroundColor: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    backgroundColor: "#007bff",
                    color: "white",
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </Box>
                <CardContent>
                  <Box sx={{ color: "#007bff", mb: 1 }}>{step.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#333" }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
                    {step.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorksComponent;
