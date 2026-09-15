import express, { Request, Response } from "express";
import Incident from "../models/Incident";

const router = express.Router();

// Get all incidents
router.get("/", async (req: Request, res: Response) => {
  const incidents = await Incident.find().sort({ createdAt: -1 });
  res.json(incidents);
});

// Create incident (with Ollama parsing)
router.post("/", async (req: Request, res: Response) => {
  const { rawText, reportedBy } = req.body;
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
});

// Update incident status
router.put("/:id", async (req: Request, res: Response) => {
  const { status } = req.body;
  const incident = await Incident.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!incident) return res.status(404).json({ message: "Incident not found" });
  res.json(incident);
});

export default router;