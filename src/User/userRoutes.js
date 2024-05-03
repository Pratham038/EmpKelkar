const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/middleware");
const { registerUser, login, getUserProfile } = require("./User_controller");

// Route to create a Register user
router.post("/register", registerUser);

// Route to create a Login user
router.post("/login", login);

router.get("/getuser", [authMiddleware], getUserProfile);

module.exports = router;
