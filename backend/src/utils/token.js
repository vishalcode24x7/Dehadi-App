const jwt = require('jsonwebtoken')
const { env } = require('../config/env')

function createToken(user) {
  return jwt.sign(
    { role: user.role },
    env.jwtSecret,
    { subject: user.id, expiresIn: env.jwtExpiresIn },
  )
}

module.exports = { createToken }
