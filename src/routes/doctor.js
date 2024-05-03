const express = require('express')
const router = express.Router()

const DoctorController = require('../app/controllers/DoctorController')

router.get('/getAll', DoctorController.getAll)


module.exports = router
