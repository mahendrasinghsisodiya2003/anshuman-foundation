import fs from "fs";
import { jsPDF } from "jspdf";

export const generateResumePDF = async ({ title, personal, skills }, filename) => {
  const { fullName = "", email = "" } = personal;

  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text(title || "Resume", 20, 20);

  doc.setFontSize(16);
  doc.text(`Name: ${fullName}`, 20, 40);
  doc.text(`Email: ${email}`, 20, 50);
  doc.text("Skills: " + (skills?.join(", ") || ""), 20, 60);

  const pdfBuffer = doc.output("arraybuffer");
  const dir = "./pdfs";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const filePath = `${dir}/${filename}`;
  fs.writeFileSync(filePath, Buffer.from(pdfBuffer));

  return filePath;
};
