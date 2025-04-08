import React from "react";
import { Box, Button, Card, CardContent, TextField, Typography, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import axiosInstance from "../Network/axiosInstance";

const HireSecurityComponent = ({ onClose }) => {
  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Name too short").required("Name is required"),
    phone: Yup.string().matches(/^\d{10}$/, "Enter a valid phone number").required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    num_guards: Yup.number().min(1, "At least 1 guard required").required("Number of guards is required"),
    shift: Yup.string().required("Select shift"),
    gender: Yup.string().required("Select gender preference"),
    address: Yup.string().min(10, "Enter a valid address").required("Address is required"),
  });

  // Formik for form handling
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      num_guards: "",
      shift: "",
      gender: "",
      address: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.post("/client/hire", values);
        toast.success(response.data.message);
        onClose();
      } catch (error) {
        toast.error(error.response?.data?.message || "Booking failed");
      }
    },
  });

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ width: 400, padding: 3, boxShadow: 5, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Hire a Security Guard
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            {/* Name */}
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            {/* Phone */}
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />

            {/* Email */}
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              margin="normal"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            {/* Number of Guards */}
            <TextField
              label="Number of Guards"
              type="number"
              fullWidth
              margin="normal"
              name="num_guards"
              value={formik.values.num_guards}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.num_guards && Boolean(formik.errors.num_guards)}
              helperText={formik.touched.num_guards && formik.errors.num_guards}
            />

            {/* Shift */}
            <TextField
              select
              label="Select Shift"
              fullWidth
              margin="normal"
              name="shift"
              value={formik.values.shift}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.shift && Boolean(formik.errors.shift)}
              helperText={formik.touched.shift && formik.errors.shift}
            >
              <MenuItem value="Day">Day Shift</MenuItem>
              <MenuItem value="Night">Night Shift</MenuItem>
            </TextField>

            {/* Gender */}
            <TextField
              select
              label="Preferred Guard Gender"
              fullWidth
              margin="normal"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors.gender}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Any">Any</MenuItem>
            </TextField>

            {/* Address */}
            <TextField
              label="Full Address"
              fullWidth
              multiline
              rows={2}
              margin="normal"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, borderRadius: 2 }}
              disabled={formik.isSubmitting}
            >
              Book Security Guard
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HireSecurityComponent;
