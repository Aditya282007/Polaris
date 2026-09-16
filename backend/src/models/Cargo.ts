import mongoose, { Document, Schema, model } from "mongoose";

export interface ICargo extends Document {
  itemName: string;
  category: string;
  quantity: number;
  currentLocation: string;
  status: "packed" | "in-transit" | "arrived";
  assignedMission?: mongoose.Types.ObjectId;
}

const cargoSchema: Schema = new Schema(
  {
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    currentLocation: { type: String, required: true },
    status: { type: String, enum: ["packed", "in-transit", "arrived"], default: "packed" },
    assignedMission: { type: mongoose.Schema.Types.ObjectId, ref: "Mission" },
  },
  { timestamps: true }
);

export default model<ICargo>("Cargo", cargoSchema);