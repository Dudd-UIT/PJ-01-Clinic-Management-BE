const express = require('express')
const router = express.Router()

const customerController = require('../app/controllers/CustomerController')

// /customer/...

router.post('/store', customerController.store)
router.get('/', customerController.index)

// router.get('/:id/edit', customerController.edit)
// router.post('/handle-form-actions', customerController.handleFormActions)
// router.put('/:id', customerController.update)
// router.patch('/:id/restore', customerController.restore)
// router.delete('/:id', customerController.delete)
// router.delete('/:id/force', customerController.deleteForce)
// router.get('/:slug', customerController.show)

module.exports = router
