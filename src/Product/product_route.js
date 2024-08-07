const express = require("express");
const axios = require("axios");
const router = express.Router();
const authUserMiddleware = require("../middleware/middleware");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 });

// URL of the external mock API
const EXTERNAL_API_URL = "https://fakestoreapi.com/products";

router.get("/products", async (req, res) => {
  try {
    // Make a request to the external API to get the products
    const response = await axios.get(EXTERNAL_API_URL);

    // Extract the data from the response
    const product_Data = response.data;

    // Send the product data in the response with a success flag
    res.status(200).json({ success: true, product_Data });
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.get("/get/productcategories", async (req, res) => {
  try {
    // Check if categories are already cached
    const cachedCategories = cache.get("product_categories");
    if (cachedCategories) {
      return res
        .status(200)
        .json({ success: true, product_Data: cachedCategories });
    }

    // Make a request to the external API to get the products
    const response = await axios.get(EXTERNAL_API_URL);

    // Extract and collect unique categories from the product data
    const uniqueCategories = [...new Set(response.data.map((e) => e.category))];

    // Cache the unique categories
    cache.set("product_categories", uniqueCategories);

    // Send the unique product categories in the response with a success flag
    res.status(200).json({ success: true, product_Data: uniqueCategories });
  } catch (error) {
    console.error("Error fetching product data:", error);

    // Differentiate between client errors and server errors
    if (error.response) {
      // The request was made and the server responded with a status code outside the range of 2xx
      res
        .status(error.response.status)
        .json({ success: false, message: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({
        success: false,
        message: "No response received from external API.",
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
});

// Route to get products by category
router.get("/by_category/:category", async (req, res) => {
  try {
    // Extract category from request parameters
    const category = req.params.category;

    // Make a request to the external API to get the products by category
    const response = await axios.get(
      `https://fakestoreapi.com/products/category/${category}`
    );

    // Extract the data from the response
    const product_Data = response.data;

    // Send the product data in the response with a success flag
    res.status(200).json({ success: true, product_Data });
  } catch (error) {
    console.error("Error fetching product data:", error);

    // Handle different types of errors
    if (error.response) {
      // Server responded with a status code outside 2xx range
      res
        .status(error.response.status)
        .json({ success: false, message: error.response.data });
    } else if (error.request) {
      // No response received from the server
      res
        .status(500)
        .json({
          success: false,
          message: "No response received from external API.",
        });
    } else {
      // Error setting up the request
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
});

module.exports = router;
