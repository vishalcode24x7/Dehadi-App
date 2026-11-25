const express = require('express')
const auth = require('../middlewares/auth')
const requireRole = require('../middlewares/requireRole')
const { summaryQuerySchema } = require('../validators/summary.validator')
const summaryController = require('../controllers/summary.controller')

const router = express.Router()

router.use(auth, requireRole('contractor'))

router.get('/workers', (req, _res, next) => {
  const result = summaryQuerySchema.safeParse(req.query)
  if (!result.success) {
    const error = new Error(result.error.issues[0]?.message || 'Invalid data')
    error.statusCode = 400
    next(error)
    return
  }
  req.validatedQuery = result.data
  next()
}, summaryController.list)

module.exports = router
