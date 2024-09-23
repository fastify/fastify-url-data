'use strict'

const fs = require('node:fs')
const join = require('node:path').join
const http = require('node:http')
const test = require('tap').test
const Fastify = require('fastify')
const plugin = require('../')
const semver = require('semver')

const urlHost = 'localhost'
const urlForwardedHost = 'example.com'
const urlPath = '/one'
const urlQuery = 'a=b&c=d'
const httpScheme = 'http'
const httpsScheme = 'https'

test('parses a full URI', (t) => {
  t.plan(10)
  let port
  const fastify = Fastify()

  fastify
    .register(plugin)
    .after((err) => {
      if (err) t.error(err)
    })

  fastify.get(urlPath, (req, reply) => {
    const uriData = req.urlData()
    t.equal(uriData.host, urlHost)
    t.equal(uriData.port, port)
    t.equal(uriData.path, urlPath)
    t.equal(uriData.query, urlQuery)
    t.equal(uriData.scheme, httpScheme)
    t.equal(req.urlData('host'), urlHost)
    t.equal(req.urlData('port'), port)
    t.equal(req.urlData('path'), urlPath)
    t.equal(req.urlData('query'), urlQuery)
    t.equal(req.urlData('scheme'), httpScheme)
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

  t.teardown(() => fastify.close())
})

test('parses a full URI in HTTP2', { skip: semver.lt(process.versions.node, '8.8.0') }, (t) => {
  t.plan(11)

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
    t.equal(uriData.host, urlHost)
    t.equal(uriData.port, port)
    t.equal(uriData.path, urlPath)
    t.equal(uriData.query, urlQuery)
    t.equal(uriData.scheme, httpsScheme)
    t.equal(req.urlData('host'), urlHost)
    t.equal(req.urlData('port'), port)
    t.equal(req.urlData('path'), urlPath)
    t.equal(req.urlData('query'), urlQuery)
    t.equal(req.urlData('scheme'), httpsScheme)
    reply.send()
  })

  fastify.listen({ port: 0 }, (err) => {
    fastify.server.unref()
    if (err) t.threw(err)

    port = fastify.server.address().port
    h2url.concat({ url: `https://${urlHost}:${port}${urlPath}?${urlQuery}#foo` }).then(() => {})
  })

  t.teardown(() => fastify.close())
})

test('parses a full URI using X-Forwarded-Host when trustProxy is set', (t) => {
  t.plan(10)
  let port
  const fastify = Fastify({ trustProxy: true }) // Setting trustProxy true will use X-Forwarded-Host header if set

  fastify
    .register(plugin)
    .after((err) => {
      if (err) t.error(err)
    })

  fastify.get(urlPath, (req, reply) => {
    const uriData = req.urlData()
    t.equal(uriData.host, urlForwardedHost)
    t.equal(uriData.port, port)
    t.equal(uriData.path, urlPath)
    t.equal(uriData.query, urlQuery)
    t.equal(uriData.scheme, httpScheme)
    t.equal(req.urlData('host'), urlForwardedHost)
    t.equal(req.urlData('port'), port)
    t.equal(req.urlData('path'), urlPath)
    t.equal(req.urlData('query'), urlQuery)
    t.equal(req.urlData('scheme'), httpScheme)
    reply.send()
  })

  fastify.listen({ port: 0 }, (err) => {
    fastify.server.unref()
    if (err) t.threw(err)

    port = fastify.server.address().port
    http
      .get(`http://${urlHost}:${port}${urlPath}?${urlQuery}#foo`, { headers: { 'X-Forwarded-Host': `${urlForwardedHost}:${port}` } }, () => {})
      .on('error', t.threw)
  })

  t.teardown(() => fastify.close())
})

test('parses a full URI ignoring X-Forwarded-Host when trustProxy is not set', (t) => {
  t.plan(10)
  let port
  const fastify = Fastify()

  fastify
    .register(plugin)
    .after((err) => {
      if (err) t.error(err)
    })

  fastify.get(urlPath, (req, reply) => {
    const uriData = req.urlData()
    t.equal(uriData.host, urlHost)
    t.equal(uriData.port, port)
    t.equal(uriData.path, urlPath)
    t.equal(uriData.query, urlQuery)
    t.equal(uriData.scheme, httpScheme)
    t.equal(req.urlData('host'), urlHost)
    t.equal(req.urlData('port'), port)
    t.equal(req.urlData('path'), urlPath)
    t.equal(req.urlData('query'), urlQuery)
    t.equal(req.urlData('scheme'), httpScheme)
    reply.send()
  })

  fastify.listen({ port: 0 }, (err) => {
    fastify.server.unref()
    if (err) t.threw(err)

    port = fastify.server.address().port
    http
      .get(`http://${urlHost}:${port}${urlPath}?${urlQuery}#foo`, { headers: { 'X-Forwarded-Host': `${urlForwardedHost}:${port}` } }, () => {})
      .on('error', t.threw)
  })

  t.teardown(() => fastify.close())
})

test('should parse path without a port specified', async (t) => {
  t.plan(2)
  const fastify = Fastify()
  fastify
    .register(plugin)

  fastify.get('/', (req, reply) => {
    const path = req.urlData('path')
    reply.send('That worked, path is ' + path)
  })

  const res = await fastify.inject({ url: '/', headers: { host: 'localhost' } })
  t.equal(res.statusCode, 200)
  t.equal(res.body, 'That worked, path is /')
})
