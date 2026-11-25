const { z } = require('zod')

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const entrySchema = z.object({
  amount: z.number().positive(),
  date: dateSchema,
})

const createKhorakiGroupSchema = z.object({
  name: z.string().trim().min(1),
  workerIds: z.array(z.string().min(1)).min(1),
  entries: z.array(entrySchema).min(1),
  note: z.string().max(200).optional().default(''),
})

const addGroupEntrySchema = entrySchema
const divideGroupSchema = z.object({ date: dateSchema })

module.exports = {
  createKhorakiGroupSchema,
  addGroupEntrySchema,
  divideGroupSchema,
}
