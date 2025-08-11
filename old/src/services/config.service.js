import fastifyPostgres from '@fastify/postgres'

/**
 * Configurar la base de datos ingresando las credenciales del env
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 */
export function configDbService(fastify) {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
  }

  // Only for prod
  if (typeof process.env.DB_REJECT_UNAUTHORIZED_SSL === 'undefined') {
    config.ssl = {
      rejectUnauthorized: false,
    }
  }

  fastify.register(fastifyPostgres, config)
}
