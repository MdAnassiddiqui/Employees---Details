const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Load employee data from JSON file
const employeeData = JSON.parse(fs.readFileSync('employees.json', 'utf8'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Check if the username and password match
    const employee = employeeData.find(emp => emp.username === username && emp.password === password);

    if (!employee) {
        return res.status(401).send('Invalid username or password');
    }

    // Calculate salary components (fixed salary, overtime, total)
    const fixedSalary = employee.salary;
    const hoursWorked = employee.hoursWorked || 0;
    const overtimeRate = 1.5; // Adjust as needed

    const overtimeHours = Math.max(0, hoursWorked - 40); // Assuming 40 hours is regular
    const overtimeSalary = overtimeHours * (employee.salary / 40) * overtimeRate;
    const totalSalary = fixedSalary + overtimeSalary;

    // Render the employee details and calculated salary
    res.send(`
        <h1>Welcome, ${employee.name}!</h1>
        <p>Designation: ${employee.designation}</p>
        <p>Department: ${employee.department}</p>
        <p>Fixed Salary: $${fixedSalary}</p>
        <p>Overtime Salary: $${overtimeSalary.toFixed(2)}</p>
        <p>Total Salary: $${totalSalary.toFixed(2)}</p>
    `);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
