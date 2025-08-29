import type { Pool } from 'pg'
import format from 'pg-format'

import { toNumberSafe } from '#utils/index'
import parseQueryParams from '#utils/query'

export interface DbField {
  key: string
  type: 'string' | 'number'
}

export type StringOperator =
  | 'exact'
  | 'iexact'
  | 'contains'
  | 'icontains'
  | 'startswith'
  | 'istartswith'
  | 'endswith'
  | 'iendswith'

export type NumberOperator = 'exact' | 'gt' | 'gte' | 'lt' | 'lte'

export const DEFAULT_FIELD_OPERATORS: Record<
  StringOperator,
  (field: string, value: string) => string
> = {
  exact(field: string, value: string) {
    return format('%I = %L', field, value)
  },
  iexact(field: string, value: string) {
    return format('UPPER(%I) = UPPER(%L)', field, value)
  },
  contains(field: string, value: string) {
    return format('%I LIKE %L', field, `%${value}%`)
  },
  icontains(field: string, value: string) {
    return format('%I ILIKE %L', field, `%${value}%`)
  },
  startswith(field: string, value: string) {
    return format('%I LIKE %L', field, `${value}%`)
  },
  istartswith(field: string, value: string) {
    return format('%I ILIKE %L', field, `${value}%`)
  },
  endswith(field: string, value: string) {
    return format('%I LIKE %L', field, `%${value}`)
  },
  iendswith(field: string, value: string) {
    return format('%I ILIKE %L', field, `%${value}`)
  },
}

/**
 * Safely formats a numeric filter condition for SQL queries.
 *
 * This function ensures that the provided `value` is a valid number
 * (integer or float). If the value cannot be parsed into a valid number,
 * it will throw an error. The `field` name and `operator` are safely
 * escaped using `pg-format` to prevent SQL injection.
 *
 * @param field - The database column name to filter by.
 * @param value - The value to be compared, expected to represent a number.
 * @param operator - The SQL comparison operator (e.g., `=`, `>`, `<`, `>=`, `<=`).
 *
 * @returns A SQL snippet representing the safe numeric condition.
 *
 * @throws {Error} If the `value` is not a valid number.
 *
 * @example
 * ```ts
 * // Generates: "age >= 21"
 * const query = formatFilterNumberQuery('age', '21', '>=')
 * ```
 */
function formatFilterNumberQuery(
  field: string,
  value: string,
  operator: string,
): string {
  return format(`%I ${operator} %s`, field, toNumberSafe(value))
}

export const NUMBER_FIELD_OPERATORS: Record<
  NumberOperator,
  (field: string, value: string) => string
> = {
  exact(field: string, value: string) {
    return formatFilterNumberQuery(field, value, '=')
  },
  gt(field: string, value: string) {
    return formatFilterNumberQuery(field, value, '>')
  },
  gte(field: string, value: string) {
    return formatFilterNumberQuery(field, value, '>=')
  },
  lt(field: string, value: string) {
    return formatFilterNumberQuery(field, value, '<')
  },
  lte(field: string, value: string) {
    return formatFilterNumberQuery(field, value, '<=')
  },
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

    // Create deafault pg query with selected `fields`
    let dbQuery = format(
      'SELECT %I FROM %I',
      parsedQuery.fields,
      this.tableName,
    )

    // Add WHERE clause if query has search fields
    if (parsedQuery.search.operator !== 'disabled') {
      const conditions = parsedQuery.search.conditions
        .map(item => {
          // Verificamos que el `search field` sea valido con los `dbFields`
          const dbField = this.dbFields.find(f => f.key === item.field)

          if (!dbField) {
            return ''
          }

          const operator = item.operator as StringOperator | NumberOperator
          const value = String(item.value).trim()

          // Add operator to number
          if (dbField?.type === 'number') {
            // Transformamos el operator string al operator para la base de datos
            // Por ejemplo:
            // - `exact` se transforma a `=`
            // - `gt` se transforma a `>`
            const operatorFn =
              NUMBER_FIELD_OPERATORS[operator as NumberOperator]
            if (operatorFn && typeof operatorFn === 'function') {
              try {
                return operatorFn(item.field, value)
              } catch (error) {
                return ''
              }
            }
          } else {
            const operatorFn =
              DEFAULT_FIELD_OPERATORS[operator as StringOperator]
            if (operatorFn && typeof operatorFn === 'function') {
              return operatorFn(item.field, value)
            }
          }

          return ''
        })
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
