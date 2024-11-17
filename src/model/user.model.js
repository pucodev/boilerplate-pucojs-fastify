import { UserService } from '../services/user.service.js'
import { MainModel } from './main.model.js'
/**
 * @typedef {object} UserNode
 * @property {number} [id] user id
 * @property {string} [firstname] user first name
 * @property {string} [lastname] user last name
 * @property {string} [email] user email
 */
export class UserModel extends MainModel {
  /** @param {UserNode} node user node  */
  constructor(node) {
    super(node)

    /** @type {UserNode} */
    this.node = node
  }

  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @returns {Promise<UserModel>} update node and return model
   */
  async insert(fastify) {
    const service = new UserService(fastify)
    const item = await super._insert(service)
    this.node = item
    return this
  }
}
