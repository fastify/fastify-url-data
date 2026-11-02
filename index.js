'use strict'

const fp = require('fastify-plugin')
const { parse } = require('fast-uri')

// Matches the scheme and authority of an absolute-form request target,
// e.g. `GET http://example.com/foo HTTP/1.1` (RFC 9112, section 3.2.2)
const ABSOLUTE_FORM_REGEX = /^https?:\/\/[^/?#]*/i

function fastifyUrlData (fastify, _options, next) {
  fastify.decorateRequest('urlData', function (key) {
    const scheme = this.headers[':scheme'] ? this.headers[':scheme'] : this.protocol
    const host = this.hostname
    const port = this.port
    const path = (this.headers[':path'] || this.raw.url).replace(ABSOLUTE_FORM_REGEX, '')
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
