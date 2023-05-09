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

const lPush = (key, value) => {
  return client.lPush(key, value);
};

const rPop = (key) => {
  return client.rPop(key);
};

export const cache = { set, get, lPush, rPop };
