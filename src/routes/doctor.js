const express = require('express')
const router = express.Router()

const DoctorController = require('../app/controllers/DoctorController')

router.get('/', DoctorController.index)


module.exports = router
