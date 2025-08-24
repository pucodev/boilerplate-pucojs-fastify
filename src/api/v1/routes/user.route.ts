import type { FastifyInstance } from 'fastify'

/**
 * User routes
 * @param fastify - fastify instance
 */
export function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', (_request, _reply) => {
    return { hello: 'world' }
  })
}
