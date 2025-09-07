import express from "express";
import User from "../models/User.js"; // mongoose User schema
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({ name, email, password: hashed });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // only send over HTTPS
      sameSite: "None",    // required for cross-origin requests
      maxAge: 3600000      // 1 hour
    });

    // Respond with user info
    res.json({ 
      message: "Signup successful", 
      user: { id: user._id, name: user.name, email: user.email } 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT using env secret
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 3600000
    });

    // Respond with user info
    res.json({ 
      message: "Login successful", 
      user: { id: user._id, name: user.name, email: user.email } 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;