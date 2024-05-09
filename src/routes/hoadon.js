const express = require('express')
const router = express.Router()

const hoaDonController = require('../app/controllers/HoaDonController')

// /hoadon/...

router.post('/insert', hoaDonController.insert)
router.get('/dshd-by-id/:id', hoaDonController.fetchHDbyID)

module.exports = router
