const multer = require("multer");
const express = require("express");
const router = express.Router();

const clsController = require("../app/controllers/ClsController");
const upload = require("../middleware/multer");

// /cls/...

router.get("/ds-cls/getById/:id", clsController.fetchClsById);
router.get("/getAll", clsController.fetchAllCls);
router.post("/insert-just-cls", clsController.insertIustCLS);
router.post("/update-cls", upload.single("image"), clsController.updateCls);

module.exports = router;
