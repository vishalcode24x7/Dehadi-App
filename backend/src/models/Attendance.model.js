const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    status: {
      type: String,
      enum: ['present', 'half', 'oneAndHalf', 'double', 'absent'],
      required: true,
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true },
)

attendanceSchema.index({ workerId: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('Attendance', attendanceSchema)
