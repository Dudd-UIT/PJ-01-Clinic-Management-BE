const express = require('express')
const router = express.Router()

const thuocController = require('../app/controllers/ThuocController')

router.get('/keDon/getAll', thuocController.fetchAllThuoc)
router.get('/getAll', thuocController.getAll)
router.post('/insert', thuocController.insert)
router.post('/update', thuocController.update)
router.post('/delete', thuocController.deleteThuoc)

module.exports = router
