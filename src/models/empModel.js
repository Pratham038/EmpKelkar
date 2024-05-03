const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    emp_id: {
      type: String,
      required: true,
      unique: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    joinedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    imageLink: {
      type: String,
    },
  },
  { collection: "employee", db: "EmpKelkar" }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
