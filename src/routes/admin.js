const express = require("express");
const router = express.Router();

const adminController = require("../app/controllers/AdminController");

router.get("/getThamSo", adminController.getThamSo);
router.post("/updateThamSo", adminController.updateThamSo);


module.exports = router;
