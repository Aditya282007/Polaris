import express, { Request, Response } from "express";
import InventoryItem from "../models/InventoryItem";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      category,
      lowStock,
      search,
      page = "1",
      limit = "20",
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (lowStock === "true") {
      filter.lowStockAlert = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { unit: { $regex: search, $options: "i" } },
      ];
    }

    const items = await InventoryItem.find(filter)
      .sort({ name: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await InventoryItem.countDocuments(filter);

    res.json({
      items,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
});

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const totalItems = await InventoryItem.countDocuments();
    const lowStockItems = await InventoryItem.countDocuments({
      lowStockAlert: true,
    });

    const categories = await InventoryItem.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalStock: { $sum: "$currentStock" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json({
      totalItems,
      lowStockItems,
      healthyStockItems: totalItems - lowStockItems,
      categories,
    });
  } catch {
    res.status(500).json({
      message: "Failed to fetch inventory statistics",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const item = await InventoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    res.json(item);
  } catch {
    res.status(400).json({
      message: "Invalid inventory item ID",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      category,
      currentStock,
      unit,
      reorderThreshold,
    } = req.body;

    if (!name || !category || !unit) {
      return res.status(400).json({
        message: "name, category and unit are required",
      });
    }

    if (currentStock !== undefined && currentStock < 0) {
      return res.status(400).json({
        message: "currentStock cannot be negative",
      });
    }

    if (reorderThreshold !== undefined && reorderThreshold < 0) {
      return res.status(400).json({
        message: "reorderThreshold cannot be negative",
      });
    }

    const stock = currentStock || 0;
    const threshold = reorderThreshold || 0;

    const item = new InventoryItem({
      name,
      category,
      currentStock: stock,
      unit,
      reorderThreshold: threshold,
      lowStockAlert: stock < threshold,
      consumptionLog: [],
    });

    await item.save();

    res.status(201).json(item);
  } catch {
    res.status(500).json({
      message: "Failed to create inventory item",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const allowedFields = [
      "name",
      "category",
      "unit",
      "reorderThreshold",
    ];

    const updates: any = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.reorderThreshold !== undefined &&
      updates.reorderThreshold < 0
    ) {
      return res.status(400).json({
        message: "reorderThreshold cannot be negative",
      });
    }

    const item = await InventoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    Object.assign(item, updates);

    item.lowStockAlert =
      item.currentStock < item.reorderThreshold;

    await item.save();

    res.json(item);
  } catch {
    res.status(400).json({
      message: "Failed to update inventory item",
    });
  }
});

router.put("/:id/stock", async (req: Request, res: Response) => {
  try {
    const { quantityChange, reason } = req.body;

    if (
      quantityChange === undefined ||
      typeof quantityChange !== "number" ||
      quantityChange === 0
    ) {
      return res.status(400).json({
        message: "quantityChange must be a non-zero number",
      });
    }

    const item = await InventoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    const newStock = item.currentStock + quantityChange;

    if (newStock < 0) {
      return res.status(400).json({
        message: "Stock cannot become negative",
      });
    }

    item.currentStock = newStock;
    item.lowStockAlert =
      item.currentStock < item.reorderThreshold;

    await item.save();

    res.json({
      item,
      stockChange: quantityChange,
      reason: reason || null,
    });
  } catch {
    res.status(400).json({
      message: "Failed to update stock",
    });
  }
});

router.post("/:id/consumption", async (req: Request, res: Response) => {
  try {
    const { quantityUsed, date } = req.body;

    if (
      quantityUsed === undefined ||
      typeof quantityUsed !== "number" ||
      quantityUsed <= 0
    ) {
      return res.status(400).json({
        message: "quantityUsed must be greater than 0",
      });
    }

    const item = await InventoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    if (item.currentStock - quantityUsed < 0) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    item.consumptionLog.push({
      date: date || new Date(),
      quantityUsed,
    });

    item.currentStock -= quantityUsed;
    item.lowStockAlert =
      item.currentStock < item.reorderThreshold;

    await item.save();

    res.json(item);
  } catch {
    res.status(400).json({
      message: "Failed to log consumption",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    res.json({
      message: "Inventory item deleted successfully",
      item,
    });
  } catch {
    res.status(400).json({
      message: "Failed to delete inventory item",
    });
  }
});

export default router;