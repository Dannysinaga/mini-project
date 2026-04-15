import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/userRoutes"; 

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
// app.use("/users", userRoutes);

export default app;