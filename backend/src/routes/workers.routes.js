const express = require('express')
const workersController = require('../controllers/workers.controller')
const auth = require('../middlewares/auth')
const requireRole = require('../middlewares/requireRole')
const validate = require('../middlewares/validate')
const {
  createWorkerSchema,
  updateWorkerSchema,
  resetWorkerPinSchema,
} = require('../validators/workers.validator')

const router = express.Router()

router.use(auth, requireRole('contractor'))

router.get('/', workersController.list)
router.post('/', validate(createWorkerSchema), workersController.create)
router.put('/:id', validate(updateWorkerSchema), workersController.update)
router.put('/:id/pin', validate(resetWorkerPinSchema), workersController.resetPin)
router.delete('/:id', workersController.remove)

module.exports = router
