const express = require("express");
const router = express.Router();

const AIController = require("../app/controllers/AIController");

router.post("/chanDoan", AIController.upload.single('image'), AIController.chanDoan);

module.exports = router;
