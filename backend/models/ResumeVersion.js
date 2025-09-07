import mongoose from "mongoose";

const resumeVersionSchema = new mongoose.Schema({
  resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
  snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
  note: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("ResumeVersion", resumeVersionSchema);
