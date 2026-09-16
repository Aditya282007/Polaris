import mongoose, { Document, Schema, model } from "mongoose";

export interface IMission extends Document {
  name: string;
  legs: Array<{
    from: string;
    to: string;
    startDate: Date;
    endDate: Date;
  }>;
  team: Array<mongoose.Types.ObjectId>;
  cargoManifest: Array<mongoose.Types.ObjectId>;
  status: "planning" | "active" | "completed" | "cancelled";
}

const missionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    legs: [
      {
        from: { type: String, required: true },
        to: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
      },
    ],
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Personnel" }],
    cargoManifest: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cargo" }],
    status: {
      type: String,
      enum: ["planning", "active", "completed", "cancelled"],
      default: "planning",
    },
  },
  { timestamps: true }
);

export default model<IMission>("Mission", missionSchema);