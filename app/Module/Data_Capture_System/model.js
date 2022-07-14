// const schema = "seal_irb";
// const HEART = {
//   fields: [
//     { name: "pid", type: "VARCHAR(64)" },
//     { name: "hr", type: "TEXT" },
//     { name: "spo2", type: "TEXT" },
//     { name: "date", type: "DATETIME" }, // user input date
//     { name: "sys", type: "DATETIME", default: "CURRENT_TIMESTAMP" }, // system time
//   ]
// };

// /*
// CREATE TABLE  `heart` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `pid` VARCHAR(64) NULL,
//   `hr` TEXT NULL,
//   `spo2` TEXT NULL,
//   `date` DATETIME NULL,
//   `sys` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`));
// */

// // BloodPresure_MODEL
// const BP = {
//   fields: [
//     { name: "pid", type: "VARCHAR(64)" },
//     { name: "dbp", type: "TEXT" },
//     { name: "sbp", type: "TEXT" },
//     { name: "map", type: "TEXT" },
//     { name: "date", type: "DATETIME" }, // user input date
//     { name: "sys", type: "DATETIME", default: "CURRENT_TIMESTAMP" }, // system time
//   ]
// };

// /*
// CREATE TABLE `seal_irb`.`bp` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `pid` VARCHAR(64) NULL,
//   `dbp` TEXT NULL,
//   `sbp` TEXT NULL,
//   `map` TEXT NULL,
//   `date` DATETIME NULL,
//   `sys` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`));
// */

// // const ECG / EKG
// const PPG = {
//   fields: [
//     { name: "pid", type: "VARCHAR(64)" },
//     { name: "value", type: "TEXT" },
//     { name: "date", type: "DATETIME" }, // user input date
//     { name: "sys", type: "DATETIME", default: "CURRENT_TIMESTAMP" }, // system time
//   ]
// }
// /*
// CREATE TABLE `seal_irb`.`ppg` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `pid` VARCHAR(64) NULL,
//   `value` TEXT NULL,
//   `date` DATETIME NULL,
//   `sys` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`));
// */

// const Temperature = {
//   fields: [
//     { name: "pid", type: "VARCHAR(64)" },
//     { name: "temp", type: "TEXT" },
//     { name: "date", type: "DATETIME" }, // user input date
//     { name: "sys", type: "DATETIME", default: "CURRENT_TIMESTAMP" }, // system time
//   ]
// }

// const RESP = {
//   fields: [
//     { name: "pid", type: "VARCHAR(64)" },
//     { name: "Resp", type: "TEXT" },
//     { name: "date", type: "DATETIME" }, // user input date
//     { name: "sys", type: "DATETIME", default: "CURRENT_TIMESTAMP" }, // system time
//   ]
// }

// const AI = {
//   fields: [
//     { name: "pid", type: "VARCHAR(64)" },
//     { name: "AIName", type: "VARCHAR(64)" },
//     { name: "AIValue", type: "TEXT" },
//     { name: "date", type: "DATETIME" }, // user input date
//     { name: "sys", type: "DATETIME", default: "CURRENT_TIMESTAMP" }, // system time
//   ]
// }
// /*
// CREATE TABLE `seal_irb`.`temperature` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `pid` VARCHAR(64) NULL,
//   `temp` TEXT NULL,
//   `date` DATETIME NULL,
//   `sys` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`));
// */


// module.exports = { HEART, BP, PPG, Temperature, RESP, AI };