'use strict'
module.exports = {
  NODE_ENV: '"production"',
  API_URL: '"/api"',
  API_HOST: `"${process.env.API_HOST}"`,
  VAPID_KEYS_PUBLIC: `"${process.env.VAPID_KEYS_PUBLIC}"`,
  GOOGLE_CLIENT_ID: `"${process.env.GOOGLE_CLIENT_ID}"`
}
