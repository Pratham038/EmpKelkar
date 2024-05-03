const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./UserModel");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with the provided username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        message: "User with the provided username or email already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Store hashed password
    });

    // Save the user to the database
    await newUser.save();

    // Send success response
    res
      .status(201)
      .json({ message: "User registered successfully.", user: newUser });
  } catch (error) {
    // Handle error
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token with user ID included in payload
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" } // Token expires in 30 days
    );

    // Send success response with the token and user ID
    res
      .status(200)
      .json({ message: "Login successful.", token, userId: user._id });
  } catch (error) {
    // Handle error
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  registerUser,
  login,
};
