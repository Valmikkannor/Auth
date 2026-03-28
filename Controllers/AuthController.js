const User = require("../Models/userModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");


module.exports.Signup = async(req, res) => {
    try {
        const { email, password, username } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            email,
            password, // ← pass plain password, hook will hash it
            username,
        });

        const token = createSecretToken(user._id);
        res.cookie("token", token, { httpOnly: true, sameSite: "lax" });

        return res.status(201).json({
            message: "User signed up successfully",
            success: true,
            user,
        });

    } catch (error) {
        console.error("ERROR =>", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports.Login = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // ✅ Clean — removed debug test hash lines
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
        });

        return res.status(200).json({
            message: "Login successful",
            success: true,
            token
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};