const express = require('express')
const auth = require('../middlewares/auth')
const requireRole = require('../middlewares/requireRole')
const asyncHandler = require('../utils/asyncHandler')
const { workerSummaryQuerySchema } = require('../validators/workerSummary.validator')
const { getWorkerSummary } = require('../services/workerSummary.service')

const router = express.Router()

router.use(auth, requireRole('worker'))

router.get('/summary', asyncHandler(async (req, res) => {
  const result = workerSummaryQuerySchema.safeParse(req.query)
  if (!result.success) {
    const error = new Error(result.error.issues[0]?.message || 'Invalid data')
    error.statusCode = 400
    throw error
  }
  const summary = await getWorkerSummary(
    req.user,
    result.data.from,
    result.data.to,
  )
  res.json({ success: true, data: summary })
}))

module.exports = router
