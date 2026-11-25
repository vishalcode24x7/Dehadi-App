const Attendance = require('../models/Attendance.model')
const Payment = require('../models/Payment.model')
const Khoraki = require('../models/Khoraki.model')
const User = require('../models/User.model')
const { getAttendanceDays } = require('../utils/attendanceDays')

async function calculateWorkerSummaries(contractorId, from, to) {
  const workers = await User.find({
    role: 'worker',
    contractorId,
  })

  const dateFilter = {}
  if (from || to) {
    dateFilter.date = {}
    if (from) dateFilter.date.$gte = from
    if (to) dateFilter.date.$lte = to
  }

  const summaries = []

  for (const worker of workers) {
    const workerFilter = {
      workerId: worker._id,
      contractorId,
      ...dateFilter,
    }

    const [attendance, payments, khoraki] = await Promise.all([
      Attendance.find(workerFilter),
      Payment.find(workerFilter),
      Khoraki.find(workerFilter),
    ])

    const days = attendance.reduce(
      (total, item) => total + getAttendanceDays(item.status),
      0,
    )
    const paid = payments.reduce((total, item) => total + item.amount, 0)
    const khorakiAmount = khoraki.reduce(
      (total, item) => total + item.amount,
      0,
    )
    const earned = days * worker.dailyWage
    const balance = earned - paid - khorakiAmount

    summaries.push({
      workerId: worker._id,
      name: worker.name,
      phone: worker.phone,
      workerType: worker.workerType,
      dailyWage: worker.dailyWage,
      isActive: worker.isActive,
      days,
      earned,
      paid,
      khoraki: khorakiAmount,
      balance,
    })
  }

  return summaries
}

module.exports = { calculateWorkerSummaries }
