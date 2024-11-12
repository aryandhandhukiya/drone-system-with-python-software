const express = require('express')
const cors = require('cors')
const { connectDb } = require('./config/dbConfig')
const indexRoute = require('./routes/indexRoute')
const path = require("path")
require('dotenv').config()


const app = express() // Create the express app first
const PORT = process.env.PORT || 4000

app.use(express.static(path.resolve(__dirname, './build')))
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use('/api', indexRoute)

connectDb()

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`))
