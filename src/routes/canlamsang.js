const express = require("express");
const router = express.Router();

const clsController = require("../app/controllers/ClsController");

// /cls/...

router.get("/ds-cls/getById/:id", clsController.fetchClsById);
router.get("/getAll", clsController.fetchAllCls);
router.post("/insert-just-cls", clsController.insertIustCLS);

module.exports = router;
