import express from "express";
import Resume from "../models/Resume.js";
import PDFDocument from "pdfkit";

const router = express.Router();

// GET all resumes
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET single resume
router.get("/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST create new resume
router.post("/", async (req, res) => {
  try {
    const { title, personal = {}, skills = [] } = req.body;

    const newResume = new Resume({
      title,
      personal,
      skills,
    });

    await newResume.save();
    res.json({ message: "Resume created ✅", resume: newResume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update resume
router.put("/:id", async (req, res) => {
  try {
    const updated = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // ensures schema validation
    });
    if (!updated) return res.status(404).json({ error: "Resume not found" });
    res.json({ message: "✅ Resume updated", resume: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE resume
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Resume.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Resume not found" });
    res.json({ message: "Resume deleted ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// DYNAMIC DOWNLOAD PDF
router.get("/:id/download", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const { title, personal = {}, skills = [] } = resume;
    const fullName = personal.fullName || "";
    const email = personal.email || "";
    const phone = personal.phone || "";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${title}.pdf"`);

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(22).text(title || "Resume", { underline: true });
    doc.moveDown();
    doc.fontSize(16).text(`Name: ${fullName}`);
    doc.text(`Email: ${email}`);
    doc.text(`Phone: ${phone}`);
    doc.text(`Skills: ${skills.join(", ")}`);

    doc.end();
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
