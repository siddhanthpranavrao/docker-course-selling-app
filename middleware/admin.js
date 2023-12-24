const jwt = require('jsonwebtoken');
const { Admin } = require('../db/index');
const { ObjectId } = require('mongoose').Types;
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const { authorization } = req.headers;

    try {
        if (!authorization) {
            return res.status(401).json({ message: "Access token missing!" });
        }
    
        // Verify the jwt
        const { admin_id } = jwt.verify(authorization, JWT_SECRET);
    
        const admin = await Admin.findById(admin_id);

        if (admin && admin._id.equals(admin_id)) {
            req.admin_id = new ObjectId(admin_id);
            next();
        } else {
            res.status(403).json({ message: "Not allowed" });
        }
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
    }

}


module.exports = adminMiddleware;