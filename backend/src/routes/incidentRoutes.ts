import express, { Request, Response } from "express";
import Incident from "../models/Incident";

const router = express.Router();

const VALID_STATUSES = ["open", "investigating", "resolved", "closed"];
const VALID_SEVERITIES = ["low", "medium", "high", "critical"];

router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      status,
      severity,
      type,
      search,
      page = "1",
      limit = "20",
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const filter: any = {};

    if (status) filter.status = status;
    if (severity) filter.parsedSeverity = severity;
    if (type) filter.parsedType = type;

    if (search) {
      filter.$or = [
        { rawText: { $regex: search, $options: "i" } },
        { parsedType: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { reportedBy: { $regex: search, $options: "i" } },
      ];
    }

    const incidents = await Incident.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Incident.countDocuments(filter);

    res.json({
      incidents,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch incidents" });
  }
});

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await Incident.aggregate([
      {
        $group: {
          _id: {
            status: "$status",
            severity: "$parsedSeverity",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      open: 0,
      investigating: 0,
      resolved: 0,
      closed: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    stats.forEach((item) => {
      const status = item._id.status;
      const severity = item._id.severity;

      if (status in result) {
        result[status as keyof typeof result] += item.count;
      }

      if (severity in result) {
        result[severity as keyof typeof result] += item.count;
      }

      result.total += item.count;
    });

    res.json(result);
  } catch {
    res.status(500).json({ message: "Failed to fetch incident statistics" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json(incident);
  } catch {
    res.status(400).json({ message: "Invalid incident ID" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { rawText, reportedBy } = req.body;

    if (!rawText || !reportedBy) {
      return res.status(400).json({
        message: "rawText and reportedBy are required",
      });
    }

    const incident = new Incident({
      rawText,
      reportedBy,
      parsedType: "",
      parsedSeverity: "low",
      location: "",
      status: "open",
      relatedEntity: null,
      relatedEntityId: null,
    });

    await incident.save();

    res.status(201).json(incident);
  } catch {
    res.status(500).json({ message: "Failed to create incident" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const allowedFields = [
      "rawText",
      "reportedBy",
      "parsedType",
      "parsedSeverity",
      "location",
      "relatedEntity",
      "relatedEntityId",
    ];

    const updates: any = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.parsedSeverity &&
      !VALID_SEVERITIES.includes(updates.parsedSeverity)
    ) {
      return res.status(400).json({
        message: "Invalid incident severity",
        allowedSeverities: VALID_SEVERITIES,
      });
    }

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json(incident);
  } catch {
    res.status(400).json({ message: "Failed to update incident" });
  }
});

router.put("/:id/status", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid incident status",
        allowedStatuses: VALID_STATUSES,
      });
    }

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json(incident);
  } catch {
    res.status(400).json({ message: "Failed to update incident status" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json({
      message: "Incident deleted successfully",
      incident,
    });
  } catch {
    res.status(400).json({ message: "Failed to delete incident" });
  }
});

export default router;