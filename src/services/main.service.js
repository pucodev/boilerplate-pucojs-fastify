import format from 'pg-format'

export class MainService {
  /**
   * Create service
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @param {string} tableName table name
   * @param {string[]} fields array with all editable table fields
   */
  constructor(fastify, tableName, fields) {
    this._fastify = fastify
    this._tableName = tableName
    this._fields = fields
    this._id = 'id'
  }

  async connect() {
    return await this._fastify.pg.connect()
  }

  /**
   * Analiza el objeto data y devuelve un nuevo objeto solo con los parametros validos definidos en fields
   * @param {object} data Objeto a procesar
   * @returns {object} Nuevo objeto solo con parametros validos
   */
  getValidData(data) {
    const fields = this._fields
    const validData = {}
    fields.forEach(field => {
      if (typeof data[field] !== 'undefined') {
        validData[field] = data[field]
      }
    })
    return validData
  }

  /**
   * Agrega registro a la base de datos
   * @param {object} data Objeto a agregar a la base de datos
   * @returns {Promise<object>} Elemento guardado
   */
  async insert(data) {
    const client = await this.connect()

    try {
      // Validate data
      const validData = this.getValidData(data)

      // Compute fields and values to insert
      const fields = []
      const values = []
      for (const key in validData) {
        fields.push(key)
        values.push(validData[key])
      }

      const sql = format(
        'INSERT INTO %I (%I) VALUES (%L) RETURNING *',
        this._tableName,
        fields,
        values,
      )
      const { rows } = await client.query(
        // Query
        sql,
        // Parameters
        [],
      )

      if (Array.isArray(rows)) {
        return rows[0]
      }

      return rows
    } finally {
      client.release()
    }
  }
}
