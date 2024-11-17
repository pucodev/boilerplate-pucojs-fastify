import { MainService } from './main.service.js'

export class UserService extends MainService {
  static TABLE_NAME = 'users'

  /**
   * Create service
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   */
  constructor(fastify) {
    super(fastify, UserService.TABLE_NAME, [
      'id',
      'firstname',
      'lastname',
      'email',
    ])
  }
}
