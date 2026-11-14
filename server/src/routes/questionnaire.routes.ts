import { Router } from "express";
import { getActiveQuestionnaire } from "../controllers/questionnaire.controller.js";

const router = Router();

router.get("/active", getActiveQuestionnaire);

export default router;