import Fastify from 'fastify'
import { v1Routes } from './routes/v1/v1.route.js'

const fastify = Fastify({
  logger: true,
})

fastify.register(v1Routes, { prefix: '/api/v1' })

/**
 * Run the server!
 */
async function start() {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
