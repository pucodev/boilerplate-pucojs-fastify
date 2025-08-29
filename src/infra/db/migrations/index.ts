import fs from 'fs'
import path from 'path'
import { Client } from 'pg'
import { fileURLToPath } from 'url'

import { getDbConfig } from '../connection.ts'

const client = new Client(getDbConfig())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MIGRATION_FOLDER = __dirname

/**
 * Run migrations for each sql file in this folder
 */
async function runMigrations(): Promise<void> {
  await client.connect()

  // Create `migrations` table
  // This table is used to track migrations.
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      run_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)

  // Reads all `.sql` files in the current directory.
  const files: string[] = fs
    .readdirSync(MIGRATION_FOLDER)
    .filter((file): file is string => file.endsWith('.sql'))
    .sort()

  for (const file of files) {
    // If migration is already in database, move on.
    const { rows } = await client.query(
      'SELECT * FROM migrations WHERE name = $1',
      [file],
    )

    if (rows.length === 0) {
      const sql = fs.readFileSync(path.join(MIGRATION_FOLDER, file), 'utf8')
      console.log(`Running migration: ${file}`)
      await client.query(sql)
      // Save migration to the DB
      await client.query('INSERT INTO migrations (name) VALUES ($1)', [file])
    } else {
      console.log(`Skipping already run migration: ${file}`)
    }
  }

  await client.end()
  console.log('✅ All migrations complete')
}

runMigrations().catch((err: unknown) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
