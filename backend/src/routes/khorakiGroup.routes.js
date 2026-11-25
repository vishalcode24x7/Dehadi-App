const express = require('express')
const auth = require('../middlewares/auth')
const requireRole = require('../middlewares/requireRole')
const validate = require('../middlewares/validate')
const controller = require('../controllers/khorakiGroup.controller')
const {
  createKhorakiGroupSchema,
  addGroupEntrySchema,
  divideGroupSchema,
} = require('../validators/khorakiGroup.validator')

const router = express.Router()

router.use(auth, requireRole('contractor'))
router.get('/', controller.list)
router.post('/', validate(createKhorakiGroupSchema), controller.create)
router.post(
  '/:id/entries',
  validate(addGroupEntrySchema),
  controller.addEntry,
)
router.post('/:id/divide', validate(divideGroupSchema), controller.divide)

module.exports = router
