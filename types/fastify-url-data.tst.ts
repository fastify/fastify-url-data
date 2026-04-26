import fastify from 'fastify'
import { expect } from 'tstyche'
import urlData from '..'

const server = fastify()

server.register(urlData)

server.get('/data', (req, reply) => {
  expect(req.urlData().path).type.toBe<string | undefined>()
  expect(req.urlData().host).type.toBe<string | undefined>()
  expect(req.urlData().port).type.toBe<string | number | undefined>()
  expect(req.urlData().query).type.toBe<string | undefined>()

  expect(req.urlData('path')).type.toBe<string | undefined>()
  expect(req.urlData('port')).type.toBe<string | number | undefined>()

  reply.send({ msg: 'ok' })
})

server.listen({ port: 3030 })

server.inject({
  method: 'GET',
  url: '/data'
})
