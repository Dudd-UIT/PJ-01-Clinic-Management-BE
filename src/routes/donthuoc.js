const express = require('express')
const router = express.Router()

const donThuocController = require('../app/controllers/DonThuocController')

// /donthuoc/...

router.get('/ds-thuoc/:id', donThuocController.fetchDSThuoc)
router.post('/insert', donThuocController.insert)
router.post('/insert-ctdt', donThuocController.insertCTDT)

module.exports = router
