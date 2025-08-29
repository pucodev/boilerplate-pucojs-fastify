import type { Pool } from 'pg'

import { getQuery } from '#utils/queryService'

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
    const data = getQuery(query, this.dbFields, this.tableName)
    return await this.db.query(data.sql, data.values)
  }
}
