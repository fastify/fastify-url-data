
import * as fastify from 'fastify'
import * as urlData from '../'

const server = fastify();

server.register(urlData)

server.get('/data', (req, reply) => {
  console.log(req.urlData().auth)
  console.log(req.urlData().host)
  console.log(req.urlData().port)
  console.log(req.urlData().query)

  reply.send({msg: 'ok'})
})

server.listen(3030)
