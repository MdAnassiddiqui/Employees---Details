const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 5000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// Initialize employee data as an empty array
let employeeData = [];
// Function to write employee data to the JSON file
function writeEmployeeData() {
fs.writeFileSync('employees.json', JSON.stringify(employeeData, null, 4));
}
app.get('/login', (req, res) => {
res.sendFile(__dirname + '/public/login.html');
});
app.get('/signup', (req, res) => {
res.sendFile(__dirname + '/public/signup.html');
});
app.post('/login', (req, res) => {
const { username, password } = req.body;
// Check if the username and password match
const employee = employeeData.find(emp => emp.username === username && emp.password ===
password);
if (!employee) {
return res.status(401).send('Invalid username or password');
}
// Calculate salary components (fixed salary, overtime, total)
const fixedSalary = employee.salary;
const hoursWorked = employee.hoursWorked || 0;
const overtimeRate = 1.5; // Adjust as needed
const regularHours = Math.min(40, hoursWorked); // Regular hours capped at 40
const overtimeHours = Math.max(0, hoursWorked - 40); // Overtime hours above 40
const overtimeSalary = overtimeHours * (employee.salary / 40) * overtimeRate;
const totalSalary = fixedSalary + overtimeSalary;
// Render the employee details and calculated salary
res.send(`
<h1>Welcome, ${employee.name}!</h1>
<p>Designation: ${employee.designation}</p>
<p>Department: ${employee.department}</p>
<p>Fixed Salary: $${fixedSalary}</p>
<p>Regular Hours Worked: ${regularHours}</p>
<p>Overtime Hours Worked: ${overtimeHours}</p>
<p>Overtime Salary: $${overtimeSalary.toFixed(2)}</p>
<p>Total Salary: $${totalSalary.toFixed(2)}</p>
`);
});
app.post('/signup', (req, res) => {
const { name, username, password, designation, department, salary, hoursWorked } = req.body;
// Check if the username already exists
const existingEmployee = employeeData.find(emp => emp.username === username);
if (existingEmployee) {
return res.status(409).send('Username already exists.');
}
// Create a new employee
const newEmployee = {
name,
username,
password,
designation,
department,
salary: parseFloat(salary), // Convert salary to a float
hoursWorked: parseFloat(hoursWorked || 0), // Convert hoursWorked to a float, default
//to 0 if not provided
};
// Add the new employee to the data array
employeeData.push(newEmployee);
// Write updated employee data to the JSON file
writeEmployeeData();
// Redirect to the login page after successful signup
res.redirect('/login');
});
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});