const { z } = require('zod')

const dateSchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  'Date must use YYYY-MM-DD',
)

const attendanceQuerySchema = z.object({
  date: dateSchema,
})

const upsertAttendanceSchema = z.object({
  workerId: z.string().min(1, 'Worker is required'),
  date: dateSchema,
  status: z.enum(['present', 'half', 'oneAndHalf', 'double', 'absent']),
  note: z.string().max(200).optional().default(''),
})

module.exports = {
  attendanceQuerySchema,
  upsertAttendanceSchema,
}
