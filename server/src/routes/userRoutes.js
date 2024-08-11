import express from 'express';
import { deactivateUser, getUser, login, deleteUser, signup, updateUser } from '../controllers/userController.js';
import authMiddleware from "../middleware/auth.js";

// defining express router
const router = express.Router();

// public routes
router.post('/signup', signup);
router.post('/login', login);


// private routes with auth middleware
router.get('/get', authMiddleware, getUser);
router.put('/update/:id', authMiddleware, updateUser);
router.delete('/delete', authMiddleware, deleteUser);
router.patch('/deactivate', authMiddleware, deactivateUser);


// route for verifying jwt
router.get('/verify-jwt', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Authorized' });
})

export default router;