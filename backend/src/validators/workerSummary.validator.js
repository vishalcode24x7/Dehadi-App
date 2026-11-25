const { z } = require('zod')

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

const workerSummaryQuerySchema = z.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
})

module.exports = { workerSummaryQuerySchema }
