const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
const URI = process.env.MONGO_URI;

let {} = process.env;

// Middleware
app.use(express.json()); // Parse JSON bodies

// Define routes
const empRoutes = require("./src/routes/empRoutes");
const userRoutes = require("./src/User/userRoutes");
const productRoutes = require("./src/Product/product_route");
const authUserMiddleware = require("./src/middleware/middleware");

// Route middleware
app.use("/api", empRoutes);
app.use("/api", userRoutes);
app.use("/api", productRoutes);

//connect to db
mongoose
  .connect(URI)
  .then(() => {
    console.log("conn succeed");
  })
  .catch((error) => {
    console.log(error);
  });

// Start server
app.get("/", (req, res) => {
  res.send({ "Project Name": " Emp Management System" });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
