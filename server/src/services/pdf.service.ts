
import PDFDocument from "pdfkit";
import { getPdfReportData } from "./report.service.js";

export async function generateAssessmentPdf(
  assessmentId: string,
  token: string
): Promise<Buffer> {
  const report = await getPdfReportData(assessmentId, token);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: 45,
        bottom: 45,
        left: 50,
        right: 50,
      },
      info: {
        Title: "Rise in Life Application",
        Author: "Rise in Life Application",
      },
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const addSectionTitle = (title: string) => {
      doc.moveDown(0.8);

      doc
        .font("Helvetica-Bold")
        .fontSize(13)
        .fillColor("#222222")
        .text(title);

      doc.moveDown(0.4);
    };

    const addField = (label: string, value: string) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#333333")
        .text(`${label}: `, { continued: true });

      doc
        .font("Helvetica")
        .fontSize(10)
        .text(value);
    };

    // Report heading
    doc
      .font("Helvetica-Bold")
      .fontSize(21)
      .fillColor("#172554")
      .text("Assessment Report", {
        align: "center",
      });

    doc.moveDown(0.4);

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#666666")
      .text(
        `Completed: ${new Date(report.completedAt).toLocaleString("en-PK")}`,
        { align: "center" }
      );

    doc.moveDown();

    // Patient details
    addSectionTitle("Patient Details");

    addField(
      "Contact Number",
      report.patient.contactNumber || "Not provided"
    );

    addField("Age Group", report.patient.ageGroup || "Not provided");

    addField(
      "Marital Status",
      report.patient.maritalStatus || "Not provided"
    );

    addField(
      "Tobacco Use",
      report.patient.tobaccoUse || "Not provided"
    );

    addField(
      "Conditions",
      report.patient.conditions.length
        ? report.patient.conditions.join(", ")
        : "None provided"
    );

    addField(
      "Consent",
      report.patient.consent ? "Yes" : "No"
    );

    // Questionnaire information
    addSectionTitle("Assessment Questions");

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#666666")
      .text(
        `${report.questionnaire.name} | Version ${report.questionnaire.version}`
      );

    doc.moveDown(0.6);

    // Questions and selected answers
    report.answers.forEach((answer) => {
      const requiredHeight = 65;

      if (doc.y + requiredHeight > doc.page.height - 65) {
        doc.addPage();
      }

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#172554")
        .text(`Question ${answer.questionNumber}`);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#222222")
        .text(answer.question, {
          width: 495,
        });

      doc.moveDown(0.2);

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Selected Answer: ", {
          continued: true,
        });

      doc
        .font("Helvetica")
        .text(answer.selectedAnswer, {
          width: 495,
        });

      doc.moveDown(0.7);
    });

    // Total score
    if (doc.y + 75 > doc.page.height - 55) {
      doc.addPage();
    }

    addSectionTitle("Assessment Summary");

    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor("#172554")
      .text(`Total Score: ${report.totalScore}`, {
        align: "left",
      });

    doc.moveDown(1);

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#777777")
      .text(
        "This document records the information and responses saved by the assessment application. It is not a standalone medical diagnosis."
      );

    doc.end();
  });
}
