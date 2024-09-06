const express = require("express");
const router = express.Router();
const { notify, teste } = require("../controllers/notificationsController");

router.route("/").post(notify);

router.route("/teste").get(teste);

module.exports = router;
