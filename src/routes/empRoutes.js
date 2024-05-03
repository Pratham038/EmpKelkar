const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getEmployeeById,
  getAllEmployees,
  deleteEmployeeById,
  updateEmployeeById,
} = require("../controllers/empController");
const authMiddleware = require("../middleware/middleware");

// Route to create a new employee
router.post("/employees", createEmployee);

// Route to get all employees
router.get("/employees", authMiddleware, getAllEmployees);

// Route to get an employee by ID
router.get("/employees/:emp_id", getEmployeeById);

// Route to delete an employee by ID
router.delete("/employees/:id", deleteEmployeeById);

// Route to update an employee by ID
router.put("/employees/:id", updateEmployeeById);

module.exports = router;
