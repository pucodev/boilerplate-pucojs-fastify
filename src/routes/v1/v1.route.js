import { userRoutes } from './user.route.js'

/**
 * Routes
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {object} _options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
export function v1Routes(fastify, _options) {
  fastify.register(userRoutes, { prefix: '/users' })
}
