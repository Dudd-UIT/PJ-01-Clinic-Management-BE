const express = require('express')
const router = express.Router()

const phieukhamController = require('../app/controllers/PhieuKhamController')

// /phieukham/...

router.post('/insert-pk', phieukhamController.insertPK)
router.post('/insert-bn-pk', phieukhamController.insertBNPK)
router.post('/insert-just-pk', phieukhamController.insertIustPK)
router.get('/dsdk', phieukhamController.fetchDSDK)
router.get('/chitiet-pk/:id', phieukhamController.fetchKQKham)
router.get('/ds-benh/:id', phieukhamController.fetchDSBenh)

module.exports = router
