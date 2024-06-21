// secureEndPoint.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token ){
        console.log("No token, unauthorized")
        return res.sendStatus(401); // No token, unauthorized
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }; // Invalid token
        req.user = user;
        next(); // Proceed to the protected route
    });
}
