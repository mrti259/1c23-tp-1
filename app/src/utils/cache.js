import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

const set = (key, value, options = {}) => {
  return client.set(key, value, options);
};

const get = (key) => {
  return client.get(key);
};

export const clientRedis = client;
export const cache = { set, get };
