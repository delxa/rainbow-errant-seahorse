import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'

import router from './routers/api'

let app = express()

app.use(bodyParser.json())
app.use(session({
  secret: 'seek-learning-@@1x',
  resave: false,
  saveUninitialized: true
}))

// Queue Routers
app.use('/api', router)

// Listen
app.listen(9000)
console.log('Seek, and you shall find... on http://localhost:9000')
