const jwt = require('jsonwebtoken')
const { env } = require('../config/env')
const User = require('../models/User.model')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')

const auth = asyncHandler(async (req, _res, next) => {
  const authorization = req.headers.authorization
  if (!authorization?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized')
  }

  let payload
  try {
    payload = jwt.verify(authorization.slice(7), env.jwtSecret)
  } catch {
    throw new ApiError(401, 'Unauthorized')
  }

  const user = await User.findById(payload.sub)
  if (!user || !user.isActive) {
    throw new ApiError(401, 'Unauthorized')
  }

  req.user = user
  next()
})

module.exports = auth
