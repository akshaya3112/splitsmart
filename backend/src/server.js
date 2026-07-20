import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { groupsRouter } from "./routes/groups.js";
import { expensesRouter } from "./routes/expenses.js";
import { settlementsRouter } from "./routes/settlements.js";
import { errorHandler, notFoundHandler } from "./utils/errors.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Basic rate limiting — protects the API from accidental hammering or abuse.
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health check endpoint — this is what the AWS Application Load Balancer
// polls to decide whether this container is healthy and should receive
// traffic. Keep this fast and dependency-free.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/groups", groupsRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/settlements", settlementsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SplitSmart API listening on port ${PORT}`);
});
