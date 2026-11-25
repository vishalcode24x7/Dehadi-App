const attendanceService = require('../services/attendance.service')
const asyncHandler = require('../utils/asyncHandler')

const list = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.getAttendance(
    req.user._id,
    req.validatedQuery.date,
  )
  res.json({ success: true, data: attendance })
})

const upsert = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.upsertAttendance(
    req.user._id,
    req.body,
  )
  res.json({ success: true, data: attendance })
})

module.exports = { list, upsert }
