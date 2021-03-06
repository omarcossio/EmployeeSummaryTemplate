const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

var managerExists = false;

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const localArray = [];

function validateEmpty(name){
    return name != '';
}

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
function init() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: "What is the employee's name?",
                validate: validateEmpty,
            },

            {
                type: 'input',
                name: 'id',
                message: "What is the employee's id",
                validate: validateEmpty,
            },

            {
                type: 'input',
                name: 'email',
                message: "What is the employee's email address?",
                validate: validateEmpty,
            },

            {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: ['Manager', 'Engineer', 'Intern'],
                when: managerExists == false,
            },
            {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: ['Engineer', 'Intern'],
                when: managerExists == true,
            },

            {
                type: 'input',
                name: 'officeNumber',
                message: "What is the employee's office Number?",
                when: (answers) => answers.role == "Manager",
                validate: validateEmpty,
            },

            {
                type: 'input',
                name: 'github',
                message: "What is the employee's github username?",
                when: (answers) => answers.role == "Engineer",
                validate: validateEmpty,
            },

            {
                type: 'input',
                name: 'school',
                message: "What school did the employee attend?",
                when: (answers) => answers.role == "Intern",
                validate: validateEmpty,
            },
            {
                type: 'confirm',
                name: 'more',
                message: "Do you need to add additional employees?",
                default: false
            }

            
        ])
        .then((data => {

            switch (data.role) {
                case "Manager":
                    const m = new Manager(data.name, data.id, data.email, data.officeNumber);
                    localArray.push(m);
                    managerExists = true;
                    break;
                case "Engineer":
                    const e = new Engineer(data.name, data.id, data.email, data.github);
                    localArray.push(e);
                    break;
                case "Intern":
                    const i = new Intern(data.name, data.id, data.email, data.school);
                    localArray.push(i);
                    break;
                default: console.log("Nothing is happening");

            }

            if (data.more == true){
                console.log("Enter the information for the new employee");
                init();
            }
            const employeeDivs = render(localArray);

            fs.writeFile(outputPath, employeeDivs, function (err) {
                if (err) throw err; 
                console.log("Success!");
            });
        }))


}
init();


// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!


// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.



// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
