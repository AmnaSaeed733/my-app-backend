const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const secretKey = "mysecret5778"; // You can also store this in .env

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role ? role.trim().toLowerCase() : "user",
    });

    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup failed:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: foundUser._id, role: foundUser.role },
      secretKey,
      { expiresIn: "5h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
