import express from "express";
import { controller } from "../controllers/index.js";
import { metricsControllerWrapper } from "../utils/metrics.js";

const appRouter = express.Router();

appRouter.get("/ping", metricsControllerWrapper("ping", controller.pingPong));

appRouter.get("/metar", metricsControllerWrapper("metar", controller.metar));

appRouter.get(
  "/space_news",
  metricsControllerWrapper("space-news", controller.spaceNews)
);

appRouter.get("/fact", metricsControllerWrapper("fact", controller.fact));

export { appRouter };
