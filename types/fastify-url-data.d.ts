import { FastifyPluginCallback } from 'fastify';

type FastifyUrlData = FastifyPluginCallback

declare module 'fastify' {
  interface FastifyRequest {
    urlData<K extends keyof URL>(target: K): URL[K]
    urlData(): URL
  }
}

declare namespace fastifyUrlData {
  export const fastifyUrlData: FastifyUrlData
  export { fastifyUrlData as default }
}

declare function fastifyUrlData(...params: Parameters<FastifyUrlData>): ReturnType<FastifyUrlData>
export = fastifyUrlData
