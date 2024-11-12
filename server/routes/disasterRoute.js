const express = require('express')
const disasterRoute = express.Router()

const emergency = require('../controllers/emergency')
const getDisasterDetail = require('../controllers/getDisasterDetail')
const verifyUser = require('../controllers/auth')
const emergency_mail = require('../controllers/nearbyHospital')
const getUserCount = require('../controllers/getUserCount')

disasterRoute.post('/emergency',emergency)
// disasterRoute.get('/',getDisasterDetail)
disasterRoute.post('/auth',verifyUser)
disasterRoute.get('/emergency_mail/:count', getUserCount)
disasterRoute.post('/emergency_mail',emergency_mail)

module.exports = disasterRoute
