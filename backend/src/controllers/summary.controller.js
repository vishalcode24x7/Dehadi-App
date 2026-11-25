const asyncHandler = require('../utils/asyncHandler')
const { calculateWorkerSummaries } = require('../services/summary.service')

const list = asyncHandler(async (req, res) => {
  const summaries = await calculateWorkerSummaries(
    req.user._id,
    req.validatedQuery.from,
    req.validatedQuery.to,
  )
  res.json({ success: true, data: summaries })
})

module.exports = { list }
