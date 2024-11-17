import { UserModel } from '../model/user.model.js'
import { MainController } from './main.controller.js'

export class UserController extends MainController {
  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @param {import('fastify').FastifyRequest} request fastify request
   * @param {import('fastify').FastifyReply} reply fastify reply
   */
  static async fetch(fastify, request, reply) {
    reply.send({
      status: 'ok',
    })
  }

  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @param {import('fastify').FastifyRequest} request fastify request
   * @param {import('fastify').FastifyReply} reply fastify reply
   */
  static async insert(fastify, request, reply) {
    const user = new UserModel({
      firstname: 'demo firstname',
      lastname: 'demo lastname',
      email: 'demo email',
    })
    await user.insert(fastify)
    reply.send(user.node)
  }
}
