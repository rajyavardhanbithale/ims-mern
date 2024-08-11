import express from "express";
import connectDB from "./config/db.js";
import * as dotenv from "dotenv";
import userRoute from "./routes/userRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import uploadRoute from "./routes/uploadRoute.js";
import path from "path";

// loading environment variables
dotenv.config({
    path: './.env'
});


// connecting to the database
connectDB();

// creating an express app
const app = express();
const PORT = process.env.PORT || 3001;
const apiVersion = 'v1';

// configuring for multer for disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

// configuring multer for file upload type
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type'), false);
        }
        cb(null, true);
    }
});

// middleware
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173', 'https://ims-mern-azns.vercel.app'],
    credentials: true
}));
app.use('/uploads', express.static('uploads'));


// routes
app.use(`/api/${apiVersion}/user`, userRoute);
app.use(`/api/${apiVersion}/upload`, uploadRoute(upload));

// ping route
app.get(`/ping`, (req, res) => {
    res.status(200).json({ message: 'pong' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})