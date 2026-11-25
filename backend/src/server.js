const app = require('./app')
const { env } = require('./config/env')
const { connectDatabase } = require('./config/db')

async function start() {
  await connectDatabase()
  app.listen(env.port)
}

start().catch((error) => {
  process.stderr.write(`Failed to start backend: ${error.message}\n`)
  process.exit(1)
})