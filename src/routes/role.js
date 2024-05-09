const express = require("express");
const router = express.Router();

const roleRouterController = require("../app/controllers/RoleController");

router.get("/getAll", roleRouterController.getAll);
router.post("/getById", roleRouterController.getById);
router.post("/insert", roleRouterController.insert);
router.post("/update", roleRouterController.update);
router.post("/delete", roleRouterController.deleteRole);
router.post("/assignRoleToGroup", roleRouterController.assignRoleToGroup);


module.exports = router;
