'use strict'

const http = require('http')
const tap = require('tap')
const test = tap.test
const fastify = require('fastify')()
const plugin = require('../')

fastify.register(plugin, (err) => {
  if (err) tap.error(err)
})

fastify.listen(0, (err) => {
  if (err) tap.error(err)
  fastify.server.unref()

  const port = fastify.server.address().port

  test('parses a full URI', (t) => {
    t.plan(8)

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

    http
      .get(`http://127.0.0.1:${port}/one?a=b&c=d#foo`, (res) => {})
      .on('error', t.threw)
  })
})
