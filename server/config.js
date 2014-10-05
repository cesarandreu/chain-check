'use strict';

var path = require('path'),
  _ = require('lodash');

// global config
var config = {
  name: 'chain-check-server',
  env: (process.env.NODE_ENV || 'development').toLowerCase(),

  middleware: {
    // koa-compress
    compress: {},

    // koa-body
    body: {
      multipart: true
    },

    // koa-send
    send: {
      root: path.resolve(__dirname, '../public')
    }
  }
};

// env
var environments = {};

// development
environments.development = {
  port: 3000,
  mongo: {
    url: 'mongodb://localhost:27017/chain-check-dev'
  }
};

// test
environments.test = {
  port: 4000,
  mongo: {
    url: 'mongodb://localhost:27017/chain-check-test'
  }
};

// production
environments.production = {
  port: process.env.PORT || 3000,
  mongo: {
    url: 'mongodb://localhost:27017/chain-check'
  }
};

// module
module.exports = _.merge(config, environments[config.env]);
