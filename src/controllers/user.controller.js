import { MainController } from './main.controller.js'

export class UserController extends MainController {
  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @param {import('fastify').FastifyRequest} request fastify request
   * @param {import('fastify').FastifyReply} reply fastify reply
   */
  static async fetchUsers(fastify, request, reply) {
    reply.send({
      status: 'ok',
    })
  }
}
