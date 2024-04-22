const express = require('express')
const router = express.Router()

const phieukhamController = require('../app/controllers/PhieuKhamController')

// /phieukham/...

router.post('/insert-pk', phieukhamController.insertPK)

module.exports = router
