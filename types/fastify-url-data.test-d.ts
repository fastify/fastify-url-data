import fastify from 'fastify'
import { expectType } from 'tsd'
import urlData from '..'

const server = fastify();

server.register(urlData)

server.get('/data', (req, reply) => {
  console.log(req.urlData)
  expectType<string|undefined>(req.urlData().path);
  expectType<string|undefined>(req.urlData().host);
  expectType<string|number|undefined>(req.urlData().port);
  expectType<string|undefined>(req.urlData().query);

  expectType<string|undefined>(req.urlData('path'));
  expectType<string|number|undefined>(req.urlData('port'));

  reply.send({msg: 'ok'})
})

server.listen({ port: 3030 })

server.inject({
  method: 'GET',
  url: '/data'
})
