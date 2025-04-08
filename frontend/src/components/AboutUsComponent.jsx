import React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";
import { motion } from "framer-motion";

const features = [
  { icon: <SecurityIcon fontSize="large" />, title: "Verified & Trained Guards" },
  { icon: <LocationOnIcon fontSize="large" />, title: "Real-Time Location Tracking" },
  { icon: <AccessTimeIcon fontSize="large" />, title: "Flexible Shifts (Day/Night)" },
  { icon: <PaymentIcon fontSize="large" />, title: "Easy Online Booking & Payments" },
];

const AboutUsComponent = () => {
  return (
    <Box sx={{ py: 8, px: 3, textAlign: "center", backgroundColor: "var(--background-color)",}}>
      {/* Title */}
      <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "var(--primary-color)" }}>
        Why Choose Us?
      </Typography>

      {/* Description */}
      <Typography variant="body1" mb={5} sx={{ color: "var(--text-color)" }}>
        We provide trained and verified security personnel for your safety and peace of mind.
      </Typography>

      {/* Features Grid */}
      <Grid container spacing={3} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  p: 3,
                  backgroundColor: "white",
                }}
              >
                <CardContent>
                  <Box sx={{ color: "#007bff", mb: 1 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#333" }}>
                    {feature.title}
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

export default AboutUsComponent;
