const express = require('express')
const router = express.Router()

const hoaDonController = require('../app/controllers/HoaDonController')

// /hoadon/...

router.post('/insert', hoaDonController.insert)

module.exports = router
