'use strict'

const http = require('http')
const test = require('tap').test
const Fastify = require('fastify')
const plugin = require('../')

test('parses a full URI', (t) => {
  t.plan(8)
  let port
  const fastify = Fastify()

  fastify
    .register(plugin)
    .after((err) => {
      if (err) t.error(err)
    })

  fastify.get('/one', (req, reply) => {
    const uriData = req.urlData()
    t.is(uriData.host, '127.0.0.1')
    t.is(uriData.port, port)
    t.is(uriData.path, '/one')
    t.is(uriData.query, 'a=b&c=d')
    t.is(req.urlData('host'), '127.0.0.1')
    t.is(req.urlData('port'), port)
    t.is(req.urlData('path'), '/one')
    t.is(req.urlData('query'), 'a=b&c=d')
    reply.send()
  })

  fastify.listen(0, (err) => {
    fastify.server.unref()
    if (err) t.threw(err)

    port = fastify.server.address().port
    http
      .get(`http://127.0.0.1:${port}/one?a=b&c=d#foo`, (res) => {})
      .on('error', t.threw)
  })

  t.tearDown(() => fastify.close())
})
