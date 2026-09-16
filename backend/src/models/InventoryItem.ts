import mongoose, { Document, Schema, model } from "mongoose";

export interface IInventoryItem extends Document {
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  reorderThreshold: number;
  consumptionLog: Array<{
    date: Date;
    quantityUsed: number;
  }>;
  lowStockAlert: boolean;
}

const inventoryItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    currentStock: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    reorderThreshold: { type: Number, required: true, default: 5 },
    consumptionLog: [
      {
        date: { type: Date, default: Date.now },
        quantityUsed: { type: Number, required: true },
      },
    ],
    lowStockAlert: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IInventoryItem>("InventoryItem", inventoryItemSchema);