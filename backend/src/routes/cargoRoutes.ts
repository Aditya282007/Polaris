import express, { Request, Response } from "express";
import Cargo from "../models/Cargo";

const router = express.Router();

const VALID_STATUSES = [
  "packed",
  "in-transit",
  "delivered",
  "delayed",
  "lost",
];

router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      status,
      category,
      mission,
      search,
      page = "1",
      limit = "20",
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const filter: any = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (mission) filter.assignedMission = mission;

    if (search) {
      filter.$or = [
        { itemName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { currentLocation: { $regex: search, $options: "i" } },
      ];
    }

    const cargo = await Cargo.find(filter)
      .populate("assignedMission")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Cargo.countDocuments(filter);

    res.json({
      cargo,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch {
    res.status(500).json({
      message: "Failed to fetch cargo",
    });
  }
});

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await Cargo.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result: Record<string, number> = {
      total: 0,
      packed: 0,
      "in-transit": 0,
      delivered: 0,
      delayed: 0,
      lost: 0,
    };

    stats.forEach((item) => {
      if (item._id in result) {
        result[item._id] = item.count;
      }

      result.total += item.count;
    });

    res.json(result);
  } catch {
    res.status(500).json({
      message: "Failed to fetch cargo statistics",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const cargo = await Cargo.findById(req.params.id)
      .populate("assignedMission");

    if (!cargo) {
      return res.status(404).json({
        message: "Cargo not found",
      });
    }

    res.json(cargo);
  } catch {
    res.status(400).json({
      message: "Invalid cargo ID",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      itemName,
      category,
      quantity,
      currentLocation,
      status,
      assignedMission,
    } = req.body;

    if (!itemName || !category || quantity === undefined) {
      return res.status(400).json({
        message: "itemName, category and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid cargo status",
        allowedStatuses: VALID_STATUSES,
      });
    }

    const cargo = new Cargo({
      itemName,
      category,
      quantity,
      currentLocation,
      status: status || "packed",
      assignedMission: assignedMission || null,
    });

    await cargo.save();

    const populatedCargo = await cargo.populate("assignedMission");

    res.status(201).json(populatedCargo);
  } catch {
    res.status(500).json({
      message: "Failed to create cargo",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const allowedFields = [
      "itemName",
      "category",
      "quantity",
      "currentLocation",
      "assignedMission",
    ];

    const updates: any = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.quantity !== undefined &&
      updates.quantity <= 0
    ) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const cargo = await Cargo.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("assignedMission");

    if (!cargo) {
      return res.status(404).json({
        message: "Cargo not found",
      });
    }

    res.json(cargo);
  } catch {
    res.status(400).json({
      message: "Failed to update cargo",
    });
  }
});

router.put("/:id/status", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid cargo status",
        allowedStatuses: VALID_STATUSES,
      });
    }

    const cargo = await Cargo.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).populate("assignedMission");

    if (!cargo) {
      return res.status(404).json({
        message: "Cargo not found",
      });
    }

    res.json(cargo);
  } catch {
    res.status(400).json({
      message: "Failed to update cargo status",
    });
  }
});

router.put("/:id/location", async (req: Request, res: Response) => {
  try {
    const { currentLocation } = req.body;

    if (!currentLocation) {
      return res.status(400).json({
        message: "currentLocation is required",
      });
    }

    const cargo = await Cargo.findByIdAndUpdate(
      req.params.id,
      { currentLocation },
      {
        new: true,
        runValidators: true,
      }
    ).populate("assignedMission");

    if (!cargo) {
      return res.status(404).json({
        message: "Cargo not found",
      });
    }

    res.json(cargo);
  } catch {
    res.status(400).json({
      message: "Failed to update cargo location",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const cargo = await Cargo.findByIdAndDelete(req.params.id);

    if (!cargo) {
      return res.status(404).json({
        message: "Cargo not found",
      });
    }

    res.json({
      message: "Cargo deleted successfully",
      cargo,
    });
  } catch {
    res.status(400).json({
      message: "Failed to delete cargo",
    });
  }
});

export default router;