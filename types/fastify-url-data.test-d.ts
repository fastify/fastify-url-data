import fastify from 'fastify'
import { expectType } from 'tsd'
import urlData from '..'

const server = fastify();

server.register(urlData)

server.get('/data', (req, reply) => {
  expectType<string|''>(req.urlData().pathname);
  expectType<string|''>(req.urlData().hostname);
  expectType<string|''>(req.urlData().port);
  expectType<string|''>(req.urlData().search);

  expectType<string|''>(req.urlData('pathname'));
  expectType<string|''>(req.urlData('port'));

  reply.send({msg: 'ok'})
})

server.listen({ port: 3030 })

server.inject({
  method: 'GET',
  url: '/data'
})
