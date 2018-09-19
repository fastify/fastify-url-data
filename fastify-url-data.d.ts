import { FastifyRequest } from 'fastify';
import { UrlObject } from 'url';

interface FastifyUrlData {
  path: string
  host: string
  port: number
  query: string
}

// Extend FastifyReply with the "fastify-url-data" function
declare module 'fastify' {
  interface FastifyRequest<HttpRequest> {
    urlData (): UrlObject
    urlData (target: string): string
    urlData (target: 'port'): number
  }
}

// Factory function definition for fastify-url-data
declare function urlData (): void

declare namespace urlData {}

export = urlData;
