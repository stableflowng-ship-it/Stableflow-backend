//
import Redis from 'ioredis';
import { envHelper } from './env.helper';

export const redis = new Redis({
  host: envHelper.redis.host,
  port: Number(envHelper.redis.port),
  password: envHelper.redis.pass,
  username: envHelper.redis.user,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    console.log(`🔁 Reconnecting to Redis... attempt ${times}, waiting ${delay}ms`);
    return delay;
  },
  reconnectOnError(err) {
    console.error('🔴 Redis reconnect on error:', err);
    return true;
  },
});

redis.on('connect', () => {
  console.log('🟢 Redis connected');
});

redis.on('ready', () => {
  console.log('✅ Redis ready to use');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

redis.on('close', () => {
  console.warn('⚠️ Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});


export const sendOtp = async (email: string): Promise<string> => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  await redis.set(`${email}-otp`, otp, 'EX', 15 * 60) // expires in 15 mins
  return otp
}

export const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
  const storedOtp = await redis.get(`${email}-otp`);
  if (!storedOtp || storedOtp !== otp) {
    return false;
  }
  await redis.del(`${email}-otp`)
  return true
}