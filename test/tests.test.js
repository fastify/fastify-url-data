'use strict'

const fs = require('node:fs')
const join = require('node:path').join
const { test } = require('node:test')
const Fastify = require('fastify')
const plugin = require('..')

const urlHost = 'localhost'
const urlForwardedHost = 'example.com'
const urlPath = '/one'
const urlQuery = 'a=b&c=d'
const httpScheme = 'http'
const httpsScheme = 'https'

test('parses a full URI', async (t) => {
  t.plan(11)
  const fastify = Fastify()

  fastify
    .register(plugin)
    .after((err) => {
      t.assert.ok(!err)
    })

  fastify.get(urlPath, (req, reply) => {
    const uriData = req.urlData()
    t.assert.deepStrictEqual(uriData.host, urlHost)
    t.assert.deepStrictEqual(uriData.port, port)
    t.assert.deepStrictEqual(uriData.path, urlPath)
    t.assert.deepStrictEqual(uriData.query, urlQuery)
    t.assert.deepStrictEqual(uriData.scheme, httpScheme)
    t.assert.deepStrictEqual(req.urlData('host'), urlHost)
    t.assert.deepStrictEqual(req.urlData('port'), port)
    t.assert.deepStrictEqual(req.urlData('path'), urlPath)
    t.assert.deepStrictEqual(req.urlData('query'), urlQuery)
    t.assert.deepStrictEqual(req.urlData('scheme'), httpScheme)
    reply.send()
  })

  await fastify.listen({ port: 0 })
  const port = fastify.server.address().port
  fastify.server.unref()

  await fetch(`http://${urlHost}:${port}${urlPath}?${urlQuery}#foo`)

  t.after(() => fastify.close())
})

test('parses a full URI in HTTP2', async (t) => {
  t.plan(11)

  const h2url = require('h2url')

  const fastify = Fastify({
    http2: true,
    https: {
      key: fs.readFileSync(join(__dirname, 'https', 'fastify.key')),
      cert: fs.readFileSync(join(__dirname, 'https', 'fastify.cert'))
    }
  })

  fastify
    .register(plugin)
    .after((err) => {
      t.assert.ok(!err)
    })

  fastify.get(urlPath, (req, reply) => {
    const uriData = req.urlData()
    t.assert.deepStrictEqual(uriData.host, urlHost)
    t.assert.deepStrictEqual(uriData.port, port)
    t.assert.deepStrictEqual(uriData.path, urlPath)
    t.assert.deepStrictEqual(uriData.query, urlQuery)
    t.assert.deepStrictEqual(uriData.scheme, httpsScheme)
    t.assert.deepStrictEqual(req.urlData('host'), urlHost)
    t.assert.deepStrictEqual(req.urlData('port'), port)
    t.assert.deepStrictEqual(req.urlData('path'), urlPath)
    t.assert.deepStrictEqual(req.urlData('query'), urlQuery)
    t.assert.deepStrictEqual(req.urlData('scheme'), httpsScheme)
    reply.send()
  })

  await fastify.listen({ port: 0 })
  const port = fastify.server.address().port
  fastify.server.unref()

  await h2url.concat({ url: `https://${urlHost}:${port}${urlPath}?${urlQuery}#foo` })

  t.after(() => fastify.close())
})

test('parses a full URI using X-Forwarded-Host when trustProxy is set', async (t) => {
  t.plan(11)
  const fastify = Fastify({ trustProxy: true }) // Setting trustProxy true will use X-Forwarded-Host header if set

  fastify
    .register(plugin)
    .after((err) => {
      t.assert.ok(!err)
    })

  fastify.get(urlPath, (req, reply) => {
    const uriData = req.urlData()
    t.assert.deepStrictEqual(uriData.host, urlForwardedHost)
    t.assert.deepStrictEqual(uriData.port, port)
    t.assert.deepStrictEqual(uriData.path, urlPath)
    t.assert.deepStrictEqual(uriData.query, urlQuery)
    t.assert.deepStrictEqual(uriData.scheme, httpScheme)
    t.assert.deepStrictEqual(req.urlData('host'), urlForwardedHost)
    t.assert.deepStrictEqual(req.urlData('port'), port)
    t.assert.deepStrictEqual(req.urlData('path'), urlPath)
    t.assert.deepStrictEqual(req.urlData('query'), urlQuery)
    t.assert.deepStrictEqual(req.urlData('scheme'), httpScheme)
    reply.send()
  })

  await fastify.listen({ port: 0 })
  const port = fastify.server.address().port
  fastify.server.unref()

  await fetch(`http://${urlHost}:${fastify.server.address().port}${urlPath}?${urlQuery}#foo`, { headers: { 'X-Forwarded-Host': `${urlForwardedHost}:${port}` } })

  t.after(() => fastify.close())
})

test('parses a full URI ignoring X-Forwarded-Host when trustProxy is not set', async (t) => {
  t.plan(11)
  const fastify = Fastify()

  fastify
    .register(plugin)
    .after((err) => {
      t.assert.ok(!err)
    })

  fastify.get(urlPath, (req, reply) => {
    const uriData = req.urlData()
    t.assert.deepStrictEqual(uriData.host, urlHost)
    t.assert.deepStrictEqual(uriData.port, port)
    t.assert.deepStrictEqual(uriData.path, urlPath)
    t.assert.deepStrictEqual(uriData.query, urlQuery)
    t.assert.deepStrictEqual(uriData.scheme, httpScheme)
    t.assert.deepStrictEqual(req.urlData('host'), urlHost)
    t.assert.deepStrictEqual(req.urlData('port'), port)
    t.assert.deepStrictEqual(req.urlData('path'), urlPath)
    t.assert.deepStrictEqual(req.urlData('query'), urlQuery)
    t.assert.deepStrictEqual(req.urlData('scheme'), httpScheme)
    reply.send()
  })

  await fastify.listen({ port: 0 })
  const port = fastify.server.address().port
  fastify.server.unref()

  await fetch(`http://${urlHost}:${fastify.server.address().port}${urlPath}?${urlQuery}#foo`, { headers: { 'X-Forwarded-Host': `${urlForwardedHost}:${port}` } })

  t.after(() => fastify.close())
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
  t.assert.deepStrictEqual(res.statusCode, 200)
  t.assert.deepStrictEqual(res.body, 'That worked, path is /')
})
