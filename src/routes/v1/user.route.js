import { UserController } from '../../controllers/user.controller.js'

/**
 * Routes
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {object} _options plugin options
 */
export function userRoutes(fastify, _options) {
  fastify.get('/', (request, reply) => {
    UserController.fetchUsers(fastify, request, reply)
  })
}
