import type { DbField } from '#services/main.service'
import { getQuery } from '#utils/queryService'

const dbFields: DbField[] = [
  { key: 'id', type: 'number' },
  { key: 'name', type: 'string' },
  { key: 'email', type: 'string' },
]

describe('getQuery', () => {
  it('should build a query with selected fields', () => {
    const query = { fields: 'id,name' }

    const result = getQuery(query, dbFields, 'users')

    expect(result.sql).toBe('SELECT id,name FROM users')
    expect(result.values).toEqual([])
  })

  it('should apply string operator (icontains)', () => {
    const query = '?fields=id,name&search.name__icontains=john'

    const result = getQuery(query, dbFields, 'users')

    expect(result.sql).toBe('SELECT id,name FROM users WHERE name ILIKE $1')
    expect(result.values).toEqual(['%john%'])
  })

  it('should apply numeric operator (gte)', () => {
    const query = '?fields=id,name&search.id__gte=10'

    const result = getQuery(query, dbFields, 'users')

    expect(result.sql).toBe('SELECT id,name FROM users WHERE id >= $1')
    expect(result.values).toEqual([10])
  })

  it('should combine multiple conditions with AND (default)', () => {
    const query = '?fields=id,name&search.name__icontains=john&search.id__gt=5'

    const result = getQuery(query, dbFields, 'users')

    expect(result.sql).toBe(
      'SELECT id,name FROM users WHERE name ILIKE $1 AND id > $2',
    )
    expect(result.values).toEqual(['%john%', 5])
  })

  it('should combine multiple conditions with OR', () => {
    const query =
      '?fields=id,name&search_operator=or&search.name__icontains=john&search.email__icontains=doe'

    const result = getQuery(query, dbFields, 'users')

    expect(result.sql).toBe(
      'SELECT id,name FROM users WHERE name ILIKE $1 OR email ILIKE $2',
    )
    expect(result.values).toEqual(['%john%', '%doe%'])
  })

  it('should skip invalid fields silently', () => {
    const query = '?fields=id,invalidField&search.invalidField__icontains=test'

    const result = getQuery(query, dbFields, 'users')

    // "invalidField" should be ignored completely
    expect(result.sql).toBe('SELECT id FROM users')
    expect(result.values).toEqual([])
  })

  it('should handle query with no conditions', () => {
    const query = '?fields=id'

    const result = getQuery(query, dbFields, 'users')

    expect(result.sql).toBe('SELECT id FROM users')
    expect(result.values).toEqual([])
  })

  it('should show all valid fields if query is empty', () => {
    const query = ''

    const result = getQuery(query, dbFields, 'users')

    expect(result.sql).toBe('SELECT id,name,email FROM users')
    expect(result.values).toEqual([])
  })
})
