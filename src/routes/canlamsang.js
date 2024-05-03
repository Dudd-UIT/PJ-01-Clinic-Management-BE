const express = require('express')
const router = express.Router()

const clsController = require('../app/controllers/ClsController')

// /cls/...

router.get('/ds-cls/:id', clsController.fetchClsById)
router.get('/getAll', clsController.fetchAllCls)

module.exports = router
