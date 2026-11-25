const { z } = require('zod')

const phoneSchema = z.string().regex(/^\d{10}$/, 'Phone must be 10 digits')
const pinSchema = z.string().regex(/^\d{6}$/, 'PIN must be 6 digits')

const createWorkerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  phone: phoneSchema,
  pin: pinSchema,
  workerType: z.enum(['mistri', 'labour']),
  dailyWage: z.number().positive('Daily wage must be positive'),
})

const updateWorkerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').optional(),
  phone: phoneSchema.optional(),
  workerType: z.enum(['mistri', 'labour']).optional(),
  dailyWage: z.number().positive('Daily wage must be positive').optional(),
}).refine(
  (value) => Object.keys(value).length > 0,
  { message: 'At least one field is required' },
)

const resetWorkerPinSchema = z.object({
  pin: pinSchema,
})

module.exports = {
  createWorkerSchema,
  updateWorkerSchema,
  resetWorkerPinSchema,
}
