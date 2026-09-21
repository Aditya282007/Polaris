import express, { Request, Response } from "express";
import Mission from "../models/Mission";
import { logisticsAgent } from "../agents";

const router = express.Router();

const VALID_STATUSES = [
  "planning",
  "active",
  "completed",
  "cancelled",
  "delayed",
];

router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      status,
      search,
      page = "1",
      limit = "20",
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const missions = await Mission.find(filter)
      .populate("team")
      .populate("cargoManifest")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Mission.countDocuments(filter);

    res.json({
      missions,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch {
    res.status(500).json({
      message: "Failed to fetch missions",
    });
  }
});

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await Mission.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result: Record<string, number> = {
      total: 0,
      planning: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
      delayed: 0,
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
      message: "Failed to fetch mission statistics",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate("team")
      .populate("cargoManifest");

    if (!mission) {
      return res.status(404).json({
        message: "Mission not found",
      });
    }

    res.json(mission);
  } catch {
    res.status(400).json({
      message: "Invalid mission ID",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      legs,
      team,
      cargoManifest,
      status,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Mission name is required",
      });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid mission status",
        allowedStatuses: VALID_STATUSES,
      });
    }

    const mission = new Mission({
      name,
      legs: legs || [],
      team: team || [],
      cargoManifest: cargoManifest || [],
      status: status || "planning",
    });

    await mission.save();

    await logisticsAgent.onMissionCreate(mission);

    const populatedMission = await Mission.findById(mission._id)
      .populate("team")
      .populate("cargoManifest");

    res.status(201).json(populatedMission);
  } catch {
    res.status(500).json({
      message: "Failed to create mission",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const allowedFields = [
      "name",
      "legs",
      "team",
      "cargoManifest",
    ];

    const updates: any = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const mission = await Mission.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("team")
      .populate("cargoManifest");

    if (!mission) {
      return res.status(404).json({
        message: "Mission not found",
      });
    }

    await logisticsAgent.onMissionUpdate(
      mission._id.toString(),
      updates
    );

    res.json(mission);
  } catch {
    res.status(400).json({
      message: "Failed to update mission",
    });
  }
});

router.put("/:id/status", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid mission status",
        allowedStatuses: VALID_STATUSES,
      });
    }

    const mission = await Mission.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("team")
      .populate("cargoManifest");

    if (!mission) {
      return res.status(404).json({
        message: "Mission not found",
      });
    }

    await logisticsAgent.onMissionUpdate(
      mission._id.toString(),
      { status }
    );

    res.json(mission);
  } catch {
    res.status(400).json({
      message: "Failed to update mission status",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);

    if (!mission) {
      return res.status(404).json({
        message: "Mission not found",
      });
    }

    res.json({
      message: "Mission deleted successfully",
      mission,
    });
  } catch {
    res.status(400).json({
      message: "Failed to delete mission",
    });
  }
});

export default router;