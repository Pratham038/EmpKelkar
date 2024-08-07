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
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming you pass user id in the request parameters
    const { username, email, password } = req.body;

    // Find the user by ID
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user fields if they are provided in the request body
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user
    user = await user.save();

    // Send success response
    res
      .status(200)
      .json({ message: "User updated successfully.", user, success: true });
  } catch (error) {
    // Handle error
    console.error("Error updating user:", error);
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
    res.status(200).json({
      message: "Login successful.",
      token,
      userId: user._id,
      success: true,
    });
  } catch (error) {
    // Handle error
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getUserProfile = async (req, res) => {
  try {
    // Fetch user information based on the user ID extracted from the token
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Send success response with user information
    res.status(200).json({ user, success: true });
  } catch (error) {
    // Handle error
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  registerUser,
  login,
  getUserProfile,
};
