import { Router } from "express";
import { downloadPdfReport, } from "../controllers/report.controller.js";
const router = Router();
router.get("/:assessmentId/pdf", downloadPdfReport);
export default router;
//# sourceMappingURL=report.routes.js.map