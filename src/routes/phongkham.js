const express = require("express");
const router = express.Router();

const phongKhamRouterController = require("../app/controllers/PhongKhamController");

router.get("/getAll", phongKhamRouterController.getAll);

module.exports = router;
