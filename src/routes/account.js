const express = require("express");
const router = express.Router();

const accountController = require("../app/controllers/AccountController");

router.get("/getUserAccount", accountController.getUserAccount);
router.get("/getAllAccount", accountController.getAllAccount);
router.get("/getAllUserGroup", accountController.getAllUserGroup);
router.post("/login", accountController.login);
router.post("/logout", accountController.logout);
router.post("/changePassword", accountController.changePassword);
router.post("/insert", accountController.registerAccount);
router.post("/updateTTCN", accountController.updateAccountTTCN);
router.post("/updateTTTK", accountController.updateAccountTTTK);
router.post("/delete", accountController.deleteAccount);


module.exports = router;
