const express = require("express");
const router = express.Router();

const phieukhamController = require("../app/controllers/PhieuKhamController");

// /phieukham/...

router.post("/insert-pk", phieukhamController.insertPK);
router.post("/insert-bn-pk", phieukhamController.insertBNPK);
router.post("/insert-just-pk", phieukhamController.insertIustPK);
router.post("/update-trang-thai", phieukhamController.updateTrangThai);
router.get("/dsdk", phieukhamController.fetchDSDK);
router.get("/chitiet-pk/getById/:id", phieukhamController.fetchKQKham);
router.get("/dspk/getById/:id", phieukhamController.fetchPKbyIdHD);
router.get("/ds-benh/getById/:id", phieukhamController.fetchDSBenh);

module.exports = router;
