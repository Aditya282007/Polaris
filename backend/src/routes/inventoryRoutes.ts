import express, { Request, Response } from "express";
import InventoryItem from "../models/InventoryItem";

const router = express.Router();

// Get all inventory items
router.get("/", async (req: Request, res: Response) => {
  const items = await InventoryItem.find();
  res.json(items);
});

// Create inventory item
router.post("/", async (req: Request, res: Response) => {
  const { name, category, currentStock, unit, reorderThreshold } = req.body;
  const item = new InventoryItem({
    name,
    category,
    currentStock,
    unit,
    reorderThreshold,
  });
  await item.save();
  res.status(201).json(item);
});

// Update stock (add/remove)
router.put("/:id/stock", async (req: Request, res: Response) => {
  const { quantityChange, reason } = req.body;
  const item = await InventoryItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Inventory item not found" });

  item.currentStock += quantityChange;
  if (item.currentStock < item.reorderThreshold) {
    item.lowStockAlert = true;
  } else {
    item.lowStockAlert = false;
  }
  await item.save();
  res.json(item);
});

// Log consumption
router.post("/:id/consumption", async (req: Request, res: Response) => {
  const { quantityUsed, date } = req.body;
  const item = await InventoryItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Inventory item not found" });

  item.consumptionLog.push({ date: date || new Date(), quantityUsed });
  item.currentStock -= quantityUsed;
  if (item.currentStock < item.reorderThreshold) {
    item.lowStockAlert = true;
  } else {
    item.lowStockAlert = false;
  }
  await item.save();
  res.json(item);
});

export default router;