import type { FastifyInstance } from 'fastify'

import { userRoutes } from '#routes/user.route'

/**
 * V1 Api routes
 * @param fastify - fastify instance
 */
export default async function v1Routes(fastify: FastifyInstance) {
  fastify.register(userRoutes, { prefix: '/users' })
}
