import { FastifyPluginCallback } from 'fastify'
import { URIComponent } from 'fast-uri'

type FastifyUrlData = FastifyPluginCallback

declare module 'fastify' {
  interface FastifyRequest {
    urlData<K extends keyof URIComponent>(target: K): URIComponent[K]
    urlData(): URIComponent
  }
}

declare namespace fastifyUrlData {
  export const fastifyUrlData: FastifyUrlData
  export { fastifyUrlData as default }
}

declare function fastifyUrlData (...params: Parameters<FastifyUrlData>): ReturnType<FastifyUrlData>
export = fastifyUrlData
