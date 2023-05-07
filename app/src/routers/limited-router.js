import express from "express";
import rateLimit from "express-rate-limit";
import { appRouter } from "./app-router.js";

const limiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 50, // Limit each IP to 100 requests per `window` (here, per 10 seconds)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const limitedRouter = express.Router();

limitedRouter.use(limiter);

limitedRouter.use("/", appRouter);

export { limitedRouter };
