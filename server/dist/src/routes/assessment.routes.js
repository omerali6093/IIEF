import { Router } from "express";
import { submitAssessment } from "../controllers/assessment.controller.js";
const router = Router();
router.post("/", submitAssessment);
export default router;
//# sourceMappingURL=assessment.routes.js.map