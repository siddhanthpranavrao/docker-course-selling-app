const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db/index")
const jwt = require('jsonwebtoken');
const router = Router();
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
	try {
		const { username, password } = req.body;

		// Check if user exists in db
		const existingAdmin = await Admin.findOne({ username });

		if (existingAdmin) {
			return res.status(404).json({ message: "Admin already exists!"});
		}

        const newAdmin = await Admin.create({ username, password });

		res.status(200).json({ message: 'Admin created successfully' });

	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const { username, password } = req.body;

	try {
		// Check if user exists in db
		const existingAdmin = await Admin.findOne({ username, password });

		if (!existingAdmin) {
			return res.status(404).json({ message: "Admin not found!"});
		}

		const token = jwt.sign({ admin_id: existingAdmin._id }, JWT_SECRET);

		res.status(200).json({ token });

	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const { courseId, title, description, price, imageLink } = req.body;

    try {
        const course = await Course.create({ courseId, title, description, price, imageLink });
        
        res.status(201).json({ message: 'Course created successfully', id: course._id })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    try {
        const courses = await Course.find();

        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;