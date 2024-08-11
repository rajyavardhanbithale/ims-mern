import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    
    // extracting cookies from the request 
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    // checking if token is present
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. No token provided.' });
    }

    try {
        // verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        // calling the next middleware
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

export default authMiddleware;
