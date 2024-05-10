const express = require('express')
const router = express.Router()

const loThuocController = require('../app/controllers/LoThuocController')

router.get('/getAll', loThuocController.getAll)
router.post('/insert', loThuocController.insert)
router.post('/update', loThuocController.update)
router.post('/delete', loThuocController.deleteLoThuoc)

module.exports = router
