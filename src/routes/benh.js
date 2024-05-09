const express = require("express");
const router = express.Router();

const benhController = require("../app/controllers/BenhController");

router.get("/getAll", benhController.getAll);
router.post("/insert", benhController.insert);
router.post("/update", benhController.update);
router.post("/delete", benhController.deleteBenh);

module.exports = router;
