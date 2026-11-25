const express = require('express')
const authController = require('../controllers/auth.controller')
const validate = require('../middlewares/validate')
const auth = require('../middlewares/auth')
const authRateLimit = require('../middlewares/rateLimit')
const {
  registerSchema,
  pinLoginSchema,
  pinChangeSchema,
} = require('../validators/auth.validator')

const router = express.Router()

router.post(
  '/register',
  authRateLimit,
  validate(registerSchema),
  authController.register,
)
router.post(
  '/login-pin',
  authRateLimit,
  validate(pinLoginSchema),
  authController.loginPin,
)
router.get('/me', auth, authController.me)
router.put('/pin', auth, validate(pinChangeSchema), authController.changePin)

module.exports = router
