import { Router } from "express";
import {
  createEvent,
  getEventDetail,
  getEvents,
} from "../controllers/event.controller";

const router = Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.get("/:id", getEventDetail);

export default router;