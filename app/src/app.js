import { nanoid } from "nanoid";
import express from "express";
import { controller } from "./controllers/index.js";
import { metricsControllerWrapper } from "./utils/metrics.js";

const id = nanoid();
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.setHeader("X-API-Id", id);
  next();
});

app.get("/ping", metricsControllerWrapper("ping", controller.pingPong));

app.get("/metar", metricsControllerWrapper("metar", controller.metar));

app.get(
  "/space_news",
  metricsControllerWrapper("space-news", controller.spaceNews)
);

app.get("/fact", metricsControllerWrapper("fact", controller.fact));

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});
