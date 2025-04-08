import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axiosInstance from "../Network/axiosInstance";
import { toast } from "sonner";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 2 },
  desktop: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const TestimonialComponent = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axiosInstance.get("/client/getFeedbacks"); // Await API call
        setTestimonials(res.data);
      } catch (error) {
        toast.error("Failed to fetch Testimonials");
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <Box sx={{ py: 8, px: 3, textAlign: "center", backgroundColor: "var(--background-color)" }}>
      {/* Title */}
      <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "var(--primary-color)" }}>
        What Our Clients Say
      </Typography>

      {/* Testimonials Carousel */}
      <Carousel responsive={responsive} autoPlay autoPlaySpeed={4000} infinite>
        {testimonials.length > 0 ? (
          testimonials.map((review, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card
                sx={{
                  maxWidth: 400,
                  m: "0 auto",
                  boxShadow: 3,
                  borderRadius: 3,
                  backgroundColor: "white",
                  p: 3,
                  textAlign: "left",
                  position: "relative",
                }}
              >
                <CardContent>
                  {/* Star Rating */}
                  <Box sx={{ display: "flex", mb: 1 }}>
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < review.client_feedback.rating ? (
                        <StarIcon key={i} sx={{ color: "#FFD700" }} />
                      ) : (
                        <StarBorderIcon key={i} sx={{ color: "#FFD700" }} />
                      )
                    )}
                  </Box>

                  {/* Feedback Text */}
                  <Typography variant="body1" sx={{ fontStyle: "italic", color: "#666" }}>
                    "{review.client_feedback.comment}"
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: "#666" }}>
            No testimonials available.
          </Typography>
        )}
      </Carousel>
    </Box>
  );
};

export default TestimonialComponent;
