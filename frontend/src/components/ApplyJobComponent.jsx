import React, { useState } from "react";
import { Box, Button, Card, CardContent, TextField, Typography, MenuItem, Avatar, IconButton } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import axiosInstance from "../Network/axiosInstance";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const ApplyJobComponent = ({ onClose }) => {
  const [profilePreview, setProfilePreview] = useState(null);
  const [idPreview, setIdPreview] = useState(null);

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Name too short").required("Name is required"),
    phone: Yup.string().matches(/^\d{10}$/, "Enter a valid phone number").required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    address: Yup.string().min(10, "Enter a valid address").required("Address is required"),
    id_type: Yup.string().required("Select ID type"),
    profile_photo: Yup.mixed().required("Profile photo is required"),
    id_picture: Yup.mixed().required("ID picture is required"),
  });

  // Formik for form handling
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      id_type: "",
      profile_photo: null,
      id_picture: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("phone", values.phone);
        formData.append("email", values.email);
        formData.append("address", values.address);
        formData.append("id_type", values.id_type);
        formData.append("profile_photo", values.profile_photo);
        formData.append("id_picture", values.id_picture);

        const response = await axiosInstance.post("/guard/apply", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success('Applied Succefully . Further Update send to you registered email');
        onClose();
      } catch (error) {
        toast.error(error.response?.data?.message || "Application failed");
      }
    },
  });

  // Handle File Change
  const handleFileChange = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue(field, file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field === "profile_photo") setProfilePreview(e.target.result);
        if (field === "id_picture") setIdPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ width: 400, padding: 3, boxShadow: 5, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Apply as Security Guard
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

            {/* ID Type */}
            <TextField
              select
              label="Select ID Type"
              fullWidth
              margin="normal"
              name="id_type"
              value={formik.values.id_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.id_type && Boolean(formik.errors.id_type)}
              helperText={formik.touched.id_type && formik.errors.id_type}
            >
              <MenuItem value="Aadhar">Aadhar</MenuItem>
              <MenuItem value="Passport">Passport</MenuItem>
              <MenuItem value="Driving License">Driving License</MenuItem>
            </TextField>

            {/* Profile Photo Upload */}
            <Box display="flex" alignItems="center" mt={2}>
              <Avatar src={profilePreview} sx={{ width: 60, height: 60, mr: 2 }} />
              <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
                Upload Profile Photo
                <input hidden type="file" accept="image/*" onChange={(e) => handleFileChange(e, "profile_photo")} />
              </Button>
            </Box>

            {/* ID Picture Upload */}
            <Box display="flex" alignItems="center" mt={2}>
              <Avatar src={idPreview} sx={{ width: 60, height: 60, mr: 2 }} />
              <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
                Upload ID Picture
                <input hidden type="file" accept="image/*" onChange={(e) => handleFileChange(e, "id_picture")} />
              </Button>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, borderRadius: 2 }}
              disabled={formik.isSubmitting}
            >
              Apply Now
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ApplyJobComponent;
