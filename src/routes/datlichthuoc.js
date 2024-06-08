const express = require("express");
const router = express.Router();

const datLichThuocController = require("../app/controllers/DatLichThuocController");

// /datlichthuoc/...

router.get("/getAll/:id", datLichThuocController.getAll)
router.get("/getAllGioThuoc/:id", datLichThuocController.getAllGioThuoc);
router.post("/delete", datLichThuocController.deleteLichThuoc);
router.post("/update", datLichThuocController.update);

module.exports = router;
