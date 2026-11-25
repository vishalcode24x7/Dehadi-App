const asyncHandler = require('../utils/asyncHandler')

function createMoneyController(service) {
  return {
    list: asyncHandler(async (req, res) => {
      const items = await service.list(req.user._id, req.validatedQuery)
      res.json({ success: true, data: items })
    }),
    create: asyncHandler(async (req, res) => {
      const item = await service.create(req.user._id, req.body)
      res.status(201).json({ success: true, data: item })
    }),
    remove: asyncHandler(async (req, res) => {
      const result = await service.remove(req.user._id, req.params.id)
      res.json({ success: true, data: result })
    }),
  }
}

module.exports = createMoneyController
