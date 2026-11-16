import { generateAssessmentPdf } from "../services/pdf.service.js";
// Extract the report access token from Authorization header.
function getBearerToken(req) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return null;
    }
    const match = authorization.match(/^Bearer\s+([a-f0-9]{64})$/i);
    return match ? match[1] : null;
}
// Download the generated assessment PDF.
export async function downloadPdfReport(req, res) {
    try {
        const assessmentId = req.params.assessmentId;
        const token = getBearerToken(req);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "A valid report access token is required.",
            });
        }
        if (!assessmentId ||
            typeof assessmentId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid assessment ID.",
            });
        }
        const pdfBuffer = await generateAssessmentPdf(assessmentId, token);
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="assessment-report-${assessmentId}.pdf"`);
        return res.status(200).send(pdfBuffer);
    }
    catch (error) {
        if (error instanceof Error &&
            error.message === "REPORT_NOT_FOUND_OR_EXPIRED") {
            return res.status(404).json({
                success: false,
                message: "Report not found or access has expired.",
            });
        }
        console.error("PDF report generation failed:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to generate the PDF report.",
        });
    }
}
//# sourceMappingURL=report.controller.js.map