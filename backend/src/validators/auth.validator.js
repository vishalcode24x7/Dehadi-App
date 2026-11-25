const { z } = require('zod')

const phoneSchema = z.string().regex(/^\d{10}$/, 'Phone must be 10 digits')
const pinSchema = z.string().regex(/^\d{6}$/, 'PIN must be 6 digits')

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  phone: phoneSchema,
  pin: pinSchema,
})

const pinLoginSchema = z.object({
  phone: phoneSchema,
  pin: pinSchema,
})

const pinChangeSchema = z
  .object({
    newPin: pinSchema,
    currentPin: pinSchema.optional(),
    currentPassword: z.string().min(6).optional(),
  })
  .refine(
    (value) => value.currentPin || value.currentPassword,
    { message: 'Current PIN or password is required' },
  )

module.exports = {
  registerSchema,
  pinLoginSchema,
  pinChangeSchema,
}
