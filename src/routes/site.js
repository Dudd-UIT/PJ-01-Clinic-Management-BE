const express = require('express')
const router = express.Router()

const siteController = require('../app/controllers/SiteController')

router.get('/search', siteController.search)
router.get('/', siteController.index)
router.get('/tiepdon', siteController.tiepdon)


module.exports = router
