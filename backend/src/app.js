const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { env } = require('./config/env')
const authRoutes = require('./routes/auth.routes')
const workersRoutes = require('./routes/workers.routes')
const attendanceRoutes = require('./routes/attendance.routes')
const createMoneyRoutes = require('./routes/money.routes')
const { paymentService, khorakiService } = require('./services/money.service')
const summaryRoutes = require('./routes/summary.routes')
const workerSummaryRoutes = require('./routes/workerSummary.routes')
const khorakiGroupRoutes = require('./routes/khorakiGroup.routes')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: clientOrigins,
    credentials: true
  }),
)
app.use(express.json({ limit: '1mb' }))

app.use(express.static("./public"))

app.use('/api/auth', authRoutes)
app.use('/api/workers', workersRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/payments', createMoneyRoutes(paymentService))
app.use('/api/khoraki', createMoneyRoutes(khorakiService))
app.use('/api/summary', summaryRoutes)
app.use('/api/me', workerSummaryRoutes)
app.use('/api/khoraki/groups', khorakiGroupRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' })
})

app.use(errorHandler)

module.exports = app