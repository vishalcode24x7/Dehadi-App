const mongoose = require('mongoose')
const Payment = require('../models/Payment.model')
const Khoraki = require('../models/Khoraki.model')
const User = require('../models/User.model')
const ApiError = require('../utils/ApiError')

async function assertOwnedWorker(contractorId, workerId) {
  if (!mongoose.isValidObjectId(workerId)) {
    throw new ApiError(400, 'Invalid worker')
  }
  const worker = await User.findOne({
    _id: workerId,
    role: 'worker',
    contractorId,
  })
  if (!worker) {
    throw new ApiError(404, 'Worker not found')
  }
  return worker
}

function createMoneyService(Model) {
  return {
    async list(contractorId, query) {
      await assertOwnedWorker(contractorId, query.workerId)
      const filter = {
        contractorId,
        workerId: query.workerId,
      }
      if (query.from || query.to) {
        filter.date = {}
        if (query.from) filter.date.$gte = query.from
        if (query.to) filter.date.$lte = query.to
      }
      return Model.find(filter).sort({ date: -1, createdAt: -1 })
    },

    async create(contractorId, input) {
      await assertOwnedWorker(contractorId, input.workerId)
      return Model.create({
        contractorId,
        workerId: input.workerId,
        amount: input.amount,
        date: input.date,
        note: input.note,
      })
    },

    async remove(contractorId, id) {
      if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid id')
      }
      const item = await Model.findOneAndDelete({
        _id: id,
        contractorId,
      })
      if (!item) {
        throw new ApiError(404, 'Entry not found')
      }
      return { id: item.id }
    },
  }
}

module.exports = {
  paymentService: createMoneyService(Payment),
  khorakiService: createMoneyService(Khoraki),
}
