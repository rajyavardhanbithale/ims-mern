import path from 'path';
import jwt from 'jsonwebtoken'; // Import jwt
import User from "../models/User.js";

/**
 * @UPLOAD_PROFILE_PICTURE
 * @ROUTE @POST {{URL}}/api/v1/upload/image
 * @ACCESS Private (Logged in user only)
 */
export const uploadProfilePicture = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // get the file from the request
    const file = req.file;
    const filePath = path.join('uploads', file.filename);


    try {
        // get the token from the request and extract the user id
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // update the user profile picture
        const uploadPic = await User.updateOne({ _id: decoded.id }, { $set: { pic: file.filename } });

        if (uploadPic.modifiedCount === 0) {
            return res.status(500).json({ message: 'Error uploading file' });
        }
        res.status(200).json({
            message: 'File uploaded successfully',
            file: {
                filename: file.filename,
                path: filePath,
                mimetype: file.mimetype,
                size: file.size
            }
        });
    } catch (err) {
        console.error("Error uploading file:", err);
        res.status(500).json({ message: err.message });
    }
};
