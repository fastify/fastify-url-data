'use strict'

const fs = require('fs')
const join = require('path').join
const http = require('http')
const test = require('tap').test
const Fastify = require('fastify')
const plugin = require('../')
const semver = require('semver')

const urlHost = 'localhost'
const urlPath = '/one'
const urlQuery = 'a=b&c=d'

test('parses a full URI', (t) => {
  t.plan(8)
  let port
  const fastify = Fastify()

  fastify
    .register(plugin)
    .after((err) => {
      if (err) t.error(err)
    })

  fastify.get(urlPath, (req, reply) => {
    const uriData = req.urlData()
    t.is(uriData.host, urlHost)
    t.is(uriData.port, port)
    t.is(uriData.path, urlPath)
    t.is(uriData.query, urlQuery)
    t.is(req.urlData('host'), urlHost)
    t.is(req.urlData('port'), port)
    t.is(req.urlData('path'), urlPath)
    t.is(req.urlData('query'), urlQuery)
    reply.send()
  })

  fastify.listen({ port: 0 }, (err) => {
    fastify.server.unref()
    if (err) t.threw(err)

    port = fastify.server.address().port
    http
      .get(`http://${urlHost}:${port}${urlPath}?${urlQuery}#foo`, () => {})
      .on('error', t.threw)
  })

  t.tearDown(() => fastify.close())
})

test('parses a full URI in HTTP2', { skip: semver.lt(process.versions.node, '8.8.0') }, (t) => {
  t.plan(9)

  const h2url = require('h2url')

  let port
  let fastify
  try {
    fastify = Fastify({
      http2: true,
      https: {
        key: fs.readFileSync(join(__dirname, 'https', 'fastify.key')),
        cert: fs.readFileSync(join(__dirname, 'https', 'fastify.cert'))
      }
    })
    t.pass('Key/cert successfully loaded')
  } catch (e) {
    t.fail('Key/cert loading failed', e)
  }

  fastify
    .register(plugin)
    .after((err) => {
      if (err) t.error(err)
    })

  fastify.get(urlPath, (req, reply) => {
    const uriData = req.urlData()
    t.is(uriData.host, urlHost)
    t.is(uriData.port, port)
    t.is(uriData.path, urlPath)
    t.is(uriData.query, urlQuery)
    t.is(req.urlData('host'), urlHost)
    t.is(req.urlData('port'), port)
    t.is(req.urlData('path'), urlPath)
    t.is(req.urlData('query'), urlQuery)
    reply.send()
  })

  fastify.listen({ port: 0 }, (err) => {
    fastify.server.unref()
    if (err) t.threw(err)

    port = fastify.server.address().port
    h2url.concat({ url: `https://${urlHost}:${port}${urlPath}?${urlQuery}#foo` }).then(() => {})
  })

  t.tearDown(() => fastify.close())
})
