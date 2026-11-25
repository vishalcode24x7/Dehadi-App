const Attendance = require('../models/Attendance.model')
const Payment = require('../models/Payment.model')
const Khoraki = require('../models/Khoraki.model')
const ApiError = require('../utils/ApiError')
const { getAttendanceDays } = require('../utils/attendanceDays')

async function getWorkerSummary(worker, from, to) {
  if (worker.role !== 'worker') {
    throw new ApiError(403, 'Forbidden')
  }

  const dateFilter = {}
  if (from || to) {
    dateFilter.date = {}
    if (from) dateFilter.date.$gte = from
    if (to) dateFilter.date.$lte = to
  }

  const ownershipFilter = {
    workerId: worker._id,
    contractorId: worker.contractorId,
  }

  const [attendance, payments, khoraki] = await Promise.all([
    Attendance.find({ ...ownershipFilter, ...dateFilter }).sort({ date: -1 }),
    Payment.find({ ...ownershipFilter, ...dateFilter }).sort({ date: -1 }),
    Khoraki.find({ ...ownershipFilter, ...dateFilter }).sort({ date: -1 }),
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

  return {
    workerId: worker._id,
    name: worker.name,
    days,
    earned,
    paid,
    khoraki: khorakiAmount,
    balance,
    attendance,
    payments,
    khorakiEntries: khoraki,
  }
}

module.exports = { getWorkerSummary }
