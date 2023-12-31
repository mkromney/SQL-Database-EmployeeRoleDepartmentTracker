// Import and require mysql2.
const mysql = require('mysql2');
// Import and require console.table.
const consoleTable = require('console.table');
// Import and require console.table.
const inquirer = require('inquirer');

// Connect to database - db variable will store info to the hr_db for CRUD functionality.
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: '',
    // TODO: Add MySQL password here
    password: '',
    database: 'hr_db'
  },
  console.log(`Connected to the human resources database.`)
);

// These functions show us the data in the employees, roles, and departments tables. //
const viewAllEmployees = () => {
  db.query("SELECT * FROM employees;", (err, result) => {
    // Creates a space and makes things easier to read. //
    console.log("");
    console.log("Your Results:");
    console.table(result);
    console.log("");
    loadMainPrompts();
  });
};

const viewAllRoles = () => {
  db.query("SELECT * FROM roles;", (err, result) => {
    console.log("");
    console.log("Your Results:");
    console.table(result);
    console.log("");
    loadMainPrompts();
  });
};

const viewAllDepartments = () => {
  db.query("SELECT * FROM departments;", (err, result) => {
    console.log("");
    console.log("Your Results:");
    console.table(result);
    console.log("");
    loadMainPrompts();
  });
};

// Creates a new employee entry in the employees table. //
const createNewEmployees = () => {
  inquirer.prompt([
    // The following prompts are displayed: //
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter the first name of the employee:',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter the last name of the employee:',
    },
    {
      type: 'input',
      name: 'role_id',
      message: 'Enter the role ID of the employee:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary of the employee:',
    },
    {
      type: 'input',
      name: 'manager_id',
      message: 'Enter the manager ID of the employee (optional):',
    },
  ])
  // The code below handles the user's responses and adds the entry to the employees table. //
  .then((answers) => {
    const { first_name, last_name, role_id, salary, manager_id } = answers;
    const query = `INSERT INTO employees (first_name, last_name, role_id, salary, manager_id) VALUES (?, ?, ?, ?, ?);`;
    db.query(query, [first_name, last_name, role_id, salary, manager_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log('New employee entry created successfully.');
      }
      loadMainPrompts();
    });
  });
};

// Creates new role entry in the roles table.
const createNewRoles = () => {
  inquirer.prompt([
    // The following prompts are displayed: //
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary of the role:',
    },
    {
      type: 'input',
      name: 'department_id',
      message: 'Enter the department ID of the role:',
    },
  ])
  // The code below handles the user's responses and adds the entry to the roles table. //
  .then((answers) => {
    const { title, salary, department_id } = answers;
    const query = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`;
    db.query(query, [title, salary, department_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log('New role entry created successfully.');
      }
      loadMainPrompts();
    });
  });
};

// Creates new department entry in the departments table.
const createNewDepartments = () => {
  inquirer.prompt([
    // The following prompts are displayed: //
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    },
  ])
  // The code below handles the user's responses and adds the entry to the departments table. //
  .then((answers) => {
    const { name } = answers;
    const query = `INSERT INTO departments (name) VALUES (?);`;
    db.query(query, [name], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log('New department entry created successfully.');
      }
      loadMainPrompts();
    });
  });
};

// Updates an employee entry in the employees table.
const updateEmployeeEntry = () => {
  inquirer.prompt([
    // The following prompt is displayed:
    {
      type: 'input',
      name: 'employee_id',
      message: 'Enter the ID of the employee to update:',
    },
  ])
  .then((answer) => {
    const { employee_id } = answer;
    inquirer.prompt([
      // The following prompts are displayed:
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the new first name of the employee (leave blank if unchanged):',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the new last name of the employee (leave blank if unchanged):',
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'Enter the new role ID of the employee (leave blank if unchanged):',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the new salary of the employee (leave blank if unchanged):',
      },
      {
        type: 'input',
        name: 'manager_id',
        message: 'Enter the new manager ID of the employee (leave blank if unchanged):',
      },
    ])
    .then((answers) => {
      const { first_name, last_name, role_id, salary, manager_id } = answers;
      const updates = {};
      if (first_name) updates.first_name = first_name;
      if (last_name) updates.last_name = last_name;
      if (role_id) updates.role_id = role_id;
      if (salary) updates.salary = salary;
      if (manager_id) updates.manager_id = manager_id;

      const query = `UPDATE employees SET ? WHERE id = ?`;
      db.query(query, [updates, employee_id], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Employee entry updated successfully.');
        }
        loadMainPrompts();
      });
    });
  });
};

// Incorporating inquire package allowing user to have interface. Adding functionality.
const loadMainPrompts = () => {
  inquirer.prompt([{
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
      {
        name: "View all employees.",
      },
      {
        name: "Create new employee entry"
      },
      {
        name: "View all roles."
      },
      {
        name: "Create new role entry"
      },
      {
        name: "View all departments."
      },
      {
        name: "Create new department entry"
      },
      {
        name: "Update employee entry"
      },
    ]
  }])
  .then((response) => {
    switch (response.choice) {
      case "View all employees.":
        viewAllEmployees();
        break;
      case "Create new employee entry":
        createNewEmployees();
        break;
      case "View all roles.":
        viewAllRoles();
        break;
      case "Create new role entry":
        createNewRoles();
        break;
      case "View all departments.":
        viewAllDepartments();
        break;
      case "Create new department entry":
        createNewDepartments();
        break;
      case "Update employee entry":
        updateEmployeeEntry();
        break;
      default:
        quitApp();
    }
  });
};

const quitApp = () => {
  process.exit();
};

const init = () => {
  loadMainPrompts();
};

init();
