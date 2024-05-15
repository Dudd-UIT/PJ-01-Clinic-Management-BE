const express = require("express");
const router = express.Router();

const clsController = require("../app/controllers/ClsController");

// /cls/...

router.get("/ds-cls/getById/:id", clsController.fetchClsById);
router.get("/getAll", clsController.fetchAllCls);
router.post("/insert-just-cls", clsController.insertIustCLS);
router.post("/update-cls", clsController.updateCls);

module.exports = router;
