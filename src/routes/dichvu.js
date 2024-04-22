const express = require("express");
const router = express.Router();

const dichvuController = require("../app/controllers/DichVuController");

router.get("/", dichvuController.index);


module.exports = router;
