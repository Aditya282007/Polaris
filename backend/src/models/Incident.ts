import mongoose, { Document, Schema, model } from "mongoose";

export interface IIncident extends Document {
  reportedBy: mongoose.Types.ObjectId;
  rawText: string;
  parsedType: string;
  parsedSeverity: "low" | "medium" | "high" | "critical";
  location: string;
  status: "open" | "in-progress" | "resolved";
  relatedEntity: "cargo" | "personnel" | null;
  relatedEntityId: mongoose.Types.ObjectId | null;
  createdAt: Date;
}

const incidentSchema: Schema = new Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rawText: { type: String, required: true },
    parsedType: { type: String, default: "" },
    parsedSeverity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
    relatedEntity: { type: String, enum: ["cargo", "personnel", null], default: null },
    relatedEntityId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

export default model<IIncident>("Incident", incidentSchema);