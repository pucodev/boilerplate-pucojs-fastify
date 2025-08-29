import type { Pool } from 'pg'
import format from 'pg-format'

import { toNumberSafe } from '#utils/index'
import parseQueryParams from '#utils/query'

export interface DbField {
  key: string
  type: 'string' | 'number'
}
export class MainService {
  public tableName: string
  public dbFields: DbField[]
  public db: Pool

  constructor(db: Pool, tableName: string, dbFields: DbField[]) {
    this.tableName = tableName
    this.dbFields = dbFields
    this.db = db
  }

  async query(query: string | Record<string, string | readonly string[]>) {
    // Get parsedData with `fields` and `search`
    const parsedQuery = parseQueryParams(query, {
      validFields: this.dbFields.map(f => f.key),
    })
    console.log('PARSED DATA  = ', parsedQuery)

    // Create deafault pg query with selected `fields`
    let dbQuery = format(
      'SELECT %I FROM %I',
      parsedQuery.fields,
      this.tableName,
    )

    // Add WHERE clause if query has search fields
    if (parsedQuery.search.operator !== 'disabled') {
      const conditions = Object.entries(parsedQuery.search.conditions)
        .map(([key, value]) => {
          if (this.dbFields.find(v => v.key === key)?.type === 'number') {
            try {
              return format('%I = %s', key, toNumberSafe(value))
            } catch (error) {
              return ''
            }
          }
          return format('%I ILIKE %L', key, `%${value}%`)
        })
        // Remove empty search keys
        .filter(v => v.trim() !== '')

      // Add condition based on `parsedQuery` search operator
      const whereClause = conditions.join(
        parsedQuery.search.operator === 'or' ? ' OR ' : ' AND ',
      )

      // Add WHERE clause
      dbQuery = `${dbQuery} WHERE ${whereClause}`
    }

    console.log('QUERY = ', dbQuery)
    return await this.db.query(dbQuery, [])
  }
}
