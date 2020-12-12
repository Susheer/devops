const chalk = require("chalk");
const boxen = require("boxen");
const log = console.log;
module.exports = {
  appGrettng: () => {
    const greeting = chalk.white.bold("WELCOME TO ION TEST APP");
    const boxenOptions = {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "green",
      backgroundColor: "#555555",
    };
    const msgBox = boxen(greeting, boxenOptions);
    console.log(msgBox);
  },
  mainMenu: () => {
    const OptTitle = chalk.green.bold("Enter a value between 1 to 4");
    log(OptTitle);
    log("[1] Add new Vent.");
    log("[2] List All running vent.");
    log("[3] Save & Exit");
    log("[4] Exit");
  },
};
