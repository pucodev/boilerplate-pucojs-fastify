import { UserModel } from '../model/user.model.js'
import { UserService } from '../services/user.service.js'
import { MainController } from './main.controller.js'

export class UserController extends MainController {
  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @param {import('fastify').FastifyRequest<{ Querystring: Record<string, string> }>} request fastify request
   * @param {import('fastify').FastifyReply} reply fastify reply
   */
  static async fetch(fastify, request, reply) {
    try {
      const params = MainController.getQueryParams(request.query)

      const service = new UserService(fastify)
      const items = await service.fetch(params.fields, params.filters)
      reply.send({
        data: items,
      })
    } catch (error) {
      console.error('error ', error)
      reply.status(500).send({
        status: 'Server error',
      })
    }
  }

  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @param {import('fastify').FastifyRequest<{Body: import('../model/user.model.js').UserNode}>} request fastify request
   * @param {import('fastify').FastifyReply} reply fastify reply
   */
  static async insert(fastify, request, reply) {
    try {
      const user = new UserModel(request.body)
      await user.insert(fastify)
      reply.send(user.node)
    } catch (error) {
      console.error('error ', error)
      reply.status(500).send({
        status: 'Server error',
      })
    }
  }

  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @param {import('fastify').FastifyRequest<{Params: {id: number}, Body: import('../model/user.model.js').UserNode}>} request fastify request
   * @param {import('fastify').FastifyReply} reply fastify reply
   */
  static async update(fastify, request, reply) {
    try {
      /** @type {import('../model/user.model.js').UserNode} */
      const data = { ...request.body }
      data.id = request.params.id

      // Validate data if is neccesary
      // if (request.body.email) {
      //   data.email = request.body.email
      // }

      const user = new UserModel(data)
      await user.update(fastify)
      reply.send(user.node)
    } catch (error) {
      console.error('error ', error)
      reply.status(500).send({
        status: 'Server error',
      })
    }
  }
}
