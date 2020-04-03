'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"http://localhost:9091/api"',
  API_HOST: '"http://localhost:9091"',
  GOOGLE_CLIENT_ID: `"${process.env.GOOGLE_CLIENT_ID}"`
})
