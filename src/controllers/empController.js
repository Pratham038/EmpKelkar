const Employee = require("../models/empModel");

// Controller to handle the creation of a new employee
const createEmployee = async (req, res) => {
  try {
    // Extract employee data from request body
    const { name, emp_id, salary, email, department, imageLink } = req.body;

    // Check if employee with the provided ID or email already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ emp_id }, { email }],
    });
    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee with the provided ID or email already exists.",
      });
    }

    // Create new employee
    const newEmployee = new Employee({
      name,
      emp_id,
      salary,
      email,
      department,
      imageLink,
    });

    // Save the employee to the database
    await newEmployee.save();

    // Send success response
    res.status(201).json({
      message: "Employee created successfully.",
      employee: newEmployee,
    });
  } catch (error) {
    // Handle error
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to get an employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const { emp_id } = req.params;

    // Find employee by ID
    const employee = await Employee.findOne({ emp_id });

    // If employee not found, return 404
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Send success response with employee data
    res.status(200).json({ employee });
  } catch (error) {
    // Handle error
    console.error("Error getting employee by ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to retrieve all employees
const getAllEmployees = async (req, res) => {
  try {
    // Retrieve all employees from the database
    const employees = await Employee.find();

    // Send success response with the array of employees
    res.status(200).json({ employees });
  } catch (error) {
    // Handle error
    console.error("Error getting all employees:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to delete an employee by ID
const deleteEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find employee by ID and delete
    const deletedEmployee = await Employee.findOneAndDelete({ emp_id: id });

    // If employee not found, return 404
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Send success response
    res.status(200).json({
      message: "Employee deleted successfully.",
      employee: deletedEmployee,
    });
  } catch (error) {
    // Handle error
    console.error("Error deleting employee by ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to update an employee by ID
const updateEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, emp_id, salary, email, department, imageLink } = req.body;

    // Find employee by ID and update
    const updatedEmployee = await Employee.findOneAndUpdate(
      { emp_id: id },
      { name, emp_id, salary, email, department, imageLink },
      { new: true }
    );

    // If employee not found, return 404
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Send success response with updated employee data
    res.status(200).json({
      message: "Employee updated successfully.",
      employee: updatedEmployee,
    });
  } catch (error) {
    // Handle error
    console.error("Error updating employee by ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createEmployee,
  getEmployeeById,
  getAllEmployees,
  deleteEmployeeById,
  updateEmployeeById,
};
