const express = require('express');
const bodyParser = require('body-parser');
const merchants = require('../routes/merchants');
const users = require('../routes/users');
const transactions = require('../routes/transactions')
const auth = require('../routes/auth');
const error = require('../middleware/error');
const helmet = require ('helmet');
const compression = require('compression');
const cors = require('../middleware/cors');
const cors2 = require('cors')

module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/api/transactions', transactions);
  app.use('/api/merchants', merchants);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(cors2());
  app.use(error);
  app.use(cors);
  app.use(helmet());
  app.use(compression());
}