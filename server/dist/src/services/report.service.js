import { createHash } from "node:crypto";
import prisma from "../config/db.js";
function hashReportToken(token) {
    return createHash("sha256").update(token).digest("hex");
}
export async function getPdfReportData(assessmentId, token) {
    if (!assessmentId || !token) {
        throw new Error("INVALID_REPORT_ACCESS");
    }
    const tokenHash = hashReportToken(token);
    const assessment = await prisma.assessment.findFirst({
        where: {
            id: assessmentId,
            reportAccessTokenHash: tokenHash,
            reportAccessExpiresAt: {
                gt: new Date(),
            },
            status: "COMPLETED",
        },
        include: {
            patient: true,
            questionnaire: true,
            answers: {
                orderBy: {
                    question: {
                        questionNumber: "asc",
                    },
                },
                include: {
                    question: true,
                    answerOption: true,
                },
            },
        },
    });
    if (!assessment) {
        throw new Error("REPORT_NOT_FOUND_OR_EXPIRED");
    }
    return {
        questionnaire: {
            name: assessment.questionnaire.name,
            language: assessment.questionnaire.language,
            version: assessment.questionnaire.version,
        },
        patient: {
            contactNumber: assessment.patient.contactNumber,
            ageGroup: assessment.patient.ageGroup,
            maritalStatus: assessment.patient.maritalStatus,
            tobaccoUse: assessment.patient.tobaccoUse,
            conditions: assessment.patient.conditions,
            consent: assessment.patient.consent,
        },
        answers: assessment.answers.map((answer) => ({
            questionNumber: answer.question.questionNumber,
            question: answer.question.questionText,
            selectedAnswer: answer.answerOption.optionText,
        })),
        totalScore: assessment.totalScore,
        completedAt: assessment.completedAt,
    };
}
//# sourceMappingURL=report.service.js.map