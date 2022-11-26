const redis = require('redis');

const redis_pass = process.env.REDIS_PASSWORD
const redis_host = process.env.REDIS_HOST
const redis_port = process.env.REDIS_PORT

function redisClient() {
  const client = redis.createClient({
    url: `redis://default:${redis_pass}@${redis_host}:${redis_port}`
  });
  client.on('error', (err) => {
    console.log("Error " + err);
  })
  return client;
}

module.exports = {redisClient};