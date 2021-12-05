'use strict'

const fp = require('fastify-plugin')
const urijs = require('uri-js')

function plugin (fastify, options, next) {
  if (!fastify.hasRequestDecorator('urlData')) {
    fastify.decorateRequest('urlData', function (key) {
      const scheme = (this.headers[':scheme'] ? this.headers[':scheme'] + ':' : '') + '//'
      const host = this.headers[':authority'] || this.headers.host
      const path = this.headers[':path'] || this.raw.url
      const urlData = urijs.parse(scheme + host + path)
      if (key) return urlData[key]
      return urlData
    })
  }
  next()
}

module.exports = fp(plugin, {
  fastify: '>= 3.0.0',
  name: 'fastify-url-data'
})
