import { nanoid } from "nanoid";
import express from "express";
import { appRouter, limitedRouter } from "./routers/index.js";

const id = nanoid();
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.setHeader("X-API-Id", id);
  next();
});

app.use("/", appRouter);
app.use("/limited", limitedRouter);

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});
