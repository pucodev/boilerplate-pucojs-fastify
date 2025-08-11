import { UserController } from '../../controllers/user.controller.js'

/**
 * Routes
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {object} _options plugin options
 */
export function userRoutes(fastify, _options) {
  fastify.get('/', (request, reply) => {
    UserController.fetch(fastify, request, reply)
  })

  fastify.post('/', (request, reply) => {
    UserController.insert(fastify, request, reply)
  })

  fastify.patch('/:id', (request, reply) => {
    UserController.update(fastify, request, reply)
  })
}
