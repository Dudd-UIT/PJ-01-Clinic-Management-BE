const express = require('express')
const router = express.Router()

const thongkeController = require('../app/controllers/ThongKeController')

router.get('/dichvu/tt-db', thongkeController.dichVuKham)
router.get('/dichvu/cls', thongkeController.dichVuCLS)
router.get('/benh', thongkeController.benh)
router.get('/thuoc', thongkeController.thuoc)
router.get('/doanhthu-luotkhach', thongkeController.doanhThuLuotKhach)
router.get('/chatluong', thongkeController.chatLuong)

module.exports = router
