import { FastifyPluginCallback } from 'fastify';
import { URIComponents } from 'uri-js'

type FastifyUrlData = FastifyPluginCallback

declare module 'fastify' {
  interface FastifyRequest {
    urlData<K extends keyof URIComponents>(target: K): URIComponents[K]
    urlData(): URIComponents
  }
}

declare namespace fastifyUrlData {
  export const fastifyUrlData: FastifyUrlData
  export { fastifyUrlData as default }
}

declare function fastifyUrlData(...params: Parameters<FastifyUrlData>): ReturnType<FastifyUrlData>
export = fastifyUrlData
