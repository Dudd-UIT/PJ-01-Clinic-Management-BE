const express = require('express')
const router = express.Router()

const thuocController = require('../app/controllers/ThuocController')

// /thuoc/...

router.get('/getAll', thuocController.fetchAllThuoc)

module.exports = router
