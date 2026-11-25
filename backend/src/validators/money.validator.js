const { z } = require('zod')

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

const querySchema = z.object({
  workerId: z.string().min(1),
  from: dateSchema.optional(),
  to: dateSchema.optional(),
})

const createSchema = z.object({
  workerId: z.string().min(1),
  amount: z.number().positive(),
  date: dateSchema,
  note: z.string().max(200).optional().default(''),
})

module.exports = { querySchema, createSchema }
