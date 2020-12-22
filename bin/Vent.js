var chalk = require("chalk");
const axios = require("axios");
var CONSTANT = require("./constants");
module.exports = class IonVent extends (
  Object
) {
  constructor({ ionId, data, connection }) {
    super();
    this.log = console.log;
    this.ionId = ionId;
    this.data = data;
    this.intervalId = null;
    this.therapyIntervalId = null;
    this.interval = 1000;
    this.date = new Date();
    this.doesAlmStrtd = false;
    this.doesTherapyStarted = false;
    this.doesVentSettingStarted = false;
    this.ventSettingIntervalId = null;
    this.doesAlmSettingStarted = false;
    this.almSettingIntervalId = null;
    this.doesCurveStarted = false;
  }
  toString() {
    console.info(this.ionId);
  }
  async deleteMe() {
    return axios.post("http://localhost:4000/vent/delete", {
      ionId: this.ionId,
      data: this.doesAlmStrtd,
    });
  }
  async deleteAll() {
    return axios.delete("http://localhost:4000/vent/all", {
      ionId: this.ionId,
      data: this.doesAlmStrtd,
    });
  }

  async initIon() {
    return axios.post("http://localhost:4000/vent", {
      ionId: this.ionId,
      data: this.doesAlmStrtd,
    });
  }

  //startVentSetting

  startAlarm(mqttClient) {
    if (!mqttClient) {
      console.log(chalk.red.bold(`No MQTT CLIENT FOUND${this.ionId}`));
      return;
    }
    if (this.doesAlmStrtd) {
      this.log(chalk.white.bold(`(${this.ionId})'s alarm already started.`));
    } else {
      this.log(chalk.yellow.bold(`(${this.ionId})'s alarm started now.`));

      this.intervalId = setInterval(() => {
        let randIndex = Math.floor(Math.random() * 4);
        //this.log(chalk.green.bold(`RndindexValue${randIndex}`));
        let alarm = CONSTANT[randIndex];

        let c_alarm = alarm.Title[randIndex];

        let Severity = alarm.id;
        let data = {
          deviceId: this.ionId,
          Severity: Severity,
          c_alarm: c_alarm,
          BedID: "XD34A",
          RoomID: "34A",
          currentDateTime: new Date().toLocaleTimeString(),
        };
        // this.log("alarm--",data);
        //this.log(chalk.green.bold(`Data${data}`));
        mqttClient.publish(
          `ION/${this.ionId}/CURRENTALARM`,
          JSON.stringify(data),
          () => {}
        );
        mqttClient.publish(
          `ION/${this.ionId}/ALLALARM`,
          JSON.stringify({
            ALLALARM: [
              "High Tid Vol 1 07:57 am  2",
              "OCCLUSION 0 07:57 am 07:57 1",
              "OCCLUSION 0 07:57 am 07:57 1",
              "OCCLUSION 0 07:57 am 07:57 1",
              "UIB COM Fail 0 07:56 am 07:56 1",
              "High Min Vol 0 07:46 am 07:46 2",
            ],
          }),
          () => {}
        );
        this.doesAlmStrtd = true;
      }, this.interval);
    }
  }

  startTherapy(mqttClient) {
    if (!mqttClient) {
      console.log(chalk.red.bold(`No MQTT CLIENT FOUND${this.ionId}`));
      return;
    }
    if (this.doesAlmStrtd) {
      if (this.doesTherapyStarted) {
        this.log(
          chalk.white.bold(`(${this.ionId})'s therapy already started.`)
        );
      } else {
        this.log(chalk.yellow.bold(`(${this.ionId})'s therapy started now.`));

        this.therapyIntervalId = setInterval(() => {
          let randDigit = Math.floor(Math.random() * 3);
          //this.log(chalk.green.bold(`RndindexValue${randIndex}`));

          let data = {
            BR: randDigit,
            IER: randDigit + 1,
            IP: randDigit + 2,
            IT: randDigit + 3,
            MV: randDigit + 4,
            PP: randDigit + 5,
            SBR: randDigit + 6,
            TV: randDigit + 7,
            SPO2: randDigit + 8,
          };
          // this.log("alarm--",data);
          //this.log(chalk.green.bold(`Data${data}`));
          mqttClient.publish(
            `ION/${this.ionId}/HOMEMONITORING`,
            JSON.stringify(data),
            () => {
              //console.log("Topic:",`ION/${this.ionId}/HOMEMONITORING`,"published")
            }
          );
          this.doesTherapyStarted = true;
        }, 1000);
      }
    } else {
      this.log(
        chalk.white.bold(
          `No alarm running for (${this.ionId}). therapy can not be started.`
        )
      );
    }
  }
  stopAlarm(clientmq) {
    clientmq.unsubscribe("CURRENTALARM", () => {
      // this.log(chalk.yellow.bold(`(${this.ionId})'s  unsubscribe now.`));
    });
    clearInterval(this.intervalId);
    this.doesAlmStrtd = false;
    this.log(chalk.red.bold(`[${this.ionId}] alarm has been stopped.`));
  }
  startVentSetting(mqttClient) {
    if (!mqttClient) {
      console.log(chalk.red.bold(`No MQTT CLIENT FOUND${this.ionId}`));
      return;
    }
    if (this.doesAlmStrtd) {
      if (this.doesVentSettingStarted) {
        this.log(
          chalk.white.bold(`(${this.ionId})'s vent setting already running.`)
        );
      } else {
        this.log(
          chalk.yellow.bold(`(${this.ionId})'s vent setting  running now.`)
        );

        this.ventSettingIntervalId = setInterval(() => {
          let randDigit = Math.floor(Math.random() * 3);
          //this.log(chalk.green.bold(`RndindexValue${randIndex}`));

          let data = {
            BR: randDigit + 1,
            CktType: randDigit + 2,
            ExpTrig: randDigit + 3,
            InspP: randDigit + 4,
            InspT: randDigit + 1,
            InspTrig: randDigit + 3,
            PEEP: randDigit + 5,
            PSUP: randDigit + 1,
            PType: randDigit + 2,
            RiseT: randDigit + 2,
            TV: randDigit + 4,
            VBrthOpt: randDigit + 1,
            VMode: randDigit + 5,
          };
          // this.log("alarm--",data);
          //this.log(chalk.green.bold(`Data${data}`));
          mqttClient.publish(
            `ION/${this.ionId}/VENTSETTINGS`,
            JSON.stringify(data),
            () => {}
          );
          this.doesVentSettingStarted = true;
        }, 6000);
      }
    } else {
      this.log(
        chalk.white.bold(
          `No alarm running for (${this.ionId}). therapy can not be started.`
        )
      );
    }
  }
  startAlmSetting(mqttClient) {
    if (!mqttClient) {
      console.log(chalk.red.bold(`No MQTT CLIENT FOUND${this.ionId}`));
      return;
    }
    if (this.doesAlmStrtd) {
      if (this.doesAlmSettingStarted) {
        this.log(
          chalk.white.bold(`(${this.ionId})'s alarm setting already running.`)
        );
      } else {
        this.log(
          chalk.yellow.bold(`(${this.ionId})'s alarm setting  running now.`)
        );
        this.almSettingIntervalId = setInterval(() => {
          let randDigit = Math.floor(Math.random() * 10);
          //this.log(chalk.green.bold(`RndindexValue${randIndex}`));
          let data = {
            APN: randDigit,
            APNBR: randDigit,
            BR_H: randDigit,
            BR_L: randDigit,
            CKTD: randDigit,
            FIO2_H: 0,
            FIO2_L: 0,
            MV_H: 0,
            MV_L: 0,
            PEEP_H: randDigit,
            PEEP_L: randDigit > 0 ? randDigit - 1 : randDigit,
            P_H: randDigit,
            P_L: randDigit > 0 ? randDigit - 1 : randDigit,
            SPO2_H: 0,
            SPO2_L: 0,
            TV_H: randDigit,
            TV_L: randDigit > 0 ? randDigit - 1 : randDigit,
          };
          // this.log("alarm--",data);
          //this.log(chalk.green.bold(`Data${data}`));
          mqttClient.publish(
            `ION/${this.ionId}/ALARMSSETTING`,
            JSON.stringify(data),
            () => {}
          );
          this.doesAlmSettingStarted = true;
        }, 6000);
      }
    } else {
      this.log(
        chalk.white.bold(
          `No alarm running for (${this.ionId}). No Alarm new alarm settings can be applied.`
        )
      );
    }
  }
  stopVentSetting(clientmq) {
    clearInterval(this.ventSettingIntervalId);
    this.doesVentSettingStarted = false;
    this.log(chalk.red.bold(`[${this.ionId}] vent setting has been stopped.`));
  }
  stopAlmSetting(clientmq) {
    clearInterval(this.almSettingIntervalId);
    this.doesAlmSettingStarted = false;
    this.log(chalk.red.bold(`[${this.ionId}] alarm setting has been stopped.`));
  }
  stopTherapy(clientmq) {
    clearInterval(this.therapyIntervalId);
    this.doesTherapyStarted = false;
    this.log(chalk.red.bold(`[${this.ionId}] therapy has been stopped.`));
  }

  startMonitoringCurve(mqttClient, interval) {
    if (!mqttClient) {
      console.log(chalk.red.bold(`No MQTT CLIENT FOUND${this.ionId}`));
      return;
    }
    if (this.doesCurveStarted) {
      this.log(
        chalk.white.bold(`(${this.ionId})'s monitoring curve already started.`)
      );
    } else {
      this.log(
        chalk.yellow.bold(`(${this.ionId})'s monitoring curve started now.`)
      );
      this.intervalId = setInterval(() => {
        function randomNumber(min, max) {
          return Math.floor(Math.random() * (max - min) + min);
        }
        // let x = randomNumber(0, 2);
        let ventiltr = {
          IP: randomNumber(20, 60),
          FL: randomNumber(-60, 60),
          VL: randomNumber(0, 400),
        };
        mqttClient.publish(
          `ION/${this.ionId}/CURVEMONITORING`,
          JSON.stringify(ventiltr),
          () => {}
        );

        // mqttClient.publish(`ION/${this.ionId}/STARTSTOP`, JSON.stringify({ VSTATE: x ? "true" : "false" }), () => {
        // });
        this.doesCurveStarted = true;
      }, interval);
    }
  }
  stopMonitoringCurve(clientmq) {
    clientmq.unsubscribe("CURVEMONITORING", () => {
      //this.log(chalk.yellow.bold(`(${this.ionId})'s CURVEMONITORING unsubscribed now.`));
    });
    clearInterval(this.intervalId);
    this.doesCurveStarted = false;
    this.log(
      chalk.red.bold(`[${this.ionId}]'s monitoring curve has been stopped.`)
    );
  }
};
