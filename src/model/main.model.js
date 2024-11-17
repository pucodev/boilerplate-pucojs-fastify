import { MainService } from '../services/main.service.js'

export class MainModel {
  /**
   * Create model
   * @param {object} node model node
   */
  constructor(node) {
    this.node = node
  }

  /**
   * @param {MainService} service model service
   * @returns {Promise<object>} model node
   */
  async _insert(service) {
    const item = await service.insert(this.node)
    return item
  }

  /**
   * @param {MainService} service model service
   * @returns {Promise<object>} model node
   */
  async _update(service) {
    const item = await service.update(this.node.id, this.node)
    return item
  }
}
