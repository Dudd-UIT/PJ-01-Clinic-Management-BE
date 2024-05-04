const express = require("express");
const router = express.Router();

const accountController = require("../app/controllers/AccountController");

router.get("/getUserAccount", accountController.getUserAccount);
router.get("/getUserInfo", accountController.getUserInfo);
router.post("/login", accountController.login);
router.post("/logout", accountController.logout);


module.exports = router;
