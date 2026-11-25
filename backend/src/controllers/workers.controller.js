const workersService = require('../services/workers.service')
const asyncHandler = require('../utils/asyncHandler')

const list = asyncHandler(async (req, res) => {
  const workers = await workersService.listWorkers(req.user._id)
  res.json({ success: true, data: workers })
})

const create = asyncHandler(async (req, res) => {
  const worker = await workersService.createWorker(req.user._id, req.body)
  res.status(201).json({ success: true, data: worker })
})

const update = asyncHandler(async (req, res) => {
  const worker = await workersService.updateWorker(
    req.user._id,
    req.params.id,
    req.body,
  )
  res.json({ success: true, data: worker })
})

const resetPin = asyncHandler(async (req, res) => {
  const worker = await workersService.resetWorkerPin(
    req.user._id,
    req.params.id,
    req.body.pin,
  )
  res.json({ success: true, data: worker })
})

const remove = asyncHandler(async (req, res) => {
  const result = await workersService.deleteWorker(req.user._id, req.params.id)
  res.json({ success: true, data: result })
})

module.exports = { list, create, update, resetPin, remove }
