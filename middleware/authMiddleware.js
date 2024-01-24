import jwt from "jsonwebtoken"
import User from "../models/user.js"

// Middleware function for protecting routes with JWT authentication
const protect = async (req, res, next) => {
    let token;

    // Check if the request has an Authorization header starting with 'Bearer'
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(authHeader && authHeader.startsWith('Bearer')){
        try {
            // Extract the token from the Authorization header
            token = authHeader.split(' ')[1];

            // Verify the token using the JWT_SECRET from environment variables
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Retrieve user information from the decoded token, excluding sensitive data (password and address)
            req.user = await User.findById(decoded.id).select('-password -address')
            next();
        } catch (error) {
            // Handle token verification errors
            console.error("Token verification error:", error);
            res.status(401).send('Not authorized');
        }
    }

    // If no token is available in the request, send a 401 Unauthorized response
    if (!token) {
        res.status(401).send('No token available');
    }
}

// Export the protect middleware for use in other files
export default protect;
