const express = require("express");
const router = express.Router();

const LDVController = require("../app/controllers/LDVController");

router.post("/insert", LDVController.insert);
router.post("/update", LDVController.update);
router.post("/delete", LDVController.deleteLDV);

module.exports = router;
