import React, { useEffect, useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import axiosInstance from "../Network/axiosInstance";
import { toast } from "sonner";

const SalaryManagement = () => {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuards = async () => {
      try {
        const res = await axiosInstance.get("/admin/calculateSalary");
        setGuards(res.data);
      } catch (error) {
        toast.error("Failed to fetch salary data");
      } finally {
        setLoading(false);
      }
    };

    fetchGuards();
  }, []);

  const markAsPaid = async (guardId) => {
    try {
      await axiosInstance.put(`/admin/markAsPaid/${guardId}`);
      toast.success("Salary marked as paid");
      setGuards((prev) =>
        prev.map((guard) =>
          guard.guard_id === guardId ? { ...guard, salary_paid: true, salary: 0 } : guard
        )
      );
    } catch (error) {
      toast.error("Failed to mark salary as paid");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Salary Management</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Completed Shifts</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Salary Paid</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {guards.map((guard) => (
            <TableRow key={guard.guard_id}>
              <TableCell>{guard.guard_name}</TableCell>
              <TableCell>{guard.completed_shifts}</TableCell>
              <TableCell>₹{guard.salary}</TableCell>
              <TableCell>{guard.salary_paid ? "Yes" : "No"}</TableCell>
              <TableCell>
                {!guard.salary_paid && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => markAsPaid(guard.guard_id)}
                  >
                    Mark as Paid
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalaryManagement;