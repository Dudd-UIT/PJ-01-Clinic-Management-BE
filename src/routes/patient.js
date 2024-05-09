const express = require('express')
const router = express.Router()

const patientController = require('../app/controllers/PatientController')


router.post('/insert', patientController.store)
router.get('/getAll', patientController.getAll)
router.get('/get-by-id/:id', patientController.getByID)


module.exports = router
