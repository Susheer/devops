var inquirer = require("inquirer");
module.exports = {
  addVent: () => {
    inquirer
      .prompt([
        {
          name: "ionId",
          type: "input",
          message: "Enter Ion id e.g Vent001",
        },
        {
          name: "back",
          type: "input",
          message: "end this process",
        },
      ])
      .then((answers) => {
        if (answers.ionId) {
          console.log("Entered id -->", answers);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
