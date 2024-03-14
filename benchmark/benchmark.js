const benchmark = require('benchmark')
const Fastify = require('fastify')
const plugin = require('../plugin')

async function getFastify () {
  const fastify = Fastify()
  fastify.register(plugin).after((err) => {
    if (err) console.error(err)
  })

  fastify.get('/one', (req, reply) => {
    req.urlData()
    reply.send()
  })

  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    process.exit(1)
  }

  return fastify
}

const bench = async () => {
  const fastify = await getFastify()

  new benchmark.Suite()
    .add('urlData', async function () {
      await fastify.inject({
        method: 'GET',
        url: '/one?a=b&c=d#foo'
      })
    })
    .on('cycle', function (event) {
      console.log(String(event.target))
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
      fastify.close()
    })
    .run({ async: true })
}

bench()
