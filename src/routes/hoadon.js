const express = require('express')
const router = express.Router()

const hoaDonController = require('../app/controllers/HoaDonController')

// /hoadon/...

router.post('/insert', hoaDonController.insert)
router.post('/thanhtoan', hoaDonController.thanhToan)
router.get('/dshd/getById/:id', hoaDonController.fetchHDbyID)

module.exports = router
