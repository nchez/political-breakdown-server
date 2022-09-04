require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./models')
const fs = require('fs')

// const req = require("express/lib/request");

const app = express()
const PORT = process.env.PORT || 3001

// middlewares
app.use(cors())
app.use(express.json())

// controllers
// app.use("/users", require("./controllers/users"));
// app.use("/congressmembers", require("./controllers/congressmembers"));
// app.use('/stocks', require('./controllers/stocks'))

app.listen(PORT, () =>
  console.log(`listening to the smooth sounds of port ${PORT} in the morning`)
)
