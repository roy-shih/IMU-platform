const fs = require("fs");
const path = require("path");
const { version, template } = require("./config");
// const install_apps = require("../install_apps");

const express = require("express");
const router = express.Router();

const control = require("./control");

// Public resource
router.use(express.static(__dirname + "/public"));

router.post(`/api/${version}/user/session`, (req, res, next) => {

});

// User Interface
router.get("/", (req, res) => {
  res.redirect("/dcs/");
});



module.exports = router;