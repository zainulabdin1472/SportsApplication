import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import pino from "pino";
import { env } from "./config/env.js";
import { authContext } from "./middleware/auth-context.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { listingsRouter } from "./modules/listings/listings.routes.js";

export function buildApp() {
  const app = express();
  const logger = pino({ level: env.NODE_ENV === "production" ? "info" : "debug" });

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",")
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use(authContext);

  app.use("/api/v1/health", healthRouter);
  app.use("/api/v1/listings", listingsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
