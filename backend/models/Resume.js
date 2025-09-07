import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    personal: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    skills: [{ type: String }],
    pdfPath: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);
