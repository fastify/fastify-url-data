import { FastifyRequest } from 'fastify';
import { URIComponents } from 'uri-js'

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
