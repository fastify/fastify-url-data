import * as fastify from 'fastify'
import * as urlData from '../..'

const server = fastify();

server.register(urlData)

server.get('/data', (req, reply) => {
  console.log(req.urlData().auth)
  console.log(req.urlData().host)
  console.log(req.urlData().port)
  console.log(req.urlData().query)

  const urlPath: string = req.urlData('path')
  const urlPort: number = req.urlData('port')

  console.log('port is ', urlPort)
  console.log('path is %s and port is %d', urlPath, urlPort)

  reply.send({msg: 'ok'})
})

server.listen(3030)
