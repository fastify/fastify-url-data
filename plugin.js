'use strict'

const fp = require('fastify-plugin')
const urijs = require('uri-js')

function plugin (fastify, options, next) {
  fastify.decorateRequest('urlData', function (key) {
    const urlData = urijs.parse('//' + this.headers.host + this.req.url)
    if (key) return urlData[key]
    return urlData
  })
  next()
}

module.exports = fp(plugin, {
  fastify: '>=1.0.0-rc.1',
  name: 'fastify-url-data'
})
