import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import url from 'url'
import get_ from './middleware/get'
import { sysoverview } from './routes/sysoverview'
import { categories } from './routes/categories'
import { programs } from './routes/programs'
import { programContents } from './routes/program-contents'
import { ratings } from './routes/ratings'
import { schedules } from './routes/schedules'
import { watch } from './routes/watch'
import { liveStreaming } from './routes/live-streaming'
import { liveBroadcast } from './routes/live-broadcast'
import { apiMediaServer } from './routes/api-media-server'

const router = express.Router()
const app = express()
const model = require('./models').default

router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.query = url.parse(req.url, true).query

  req.res = res
  res.req = req

  // Middleware GET
  if (req.method === 'GET') {
    get_(req, model)
  }

  next()
})

sysoverview(router)
categories(router, model)
programs(router, model)
programContents(router, model)
ratings(router, model)
schedules(router, model)
watch(router, model)
liveStreaming(router, model)
liveBroadcast(router, model)
apiMediaServer(router)

router.post('/check-username', (req, res) => {
  if (req.body.username === 'userbeta') {
    return res.json({ success: true })
  } else {
    return res.json({ success: false })
  }
})

router.post('/auth/login', (req, res) => {
  if (req.body.username === 'userbeta' && req.body.password === 'beta123??') {
    // req.session.authUser = { username: 'demo' }
    const accessToken = jsonwebtoken.sign({
      username: 'userbeta',
      name: 'Test demo'
    }, 'testdummy')

    return res.json({
      token: {
        accessToken: accessToken
      }
    })
  }

  res.status(401).json({ message: 'Bad credentials!' })
})

router.get('/auth/user', (req, res) => {
  return res.json({
    user: {
      username: 'userbeta',
      level: 'Admin',
      name: 'Beta User'
    }
  })
})

export default {
  path: '/api',
  handler: router
}
