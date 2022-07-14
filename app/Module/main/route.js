const fs = require("fs");
const path = require("path");
const { version, template } = require("./config");
// const install_apps = require("../install_apps");

const express = require("express");
const router = express.Router();

const control = require("./control");

// Public resource
router.use(express.static(__dirname + "/public"));

router.get("/login", ( req, res ) => {
  res.render("main_login", {layout: null});
})

router.post(`/api/${version}/user/session`, ( req, res, next ) => {

});

// User Interface
router.get("/", (req, res) => {
  res.redirect("/dcs/");
});

router.get("/user", (req, res) => {
  // res.render("user", {layout:null});
  res.redirect("/app/fsm")
});

router.get("/demo", (req, res) => {
  console.log(template);

  res.render("demo", { layout: "main", navbar: fs.readFileSync(path.resolve(template, "service/", "navbar.hbs"), "utf8") });
});


module.exports = router;