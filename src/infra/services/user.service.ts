import type { Pool } from 'pg'

import { MainService } from './main.service.ts'

export class UserService extends MainService {
  constructor(db: Pool) {
    super(db, 'items', [
      { key: 'id', type: 'number' },
      { key: 'name', type: 'string' },
      { key: 'created_at', type: 'string' },
      { key: 'updated_at', type: 'string' },
    ])
  }
}
