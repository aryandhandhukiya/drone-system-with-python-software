const express = require('express');
const indexRoute = express.Router();

const disasterRoute = require('./disasterRoute')

indexRoute.use('/disaster', disasterRoute)

module.exports = indexRoute;
