import express from 'express';
const app = express();

// dotenv setup 
import dotenv from 'dotenv';
dotenv.config();

import userRouter from './src/routes/userRoutes.js';

// database connection 
import connectDB from './src/db/connectdb.js';
const databaseConnection = process.env.DB_URL
connectDB(databaseConnection);

// cookie setup 
import cookieParser from 'cookie-parser';
app.use(cookieParser());

// bodyParser
import bodyParser from 'body-parser';
app.use(bodyParser.json());

// cors setup 
import cors from 'cors';
app.use(cors());



// cloudinary setup 
import cloudinary from 'cloudinary';
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// router routes setup
app.use(express.json());
app.use('/api/v2/user', userRouter);


const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`http:localhost:${port}`)
});