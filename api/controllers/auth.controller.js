import User from '../models/user.model.js';
import bcryptjs from "bcryptjs";
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if all fields are provided
        if (!username || !email || !password || username === "" || email === "" || password === "") {
            return next(errorHandler(400, "Please enter all fields"));
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success message
        res.json({
            message: "User created successfully"
        });
    } catch (error) {
        // Pass the error to the error handler middleware
        next(error);
    }
};
