const asyncHandler = require('../utils/asyncHandler')
const service = require('../services/khorakiGroup.service')

const list = asyncHandler(async (req, res) => {
  const groups = await service.listGroups(req.user._id)
  res.json({ success: true, data: groups })
})

const create = asyncHandler(async (req, res) => {
  const group = await service.createGroup(req.user._id, req.body)
  res.status(201).json({ success: true, data: group })
})

const addEntry = asyncHandler(async (req, res) => {
  const group = await service.addGroupEntry(
    req.user._id,
    req.params.id,
    req.body,
  )
  res.json({ success: true, data: group })
})

const divide = asyncHandler(async (req, res) => {
  const group = await service.divideGroup(
    req.user._id,
    req.params.id,
    req.body.date,
  )
  res.json({ success: true, data: group })
})

module.exports = { list, create, addEntry, divide }
