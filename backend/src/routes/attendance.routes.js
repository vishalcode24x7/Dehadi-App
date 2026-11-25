const express = require('express')
const attendanceController = require('../controllers/attendance.controller')
const auth = require('../middlewares/auth')
const requireRole = require('../middlewares/requireRole')
const validate = require('../middlewares/validate')
const {
  attendanceQuerySchema,
  upsertAttendanceSchema,
} = require('../validators/attendance.validator')

const router = express.Router()

router.use(auth, requireRole('contractor'))

router.get('/', (req, _res, next) => {
  const result = attendanceQuerySchema.safeParse(req.query)
  if (!result.success) {
    const error = new Error(result.error.issues[0]?.message || 'Invalid data')
    error.statusCode = 400
    next(error)
    return
  }
  req.validatedQuery = result.data
  next()
}, attendanceController.list)

router.put('/', validate(upsertAttendanceSchema), attendanceController.upsert)

module.exports = router
