import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
import mongoose from 'mongoose';
import "./services/webSocket.js";

import clientRouter from './routes/clientRouter.js';
import guardRouter from './routes/guardRouter.js';
import adminRouter from './routes/adminRouter.js';
dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// DB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("DB Connection Failed", error);
    }
};
connectDB();

// Routes
app.use('/api/client', clientRouter);
app.use('/api/guard', guardRouter);
app.use('/api/admin', adminRouter);

//static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}
);