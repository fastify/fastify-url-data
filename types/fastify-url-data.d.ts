import { FastifyPluginCallback } from 'fastify';
import { URIComponents } from 'uri-js'

declare module 'fastify' {
  interface FastifyRequest {
    urlData<K extends keyof URIComponents>(target: K): URIComponents[K]
    urlData(): URIComponents
  }
}

interface UrlDataPluginOptions {}

declare const urlData: FastifyPluginCallback<UrlDataPluginOptions>

export default urlData
