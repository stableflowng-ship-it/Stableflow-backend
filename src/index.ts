// 

import app from "./app";
import { redis } from "./config/redis.config";
import { AppDataSource } from "./data-source";


const startServer = async () => {
  try {
    await AppDataSource.initialize()
    console.log('🛢️  Database connected')

    await app.listen({ port: 5011, host: '0.0.0.0' })
    console.log('🚀 Server running at http://localhost:5011');
    console.info('Check Docs on http://localhost:5011/docs');

    redis.ping().then((res) => {
      if (res === 'PONG') {
        console.log('📡 Redis ping success');
      } else {
        console.warn('⚠️ Redis ping failed');
      }
    });
  } catch (e) {
    app.log.error(e)
    process.exit(1)
  }
}

startServer()
