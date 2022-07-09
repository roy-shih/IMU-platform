const { version, route } = require("./config");
const express = require("express");
const router = express.Router();
const { HEART, BP, PPG, Temperature, AI } = require("./control");

router.use(express.static(__dirname + "/public"));

// User Interface
router.get("/", (req, res) => {
    res.render("dashboard/v2", { layout: "main", partials: () => { nav: "hi" } });
});
// Personal page
router.get("/:pid", (req, res) => {
    res.render("dashboard/v2_personal", { layout: "main", partials: () => { nav: "hi" }, pid: req.params.pid });
})

// API
router.get(`/api/${version}/patient/:pid/heart`, (req, res) => {
    HEART.query("SELECT * FROM dcs_HEART WHERE pid = ?", [req.params.pid])
        .then(({ error, rows }) => {
            res.json(rows);
        });
});

router.post(`/api/${version}/patient/:pid/heart`, (req, res) => {
    let sql = "INSERT INTO dcs_HEART (pid, hr, spo2, date) VALUES (?, ?, ?, ?)";
    let data = [req.params.pid, req.body.hr, req.body.spo2, req.body.date];
    HEART.query(sql, data);
});

router.put(`/api/${version}/patient/:pid/heart`, (req, res) => {
    let sql = "UPDATE dcs_HEART SET hr = ?, spo2 = ?, date = ? WHERE pid = ?";
    let data = [req.body.hr, req.body.spo2, req.body.date, req.params.pid];
    HEART.query(sql, data);
});

router.delete(`/api/${version}/patient/:pid/heart`, (req, res) => {
    let sql = "DELETE FROM dcs_HEART WHERE pid = ?";
    let data = [req.params.pid];
    HEART.query(sql, data);
});

router.get(`/api/${version}/patient/:pid/bp`, (req, res) => {
    BP.query("SELECT * FROM dcs_BP WHERE pid = ?", [req.params.pid])
        .then((rows) => {
            res.json(rows);
        });
});

router.post(`/api/${version}/patient/:pid/bp`, (req, res) => {
    let sql = "INSERT INTO dcs_BP (pid, dbp, sbp, map, date) VALUES (?, ?, ?, ?, ?)";
    let data = [req.params.pid, req.body.dbp, req.body.sbp, req.body.map, req.body.date];
    BP.query(sql, data);
});

router.put(`/api/${version}/patient/:pid/bp`, (req, res) => {
    let sql = "UPDATE dcs_BP SET dbp = ?, sbp = ?, map = ?, date = ? WHERE pid = ?";
    let data = [req.body.dbp, req.body.sbp, req.body.map, req.body.date, req.params.pid];
    BP.query(sql, data);
});

router.delete(`/api/${version}/patient/:pid/bp`, (req, res) => {
    let sql = "DELETE FROM dcs_BP WHERE pid = ?";
    let data = [req.params.pid];
    BP.query(sql, data);
});

// create ECG CRUD
router.get(`/api/${version}/patient/:pid/ppg`, (req, res) => {
    PPG.query("SELECT * FROM dcs_PPG WHERE pid = ?", [req.params.pid])
        .then((rows) => {
            res.json(rows);
        });
});

router.post(`/api/${version}/patient/:pid/ppg`, (req, res) => {
    let sql = "INSERT INTO dcs_PPG (pid, ecg, date) VALUES (?, ?, ?)";
    let data = [req.params.pid, req.body.ecg, req.body.date];
    PPG.query(sql, data);
});

router.put(`/api/${version}/patient/:pid/ppg`, (req, res) => {
    let sql = "UPDATE dcs_PPG SET ppg = ?, date = ? WHERE pid = ?"; // not very sure about this
    let data = [req.body.ppg, req.body.date, req.params.pid];
    PPG.query(sql, data);
});

router.delete(`/api/${version}/patient/:pid/ppg`, (req, res) => {
    let sql = "DELETE FROM dcs_PPG WHERE pid = ?";
    let data = [req.params.pid];
    PPG.query(sql, data);
});

//temperature API

// AI API
// router.get(`/api/${version}/patient/:pid/bp`, (req, res) => {

router.get(`/api/${version}/patient/:pid/:AiName`, (req, res) => {
    let { pid, AiName } = req.params;
    let sql = `SELECT * FROM ${AiName} WHERE pid = ?`;
    let data = [pid];
    AI.query(sql, data)
        .then((rows) => {
            res.json(rows);
        }
        ).catch((err) => {
            console.log(err);
        });
})


// router.get(`/api/${version}/patient/data/:id`, async(req, res) => {
//     res.send({ id: req.params.id });
// });

// router.post(`/api/${version}/patient/:id/hr`, (req, res) => {
//     res.send({ id: req.parame.id });
// });

module.exports = router;
