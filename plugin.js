'use strict'

const fp = require('fastify-plugin')
const urijs = require('uri-js')

function plugin (fastify, options, next) {
  fastify.decorateRequest('urlData', function () {
    return urijs.parse('//' + this.headers.host + this.req.url)
  })
  next()
}

module.exports = fp(plugin, '>=0.15.0')
