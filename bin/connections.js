module.exports = {
  mqtt: {
    HOST: process.env.MQTT_HOST,
    username: process.env.MQTT_USER_NAME,
    password: process.env.MQTT_PASSWORD,
    port: process.env.MQTT_PORT,
  },
  DB: {
    HOST: process.env.DB_HOST,
    DBNAME: process.env.DB_NAME,
    USERNAME: process.env.DB_USER_NAME,
    PWD: process.env.DB_PASSWORD,
  },
};
