import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"
import {errorHandler}  from "./middleware/errorMiddleware.js";
import connectDB from "./config/dbConnection.js";
import dotenv from "dotenv"
dotenv.config()

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the uploads directory
const uploadDir = path.join(__dirname, 'uploads');

// Create the uploads directory if it does not exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const app = express();

app.use(cors()); // Solving cors

// Body parser middleware
app.use(express.json())

// User Routes - create user, get users , get single user
app.use('/api/v1', userRoutes);


// Error handler middleware
app.use(errorHandler); 

const PORT = process.env.PORT || 3000; // takes port from .env or just put 3000

connectDB().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
})



