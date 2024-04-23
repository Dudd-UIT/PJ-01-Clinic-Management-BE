const express = require('express')
const router = express.Router()

const phieukhamController = require('../app/controllers/PhieuKhamController')

// /phieukham/...

router.post('/insert-pk', phieukhamController.insertPK)
router.post('/insert-bn-pk', phieukhamController.insertBNPK)
router.get('/dsdk', phieukhamController.fetchDSDK)


module.exports = router
