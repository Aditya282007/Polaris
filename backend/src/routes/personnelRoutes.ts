import express, { Request, Response } from "express";
import Personnel from "../models/Personnel";

const router = express.Router();

const VALID_STATUSES = [
  "checked-in",
  "checked-out",
  "on-leave",
  "unavailable",
];

router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      status,
      role,
      station,
      search,
      page = "1",
      limit = "20",
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const filter: any = {};

    if (status) filter.status = status;
    if (role) filter.role = role;
    if (station) filter.currentStation = station;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { currentStation: { $regex: search, $options: "i" } },
      ];
    }

    const personnel = await Personnel.find(filter)
      .sort({ name: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Personnel.countDocuments(filter);

    res.json({
      personnel,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch {
    res.status(500).json({
      message: "Failed to fetch personnel",
    });
  }
});

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await Personnel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result: Record<string, number> = {
      total: 0,
      "checked-in": 0,
      "checked-out": 0,
      "on-leave": 0,
      unavailable: 0,
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
      message: "Failed to fetch personnel statistics",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const person = await Personnel.findById(req.params.id);

    if (!person) {
      return res.status(404).json({
        message: "Personnel not found",
      });
    }

    res.json(person);
  } catch {
    res.status(400).json({
      message: "Invalid personnel ID",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      role,
      currentStation,
      status,
    } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        message: "name and role are required",
      });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid personnel status",
        allowedStatuses: VALID_STATUSES,
      });
    }

    const person = new Personnel({
      name,
      role,
      currentStation,
      status: status || "checked-out",
    });

    await person.save();

    res.status(201).json(person);
  } catch {
    res.status(500).json({
      message: "Failed to create personnel",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const allowedFields = [
      "name",
      "role",
      "currentStation",
    ];

    const updates: any = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const person = await Personnel.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!person) {
      return res.status(404).json({
        message: "Personnel not found",
      });
    }

    res.json(person);
  } catch {
    res.status(400).json({
      message: "Failed to update personnel",
    });
  }
});

router.put("/:id/checkin", async (req: Request, res: Response) => {
  try {
    const { status, station } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid personnel status",
        allowedStatuses: VALID_STATUSES,
      });
    }

    const person = await Personnel.findById(req.params.id);

    if (!person) {
      return res.status(404).json({
        message: "Personnel not found",
      });
    }

    person.status = status || "checked-in";

    if (station) {
      person.currentStation = station;
    }

    person.lastCheckIn = new Date();

    await person.save();

    res.json(person);
  } catch {
    res.status(400).json({
      message: "Failed to check in personnel",
    });
  }
});

router.put("/:id/checkout", async (req: Request, res: Response) => {
  try {
    const person = await Personnel.findById(req.params.id);

    if (!person) {
      return res.status(404).json({
        message: "Personnel not found",
      });
    }

    person.status = "checked-out";

    await person.save();

    res.json(person);
  } catch {
    res.status(400).json({
      message: "Failed to check out personnel",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const person = await Personnel.findByIdAndDelete(req.params.id);

    if (!person) {
      return res.status(404).json({
        message: "Personnel not found",
      });
    }

    res.json({
      message: "Personnel deleted successfully",
      person,
    });
  } catch {
    res.status(400).json({
      message: "Failed to delete personnel",
    });
  }
});

export default router;