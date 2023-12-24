const jwt = require('jsonwebtoken');
const { User } = require('../db/index');
const { ObjectId } = require('mongoose').Types;
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const { authorization } = req.headers;

    try {
        if (!authorization) {
            return res.status(401).json({ message: "Access token missing!" });
        }
    
        // Verify the jwt
        const { user_id } = jwt.verify(authorization, JWT_SECRET);
    
        const user = await User.findById(user_id);

        if (user && user._id.equals(user_id)) {
            req.user_id = new ObjectId(user_id);
            next();
        } else {
            res.status(403).json({ message: "Not allowed" });
        }
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
    }

}

module.exports = userMiddleware;