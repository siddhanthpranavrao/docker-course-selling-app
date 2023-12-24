const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db/index");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


// User Routes
router.post('/signup', async (req, res) => {
	// Implement user signup logic
	const { username, password } = req.body;

	try {
		// Check if user exists in db
		const existingUser = await User.findOne({ username });

		if (existingUser) {
			return res.status(404).json({ message: "User already exists!" });
		}

		const newUser = await User.create({ username, password });

		res.status(200).json({ message: 'User created successfully' });

	} catch (error) {
		res.status(500).json({ message: error.message });
	}

});

router.post('/signin', async (req, res) => {
	// Implement admin signup logic
	const { username, password } = req.body;

	try {
		// Check if user exists in db
		const existingUser = await User.findOne({ username, password });

		if (!existingUser) {
			return res.status(404).json({ message: "User not found!" });
		}

		const token = jwt.sign({ user_id: existingUser._id }, JWT_SECRET);

		res.status(200).json({ token });

	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get('/courses', userMiddleware, async (req, res) => {
	// Implement listing all courses logic
	try {
		const courses = await Course.find({});

		res.status(200).json({ courses });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
	// Implement course purchase logic
	const { courseId } = req.params;
	const userId = req.user_id;

	try {
		const courseExists = await Course.findOne({ courseId });

		if (!courseExists) {
			return res.status(404).json({message: "Course doesn't exist"});
		}

		const result = await User.updateOne(
			{ _id: userId },
			{ $push: { courses: Number(courseId) } }
		);

		if (result.modifiedCount === 1) {
			res.status(200).json({ message: 'Course purchased successfully' });
		} else {
			res.status(404).json({ message: 'User not found or course not available' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
	// Implement fetching purchased courses logic
	const userId = req.user_id;

	try {
		const { courses } = await User.findOne({ _id: userId });
		
		const purchasedCourses = await Course.find({courseId: {$in : courses}});

		res.status(200).json({courses: purchasedCourses});
	} catch (error) {
		res.status(500).json({ message: 'Internal Server Error' });
	}

});

module.exports = router;