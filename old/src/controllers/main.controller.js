/**
 * @typedef {object} QueryFilter
 * @property {string} field field name
 * @property {string} [logic] logic to compare, example: =, >, >=
 * @property {string | number} value value to filter
 */

export class MainController {
  static RESERVED_QUERY_PARAMS = ['fields']

  /**
   * Analizamos un query params y devolvemos los fields a mostrar y el filtro que se tiene que hacer a la base de datos
   * @param {Record<string, string>} query query params
   * @returns {{fields: string[], filters: QueryFilter[]}} query params
   */
  static getQueryParams(query) {
    let fields = []
    if (query.fields) {
      fields = query.fields.split(',').map(field => field.trim())
    }

    /** @type {QueryFilter[]} */
    const filters = []
    for (const key in query) {
      if (!['fields'].includes(key)) {
        filters.push({
          field: key,
          value: query[key],
          logic: '=',
        })
      }
    }

    return { fields, filters }
  }
}
