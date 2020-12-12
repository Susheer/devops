require("dotenv").config();
var express = require("express");
const { MongoClient } = require("mongodb");
var chalk = require("chalk");
var Prefix = require("./bin/prefix.json");
var cors = require("cors");
var bodyParser = require("body-parser");
var machine = require("./machine_blueprint.json");
var connection = require("./bin/connections");
var app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());
var client = null;
var MachineCollection = null;
let vents = [];
app.get("/vent", (req, res) => {
  console.log(chalk.green.bold("[GET]:") + "Accepet");
  res.send(vents);
  console.log(chalk.green.bold("[GET]:") + "END");
});
app.post("/vent", (req, res) => {
  console.log(chalk.green.bold("[POST]:") + "Accepet");
  if (req.body && req.body.ionId) {
    machine.name = req.body.ionId;
    machine._id = req.body.ionId.toLocaleLowerCase();
    machine.mqttConnections = {
      HOMEMONITORING: `ION/${machine.name}/HOMEMONITORING`,
      STARTSTOP: `ION/${machine.name}/STARTSTOP`,
      SSTARTSTOP: `ION/${machine.name}/SSTARTSTOP`,
    };
    MachineCollection.insertOne(machine, function (err, response) {
      if (err) {
        console.log("err", err);
        res.status(500);
        console.log(
          chalk.green.bold("[POST]:") +
            chalk.red.bold(`${req.body.ionId} FAILED`)
        );
        return res.send("ok");
      } else {
        res.status(201);
        console.log(
          chalk.green.bold("[POST]:") +
            chalk.green.bold(`${req.body.ionId} CREATED`)
        );
        return res.send("ok");
      }
    });
  }
});
app.post("/vent/delete", (req, res) => {
  console.log(chalk.green.bold("[DELETE]:") + "Accepet", req.body);
  if (req.body && req.body.ionId) {
    MachineCollection.deleteOne(
      { _id: req.body.ionId.toLocaleLowerCase() },
      function (err, response) {
        if (err) {
          res.status(500);
          console.log(
            chalk.green.bold("[DELETE]:") +
              chalk.red.bold(`${req.body.ionId} FAILED`)
          );
          return res.send("ok");
        } else {
          res.status(200);
          console.log(
            chalk.green.bold("[DELETE]:") +
              chalk.green.bold(`${req.body.ionId} OK`)
          );
          return res.send("ok");
        }
      }
    );
  }
});
app.delete("/vent/all", (req, res) => {
  console.log(chalk.green.bold("[DELETE]:/vent/all") + "Accepet");
  let prefix = `${Prefix.stNm}`;
  MachineCollection.deleteMany(
    { name: { $regex: prefix } },
    function (err, response) {
      if (err) {
        res.status(500);
        console.log(
          chalk.green.bold("[DELETE]:/vent/all") + chalk.red.bold(`FAILED-`)
        );
        return res.send("ok");
      } else {
        res.status(200);
        console.log(
          chalk.green.bold("[DELETE]:/vent/all") + chalk.yellow.bold(`OK`)
        );
        return res.send("ok");
      }
    }
  );
});

app.listen(4000, async () => {
  console.log(chalk.green.bold("Test is runing at 4000"));
  let userCRD = "";
  if (connection.DB.USERNAME && connection.DB.PWD) {
    userCRD = `${connection.DB.USERNAME}:${connection.DB.PWD}@`;
  }

  let uri = "";
  if (userCRD) {
    uri = `mongodb://${userCRD}${connection.DB.HOST}/${connection.DB.DBNAME}`;
  } else {
    uri = `mongodb://${connection.DB.HOST}/${connection.DB.DBNAME}`;
  }
  client = await new MongoClient(uri, { useUnifiedTopology: true }).connect();
  await client
    .connect({})
    .then((res) => {
      console.log(chalk.yellow.bold("Database  connected"));
      const database = client.db("abmVentilator");
      MachineCollection = database.collection("machine");
    })
    .catch((error) => {
      console.log(chalk.red.bold("Database could not be connected"));
      console.log(chalk.red.bold("[STOPPING]:localhost:4000", error));
      process.exit(0);
    });
});
