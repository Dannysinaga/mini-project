import { Router } from "express";
import { getPointsBalance } from "../controllers/points.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/balance", authMiddleware, getPointsBalance);

export default router;