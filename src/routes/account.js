const express = require("express");
const router = express.Router();

const accountController = require("../app/controllers/AccountController");

router.get("/getUserAccount", accountController.getUserAccount);

module.exports = router;
