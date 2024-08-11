import express from 'express';
import { uploadProfilePicture } from '../controllers/uploadController.js';
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


const configureRoutes = (upload) => {
    // private route for uploading profile picture with auth middleware
    router.post('/image', authMiddleware, upload.single('profilePic'), uploadProfilePicture);
    return router;
};

export default configureRoutes;
