import mongoose, { Document, Schema, model } from "mongoose";

export interface IPersonnel extends Document {
  name: string;
  role: string;
  currentStation: string;
  status: "checked-in" | "checked-out" | "on-field";
  lastCheckIn: Date;
}

const personnelSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    currentStation: { type: String, required: true },
    status: {
      type: String,
      enum: ["checked-in", "checked-out", "on-field"],
      default: "checked-out",
    },
    lastCheckIn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<IPersonnel>("Personnel", personnelSchema);