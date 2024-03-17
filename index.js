const env = require('node-env-file')
env(__dirname + '/.env')

const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const apiRouter = require('./routes/api.js')

async function main() {
  const app = express()
  app.use(cors({
    "origin": process.env.SITE_URL,
    "credentials": true
  }))
  app.use(logger('dev'))
  app.use(express.json())
  app.use('/api', apiRouter)

  app.listen(process.env.PORT)
  console.log("Watcher listening on: " + process.env.PORT)
}

(async () => {
  try {
    console.log('Started api with PID: ' + process.pid)
    await main()

    process.on('SIGINT', () => {
      console.log('sigint was called')
      const used = process.memoryUsage();
      for (let key in used) {
        const item = Math.round(used[key] / 1024 / 1024 * 100) / 100
        console.log(String(key).padEnd(15) + item + ' MB');
      }
      process.exit(1)
    })

  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})()
