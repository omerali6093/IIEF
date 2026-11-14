import express from "express";
import cors from "cors";
import helmet from "helmet";

import questionnaireRoutes from "./routes/questionnaire.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "IIEF API is running",
  });
});

// Questionnaire routes
app.use(
  "/api/v1/questionnaires",
  questionnaireRoutes
);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

export default app;