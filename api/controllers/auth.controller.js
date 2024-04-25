import User from '../models/user.model.js';
import bcryptjs from "bcryptjs";
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

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

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email ||!password || email === "" || password === "") {
        next(errorHandler(400, "Please enter all fields"));
    }
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "Incorrect credentials")); 
        }
        const validPassword = await bcryptjs.compare(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Incorrect credentials"));
        }

        const token = jwt.sign(
            {id: validUser._id,},
            "testsalt",
            {
                expiresIn: "1d"
            }
        );

        const {password: pass, ...rest } = validUser._doc;

        res.status(200).cookie("access_token", token, {httpOnly: true,}).json(rest);
        
    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id: user._id}, "testsalt", {expiresIn: "1d"});
            const {password: pass, ...rest} = user._doc;    
            res.status(200).cookie("access_token", token, {httpOnly: true,}).json(rest);
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('')+ Math.random().toString(9).slice(-4),
                email,
                profilePicture: googlePhotoUrl,
                password: hashedPassword
            });
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, "testsalt", {expiresIn: "1d"});
            const {password: pass, ...rest} = newUser._doc;
            res.status(200).cookie("access_token", token, {httpOnly: true,}).json(rest);
        }

        
    } catch (error) {
        next(error);
    }
}