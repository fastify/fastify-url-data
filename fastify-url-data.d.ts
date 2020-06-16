import { FastifyPlugin } from 'fastify';
import { URIComponents } from 'uri-js'

// Extend FastifyRequest with the "fastify-url-data" function
declare module 'fastify' {
  interface FastifyRequest {
    urlData(): URIComponents
    urlData<K extends keyof URIComponents>(target: K): URIComponents[K]
  }
}

interface UrlDataPluginOptions {}

declare const urlData: FastifyPlugin<UrlDataPluginOptions>

export default urlData
