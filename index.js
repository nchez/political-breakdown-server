require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./models')

// const req = require("express/lib/request");

const app = express()
const PORT = process.env.PORT || 3001

// middlewares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ msg: 'this is the / route' })
})

// controllers
// app.use("/users", require("./controllers/users"));
app.use('/congress', require('./controllers/congressmembers'))
app.use('/stocks', require('./controllers/stocks'))
app.use('/trades', require('./controllers/trades'))
app.use('/prices', require('./controllers/prices'))

app.listen(PORT, () =>
  console.log(`listening to the smooth sounds of port ${PORT} in the morning`)
)
