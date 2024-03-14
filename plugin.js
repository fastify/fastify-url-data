'use strict'

const fp = require('fastify-plugin')

function fastifyUrlData (fastify, options, next) {
  fastify.decorateRequest('urlData', function (key) {
    const scheme = this.headers[':scheme'] ? this.headers[':scheme'] : this.protocol
    const host = this.hostname
    const path = this.headers[':path'] || this.raw.url
    const url = new URL(scheme + '://' + host + path)

    if (key) return url[key]
    return url
  })
  next()
}

module.exports = fp(fastifyUrlData, {
  fastify: '4.x',
  name: '@fastify/url-data'
})
module.exports.default = fastifyUrlData
module.exports.fastifyUrlData = fastifyUrlData
