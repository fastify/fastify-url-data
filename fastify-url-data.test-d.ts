import * as fastify from 'fastify'
import { expectType } from 'tsd-check'
import * as urlData from './'

const server = fastify();

server.register(urlData)

server.get('/data', (req, reply) => {
  expectType<string>(req.urlData().path);
  expectType<string>(req.urlData().host);
  expectType<string|number>(req.urlData().port);
  expectType<string>(req.urlData().query);

  expectType<string>(req.urlData('path'));
  expectType<string|number>(req.urlData('port'));

  reply.send({msg: 'ok'})
})

server.listen(3030)
