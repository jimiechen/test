
/*!
 * nodejs-express-mongoose-demo
 * Copyright(c) 2013 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , passport = require('passport')
  , log4js = require('log4js'); 

//configuration log4js 
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/weiyes.log', category: 'weiyes' }
  ]
});

var logger = log4js.getLogger('weiyes');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , auth = require('./config/middlewares/authorization')
  , mongoose = require('mongoose')

// Bootstrap db connection
mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

// bootstrap passport config
require('./config/passport')(passport, config, logger)

var app = express()
// express settings
require('./config/express')(app, config, passport, logger)

// Bootstrap routes
require('./config/routes')(app,config, passport, auth)

// Start the app by listening on <port>
var port = process.env.PORT || 3000
app.listen(port)
logger.info('Express app started on port '+port)

// expose app
exports = module.exports = app
