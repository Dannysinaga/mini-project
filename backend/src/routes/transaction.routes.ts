import { Router } from "express";
import {
  createTransaction,
  getTransactionHistory,
} from "../controllers/transaction.controller";

const router = Router();

router.post("/", createTransaction);
router.get("/", getTransactionHistory);

export default router;