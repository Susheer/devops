var inquirer = require("inquirer");
var chalk = require("chalk");
var IonVent = require("./Vent");
var prompt = require("prompt");
var mqtt = require("mqtt");
var Prefix = require("./prefix.json");
var connections = require("./connections");
var options = {
  port: 0000,
  protocolId: "MQIsdp",
  protocolVersion: 3,
  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
  reconnectPeriod: 5000,
};
if (connections.mqtt.username && connections.mqtt.password) {
  console.log(chalk.blue.bold("Found secure chanel 🙂"));
  options["username"] = connections.mqtt.username;
  options["password"] = connections.mqtt.password;
}
options["port"] = connections.mqtt.port;
var client = mqtt.connect(connections.mqtt.HOST, options);
console.log(
  chalk.green.bold(
    `Connecting to MQTT At [${connections.mqtt.HOST + ":" + options.port}]`
  )
);
client.on("connect", function () {
  console.log(chalk.green.bold("[MQTT]") + chalk.green.yellow("OK"));
  mainMenu();
});

process.setMaxListeners(0);
var ionList = [];
const mainMenu = () => {
  process.setMaxListeners(0);
  inquirer
    .prompt([
      {
        name: "mainMenu",
        type: "list",
        message: "Select  action",
        choices: [
          "Add new vent",
          "Start Ion",
          "Stop Ion",
          "Bulk Add",
          "Bulk Stop",
          "Bulk Start",
          "Delete ion",
          "Start Therapy",
          "Stop Therapy",
          "Start VentSetting",
          "Stop VentSetting",
          "Start AlmSetting",
          "Stop AlmSetting",
          "List all vent",
          "Show running vents",
          "Remove all vents",
          "Start Monitoring Curve In Bulk",
          "Stop Monitoring Curve In Bulk",
          "exit",
        ],
      },
    ])
    .then((answers) => {
      if (answers.mainMenu === "Add new vent") {
        prompt.start();
        prompt.get(["VentName"], function (err, result) {
          if (err) {
            mainMenu();
          }
          let vent = new IonVent({ ionId: result.VentName, data: {} });
          ionList.push(vent);
          mainMenu();
        });
      } else if (answers.mainMenu === "Start Ion") {
        prompt.start();
        prompt.get(["VentName"], function (err, result) {
          if (err) {
            mainMenu();
          }
          startIon(result.VentName, mainMenu);
        });
      } else if (answers.mainMenu === "Start VentSetting") {
        prompt.start();
        prompt.get(["VentName"], function (err, result) {
          if (err) {
            mainMenu();
          }
          startVentSetting(result.VentName, mainMenu);
        });
      } else if (answers.mainMenu === "Stop VentSetting") {
        prompt.start();
        prompt.get(["VentName"], function (err, result) {
          if (err) {
            mainMenu();
          }
          stopVentSetting(result.VentName, mainMenu);
        });
      } else if (answers.mainMenu === "Start AlmSetting") {
        prompt.start();
        prompt.get(["VentName"], function (err, result) {
          if (err) {
            mainMenu();
          }
          startAlmSetting(result.VentName, mainMenu);
        });
      } else if (answers.mainMenu === "Stop AlmSetting") {
        prompt.start();
        prompt.get(["VentName"], function (err, result) {
          if (err) {
            mainMenu();
          }
          stopAlmSetting(result.VentName, mainMenu);
        });
      } else if (answers.mainMenu === "Stop Ion") {
        prompt.start();
        prompt.get(["VentName"], function (err, result) {
          if (err) {
            mainMenu();
          }
          stopIon(result.VentName, mainMenu);
        });
      } else if (answers.mainMenu === "Stop Therapy") {
        prompt.start();
        prompt.get(["VentName"], function (err, result) {
          if (err) {
            mainMenu();
          }
          stopTherapy(result.VentName, mainMenu);
        });
      } else if (answers.mainMenu === "Start Therapy") {
        prompt.start();
        prompt.get(["VentName"], function (err, result) {
          if (err) {
            mainMenu();
          }
          startTherapy(result.VentName, mainMenu);
        });
      } else if (answers.mainMenu === "List all vent") {
        listIons();
        mainMenu();
      } else if (answers.mainMenu === "Show running vents") {
        listLive(mainMenu);
      } else if (answers.mainMenu === "Remove all vents") {
        clearList(mainMenu);
      } else if (answers.mainMenu === "Delete ion") {
        console.log(chalk.yellow.bold("Enter ion id? e.g  Vent001"));
        prompt.start();
        prompt.get(["Ventid"], function (err, result) {
          if (err) {
            mainMenu();
          }

          deleteVent(result.Ventid, mainMenu);
        });
      } else if (answers.mainMenu === "Bulk Add") {
        console.log(
          chalk.yellow.bold("How many Ion do you want? e.g 20,50,1000, etc")
        );
        prompt.start();
        prompt.get(["count"], function (err, result) {
          if (err) {
            mainMenu();
          }
          createBulk(result.count, mainMenu);
        });
      } else if (answers.mainMenu === "Bulk Stop") {
        console.log(
          chalk.yellow.bold(
            "How many Ion do you want to stop? e.g 20,50,1000, etc"
          )
        );
        prompt.start();
        prompt.get(["count"], function (err, result) {
          if (err) {
            mainMenu();
          }
          stopBulk(result.count, mainMenu);
        });
      } else if (answers.mainMenu === "Bulk Start") {
        console.log(
          chalk.yellow.bold(
            "How many Ion do you want to start? e.g 20,50,1000, etc"
          )
        );
        prompt.start();
        prompt.get(["count"], function (err, result) {
          if (err) {
            mainMenu();
          }
          startBulk(result.count, mainMenu);
        });
      } else if (answers.mainMenu === "exit") {
      } else if (answers.mainMenu === "Start Monitoring Curve In Bulk") {
        console.log(
          chalk.yellow.bold(
            "Enter total number devices and time interval in miliseconds?"
          )
        );
        prompt.start();
        prompt.get(["count", "interval"], function (err, result) {
          if (err) {
            mainMenu();
          }
          startMonitoringCurveBulk(result.count, result.interval, mainMenu);
        });
      } else if (answers.mainMenu === "Stop Monitoring Curve In Bulk") {
        console.log(
          chalk.yellow.bold("How many Monitoring curve do you want to stop?")
        );
        prompt.start();
        prompt.get(["count"], function (err, result) {
          if (err) {
            mainMenu();
          }
          stopMonitoringCurveBulk(result.count, mainMenu);
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
const createBulk = async (count, done) => {
  let prifix = Prefix.stNm;
  let _count = count;
  let allIds = []; //[40, 100, 1, 5, 25, 10];
  let _lastVentId = 0;
  allIds = await ionList.map((id) => parseInt(id.ionId.match(/\d+/g)));
  _lastVentId = await Math.max.apply(Math, allIds);
  if (_lastVentId.toString() == "-Infinity") {
    _lastVentId = 0;
  }
  console.log(chalk.green.bold(_lastVentId));
  allIds.length = 0;
  await _lastVentId++;
  while (_count) {
    let ionId = prifix + _lastVentId++;
    let vent = await new IonVent({ ionId: ionId, data: {} });
    console.log(chalk.green.bold("[CREATING]:") + ionId);
    try {
      let response = await vent.initIon();
      if (response.status === 201) {
        console.log(chalk.yellow.bold("[OK"));
        await ionList.push(vent);
        await _count--;
      }
    } catch (err) {
      await _count--;
      console.log(console.log(chalk.red.bold("[CREATING]:FAILED") + ionId));
    }
  }
  console.log(chalk.green.bold(allIds));
  done();
};

const deleteVent = async (id, done) => {
  let vent = await ionList.find((vent, index) => vent.ionId === id);
  console.log(chalk.red.bold("[DELETING]:") + id);
  try {
    let response = await vent.deleteMe();
    if (response.status === 200) {
      let ventIndex = await ionList.findIndex(
        (vent, idex) => vent.ionId === id
      );
      ionList.splice(ventIndex, 1);
      console.log(chalk.yellow.bold("[OK"));
    }
  } catch (err) {
    console.log(console.log(chalk.red.bold("[DELETE]:FAILED") + id));
  }

  done();
};
const startBulk = async (count, done) => {
  let _count = count;
  if (_count <= ionList.length) {
    while (_count) {
      if (ionList[_count]) {
        ionList[_count].startAlarm(client);
      }
      _count--;
    }
  } else {
    console.log(chalk.red.bold(`Total Ion:${ionList.length}`));
  }
  done();
};
const stopBulk = async (count, done) => {
  let _count = count;
  if (_count <= ionList.length) {
    while (_count) {
      if (ionList[_count]) {
        ionList[_count].stopAlarm(client);
      }
      _count--;
    }
  } else {
    console.log(chalk.red.bold(`Total Ion:${ionList.length}`));
  }
  done();
};
const listIons = () => {
  let _ions = [];
  ionList.forEach((vent) => {
    _ions.push(vent.ionId);
  });
  console.log(chalk.green.bold(_ions));
};
const clearList = async (cb) => {
  let vent = await ionList[0];
  try {
    let response = await vent.deleteAll();
    if (response.status == 200) {
      console.log(chalk.red.bold("Ion list cleared out."));
      ionList.length = 0;
    } else {
      console.log(chalk.red.bold("Failed"));
    }
  } catch (Err) {
    console.log(chalk.red.bold("Failed"));
  }
  cb();
};
const stopIon = (ionId, done) => {
  let vent = ionList.find((ion) => ion.ionId === ionId);
  vent.stopAlarm(client);
  done();
};
const stopTherapy = (ionId, done) => {
  let vent = ionList.find((ion) => ion.ionId === ionId);
  vent.stopTherapy(client);
  done();
};
const stopVentSetting = (ionId, done) => {
  let vent = ionList.find((ion) => ion.ionId === ionId);
  vent.stopVentSetting();
  done();
};
const startVentSetting = (ionId, done) => {
  let vent = ionList.find((ion) => ion.ionId === ionId);
  vent.startVentSetting(client);
  done();
};
const stopAlmSetting = (ionId, done) => {
  let vent = ionList.find((ion) => ion.ionId === ionId);
  vent.stopAlmSetting();
  done();
};
const startAlmSetting = (ionId, done) => {
  let vent = ionList.find((ion) => ion.ionId === ionId);
  vent.startAlmSetting(client);
  done();
};

const startIon = (ionId, done) => {
  let vent = ionList.find((ion) => ion.ionId === ionId);
  vent.startAlarm(client);
  done();
};
const startTherapy = (ionId, done) => {
  let vent = ionList.find((ion) => ion.ionId === ionId);
  vent.startTherapy(client);
  done();
};
const listLive = (cb) => {
  ionList.forEach((vent) => {
    if (vent.doesAlmStrtd) {
      console.log(
        chalk.green.bold(`[${vent.ionId}]  `) + chalk.gray.bold(`RUNNING`)
      );
    }
  });
  cb();
};

const startMonitoringCurveBulk = async (count, interval, done) => {
  let _count = count;
  if (_count <= ionList.length) {
    while (_count) {
      if (ionList[_count]) {
        ionList[_count].startMonitoringCurve(client, interval);
      }
      _count--;
    }
  } else {
    console.log(chalk.red.bold(`Total Ion:${ionList.length}`));
  }
  done();
};

const stopMonitoringCurveBulk = async (count, done) => {
  let _count = count;
  if (_count <= ionList.length) {
    while (_count) {
      if (ionList[_count]) {
        ionList[_count].stopMonitoringCurve(client);
      }
      _count--;
    }
  } else {
    console.log(chalk.red.bold(`Total Ion:${ionList.length}`));
  }
  done();
};
