import express, { Request, Response } from "express";
import Mission from "../models/Mission";
import Cargo from "../models/Cargo";
import Personnel from "../models/Personnel";
import { logisticsAgent } from "../agents";

const router = express.Router();

// Get all missions
router.get("/", async (req: Request, res: Response) => {
  const missions = await Mission.find().populate("team").populate("cargoManifest");
  res.json(missions);
});

// Create mission
router.post("/", async (req: Request, res: Response) => {
  const { name, legs, team, cargoManifest, status } = req.body;
  const mission = new Mission({
    name,
    legs,
    team: team || [],
    cargoManifest: cargoManifest || [],
    status: status || "planning",
  });
  await mission.save();
  
  // Trigger logistics agent to check for conflicts
  logisticsAgent.onMissionCreate(mission);
  
  res.status(201).json(mission);
});

// Get single mission
router.get("/:id", async (req: Request, res: Response) => {
  const mission = await Mission.findById(req.params.id)
    .populate("team")
    .populate("cargoManifest");
  if (!mission) return res.status(404).json({ message: "Mission not found" });
  res.json(mission);
});

// Update mission
router.put("/:id", async (req: Request, res: Response) => {
  const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!mission) return res.status(404).json({ message: "Mission not found" });
  
  // Trigger logistics agent to check for conflicts on update
  logisticsAgent.onMissionUpdate(mission._id.toString(), req.body);
  
  res.json(mission);
});

// Delete mission
router.delete("/:id", async (req: Request, res: Response) => {
  const mission = await Mission.findByIdAndDelete(req.params.id);
  if (!mission) return res.status(404).json({ message: "Mission not found" });
  res.json({ message: "Mission deleted" });
});

export default router;