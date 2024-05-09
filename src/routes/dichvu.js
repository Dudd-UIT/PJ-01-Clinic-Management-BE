const express = require("express");
const router = express.Router();
const {checkUserJWT, checkUserPermission} = require('../middleware/JWTAction')

const dichvuController = require("../app/controllers/DichVuController");


router.get("/getAll", dichvuController.getAll);
router.get("/getAllLDV", dichvuController.getAllLDV);
router.post("/insert", dichvuController.insert);
router.post("/update", dichvuController.update);
router.post("/delete", dichvuController.deleteDichVu);




module.exports = router;
