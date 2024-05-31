const express = require("express");
const router = express.Router();

const DoctorController = require("../app/controllers/DoctorController");

router.get("/getAll", DoctorController.getAll);
router.post("/getByDate", DoctorController.getByDate);

module.exports = router;
