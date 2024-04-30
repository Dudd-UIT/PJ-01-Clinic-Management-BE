const express = require("express");
const router = express.Router();
const {checkUserJWT, checkUserPermission} = require('../middleware/JWTAction')

const dichvuController = require("../app/controllers/DichVuController");


router.get("/getAll", dichvuController.getAll);


module.exports = router;
