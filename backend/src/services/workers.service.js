const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const ApiError = require('../utils/ApiError')

async function listWorkers(contractorId) {
  return User.find({
    role: 'worker',
    contractorId,
    isActive: true,
  }).sort({ createdAt: -1 })
}

async function createWorker(contractorId, input) {
  const pinHash = await bcrypt.hash(input.pin, 10)
  return User.create({
    name: input.name,
    phone: input.phone,
    pinHash,
    role: 'worker',
    contractorId,
    workerType: input.workerType,
    dailyWage: input.dailyWage,
  })
}

async function updateWorker(contractorId, workerId, input) {
  const worker = await User.findOneAndUpdate(
    { _id: workerId, role: 'worker', contractorId },
    { $set: input },
    { new: true, runValidators: true },
  )
  if (!worker) {
    throw new ApiError(404, 'Worker not found')
  }
  return worker
}

async function resetWorkerPin(contractorId, workerId, pin) {
  const pinHash = await bcrypt.hash(pin, 10)
  const worker = await User.findOneAndUpdate(
    { _id: workerId, role: 'worker', contractorId },
    {
      $set: {
        pinHash,
        failedPinAttempts: 0,
        lockUntil: null,
      },
    },
    { new: true, runValidators: true },
  )
  if (!worker) {
    throw new ApiError(404, 'Worker not found')
  }
  return worker
}

async function deleteWorker(contractorId, workerId) {
  const worker = await User.findOneAndDelete({
    _id: workerId,
    role: 'worker',
    contractorId,
  })
  if (!worker) {
    throw new ApiError(404, 'Worker not found')
  }
  return { id: worker.id }
}

module.exports = {
  listWorkers,
  createWorker,
  updateWorker,
  resetWorkerPin,
  deleteWorker,
}
