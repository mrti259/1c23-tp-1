import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

const set = (key, value) => {
  return client.set(key, value);
};

const get = (key) => {
  return client.get(key);
};

export const cache = { set, get };
