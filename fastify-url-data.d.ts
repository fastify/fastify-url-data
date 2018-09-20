import { FastifyRequest } from 'fastify';
import { URIComponents } from 'uri-js'

interface FastifyUrlData {
  path: string
  host: string
  port: number
  query: string
}

// Extend FastifyReply with the "fastify-url-data" function
declare module 'fastify' {
  interface FastifyRequest<HttpRequest> {
    urlData (): URIComponents
    urlData <K extends keyof URIComponents>(target: K): URIComponents[K]
  }
}

// Factory function definition for fastify-url-data
declare function urlData (): void

declare namespace urlData {}

export = urlData;
