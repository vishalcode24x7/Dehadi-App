const authService = require('../services/auth.service')
const asyncHandler = require('../utils/asyncHandler')

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body)
  res.status(201).json({ success: true, data: result })
})

const loginPin = asyncHandler(async (req, res) => {
  const result = await authService.loginPin(req.body)
  res.json({ success: true, data: result })
})

const me = asyncHandler(async (req, res) => {
  const result = await authService.getMe(req.user)
  res.json({ success: true, data: result })
})

const changePin = asyncHandler(async (req, res) => {
  const result = await authService.changePin(req.user, req.body)
  res.json({ success: true, data: result })
})

module.exports = { register, loginPin, me, changePin }
