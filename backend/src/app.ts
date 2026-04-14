import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import transactionRoutes from "./routes/transaction.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/transactions", transactionRoutes);

export default app;