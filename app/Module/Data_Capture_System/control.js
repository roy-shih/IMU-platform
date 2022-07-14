// require("dotenv").config();
// const Database = require("../sql-database/index.js");
// const { HEART, BP, PPG, Temperature, RESP, AI } = require("./model");
// const SQL_CONFIG = {
//   host: process.env['DB_HOST'] || "db",
//   user: process.env['DB_USER'] || "root",
//   password: process.env['DB_PASSWORD'] || "default_root_password",
//   schema: process.env['DB_SCHEMA'] || "seal_irb",
// };

// const Heart = new Database(Object.assign(HEART, SQL_CONFIG)),
//   BloodPressure = new Database(Object.assign(BP, SQL_CONFIG)),
//   PPGData = new Database(Object.assign(PPG, SQL_CONFIG)),
//   TemperatureData = new Database(Object.assign(Temperature, SQL_CONFIG)),
//   Resp = new Database(Object.assign(RESP, SQL_CONFIG)),
//   Ai = new Database(Object.assign(AI, SQL_CONFIG));


// module.exports = {
//   HEART: Heart,
//   BP: BloodPressure,
//   PPG: PPGData,
//   Temperature: TemperatureData,
//   Resp: Resp,
//   AI: Ai,
// }