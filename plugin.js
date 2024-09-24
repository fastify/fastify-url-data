'use strict'

const fp = require('fastify-plugin')
const { parse } = require('fast-uri')

function fastifyUrlData (fastify, options, next) {
  fastify.decorateRequest('urlData', function (key) {
    const scheme = this.headers[':scheme'] ? this.headers[':scheme'] : this.protocol
    const host = this.hostname
    const port = this.port
    const path = this.headers[':path'] || this.raw.url
    const urlData = parse(`${scheme}://${host}${port ? ':' + port : ''}${path}`)
    if (key) return urlData[key]
    return urlData
  })
  next()
}

module.exports = fp(fastifyUrlData, {
  fastify: '5.x',
  name: '@fastify/url-data'
})
module.exports.default = fastifyUrlData
module.exports.fastifyUrlData = fastifyUrlData
