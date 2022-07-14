const { version, route } = require("./config");
const express = require("express");
const router = express.Router();
const { HEART, BP, PPG, Temperature, AI } = require("./control");

router.use(express.static(__dirname + "/public"));

// User Interface
router.get("/", (req, res) => {
    res.render("dashboard/v2", { layout: "main", partials: () => { nav: "hi" }, doctor: true });
});

module.exports = router;
