import React, { useEffect, useState } from "react";
import axiosInstance from '../Network/axiosInstance.js'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper ,CircularProgress} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Bar, Doughnut } from "react-chartjs-2";

const Progress = () => {
  const [pending, setPending] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkStatus("Pending", setPending);
    fetchWorkStatus("Ongoing", setOngoing);
    fetchWorkStatus("Completed", setCompleted);
  }, []);

  const fetchWorkStatus = async (status, setState) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/admin/workStatus?status=${status}`);
      setState(data);
    } catch (error) {
      console.error(`Error fetching ${status} data`, error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (data) => {
    return {
      labels: data.map((item) => item.client_name),
      datasets: [
        {
          label: "Guards Assigned",
          data: data.map((item) => item.num_guards),
          backgroundColor: ["#fca311", "#14213d", "#e63946"],
        },
      ],
    };
  };



  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {loading ? (
        <div className="flex justify-center items-center w-full h-40">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Work Progress Overview
      </h1>

      {loading && <p className="text-center text-gray-600">Loading data...</p>}

      {!loading && (
        <div className="space-y-10">
          {/* Pending Work */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-yellow-600">Pending Work</h2>
            <Swiper spaceBetween={10} slidesPerView={1}>
              {pending.map((item) => (
                <SwiperSlide key={item._id} className="p-4 border rounded-md shadow">
                  <h4 className="text-lg font-medium text-gray-700">{item.client_name}</h4>
                  <p className="text-gray-500">Shift: {item.shift}</p>
                  <p className="text-gray-500">Guards: {item.num_guards}</p>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="mt-4" style={{width:'50%'}}>
              <Bar data={getChartData(pending)} />
            </div>
          </div>

          {/* Ongoing Work */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-blue-600">Ongoing Work</h2>
            <Swiper spaceBetween={10} slidesPerView={1}>
              {ongoing.map((item) => (
                <SwiperSlide key={item._id} className="p-4 border rounded-md shadow">
                  <h4 className="text-lg font-medium text-gray-700">{item.client_name}</h4>
                  <p className="text-gray-500">Shift: {item.shift}</p>
                  <p className="text-gray-500">Guards: {item.num_guards}</p>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="mt-4"  style={{width:'30%'}}>
              <Doughnut data={getChartData(ongoing)}  />
            </div>
          </div>

          {/* Completed Work */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-green-600">Completed Work</h2>
            <Swiper spaceBetween={10} slidesPerView={1}>
              {completed.map((item) => (
                <SwiperSlide key={item._id} className="p-4 border rounded-md shadow">
                  <h4 className="text-lg font-medium text-gray-700">{item.client_name}</h4>
                  <p className="text-gray-500">Shift: {item.shift}</p>
                  <p className="text-gray-500">Guards: {item.num_guards}</p>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="mt-4" style={{width:'50%'}}>
              <Bar data={getChartData(completed)}  />
            </div>
          </div>
        </div>
      )}
    </div>

          <div style={{width:'80%',marginTop:'10px'}}>
            <TableContainer component={Paper} className="shadow-md">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client</TableCell>
                    <TableCell>Guards</TableCell>
                    <TableCell>Shift</TableCell>
                    <TableCell>Contact</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...pending, ...ongoing, ...completed].map((work) => (
                    <TableRow key={work._id}>
                      <TableCell>{work.client_name}</TableCell>
                      <TableCell>{work.num_guards}</TableCell>
                      <TableCell>{work.shift}</TableCell>
                      <TableCell>{work.client_phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Progress;
