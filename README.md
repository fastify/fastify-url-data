# @fastify/url-data

[![CI](https://github.com/fastify/fastify-url-data/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/fastify/fastify-url-data/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/@fastify/url-data.svg?style=flat)](https://www.npmjs.com/package/@fastify/url-data)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)

A plugin for [Fastify](https://fastify.dev/) that adds support for getting raw
URL information from the request.

## Install
```
npm i @fastify/url-data
```

### Compatibility
| Plugin version | Fastify version |
| ---------------|-----------------|
| `>=6.x`        | `^5.x`          |
| `^5.x`         | `^4.x`          |
| `>=3.x <5.x`   | `^3.x`          |
| `^2.x`         | `^2.x`          |
| `^2.x`         | `^1.x`          |


Please note that if a Fastify version is out of support, then so are the corresponding versions of this plugin
in the table above.
See [Fastify's LTS policy](https://github.com/fastify/fastify/blob/main/docs/Reference/LTS.md) for more details.

## Example

```js
const fastify = require('fastify')()

fastify.register(require('@fastify/url-data'))

fastify.get('/foo', (req, reply) => {
  const urlData = req.urlData()
  req.log.info(urlData.path) // '/foo'
  req.log.info(urlData.query) // 'a=b&c=d'
  req.log.info(urlData.host) // '127.0.0.1'
  req.log.info(urlData.port) // 8080

  // if you just need single data:
  req.log.info(req.urlData('path')) // '/foo'

  reply.send({hello: 'world'})
})

// GET: 'http://127.0.0.1:8080/foo?a=b&c=d
```

## License

Licensed under [MIT](./LICENSE).
