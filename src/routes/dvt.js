const express = require("express");
const router = express.Router();

const dvtController = require("../app/controllers/DVTController");

router.get("/getAll", dvtController.getAll);
router.post("/insert", dvtController.insert);
router.post("/update", dvtController.update);
router.post("/delete", dvtController.deleteDVT);

module.exports = router;
