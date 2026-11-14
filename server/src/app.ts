import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "IIEF API is running",
  });
});

// Register API routes here.
// Example:
// app.use("/api/v1/questionnaires", questionnaireRoutes);
// app.use("/api/v1/assessments", assessmentRoutes);
// app.use("/api/v1/doctors", doctorRoutes);
// app.use("/api/v1/reports", reportRoutes);

export default app;