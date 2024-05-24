const express = require("express");
const router = express.Router();

const UserGroupController = require("../app/controllers/UserGroupController");

router.post("/insert", UserGroupController.insert);
router.post("/update", UserGroupController.update);
router.post("/delete", UserGroupController.deleteUserGroup);

module.exports = router;
