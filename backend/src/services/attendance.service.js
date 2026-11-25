const mongoose = require('mongoose')
const Attendance = require('../models/Attendance.model')
const User = require('../models/User.model')
const ApiError = require('../utils/ApiError')

async function getAttendance(contractorId, date) {
  return Attendance.find({ contractorId, date }).sort({ workerId: 1 })
}

async function upsertAttendance(contractorId, input) {
  if (!mongoose.isValidObjectId(input.workerId)) {
    throw new ApiError(400, 'Invalid worker')
  }

  const worker = await User.findOne({
    _id: input.workerId,
    role: 'worker',
    contractorId,
    isActive: true,
  })
  if (!worker) {
    throw new ApiError(404, 'Worker not found')
  }

  return Attendance.findOneAndUpdate(
    {
      workerId: worker._id,
      date: input.date,
    },
    {
      $set: {
        contractorId,
        status: input.status,
        note: input.note,
      },
      $setOnInsert: {
        workerId: worker._id,
        date: input.date,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  )
}

module.exports = {
  getAttendance,
  upsertAttendance,
}
