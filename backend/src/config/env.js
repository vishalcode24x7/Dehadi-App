const dotenv = require('dotenv')

dotenv.config()

const env = {
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
}

for (const [key, value] of [
  ['MONGODB_URI', env.mongodbUri],
  ['JWT_SECRET', env.jwtSecret],
]) {
  if (!value) {
    throw new Error(`${key} is required`)
  }
}

module.exports = { env }
