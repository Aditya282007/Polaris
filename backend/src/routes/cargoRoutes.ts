import express, { Request, Response } from "express";
import Cargo from "../models/Cargo";

const router = express.Router();

// Get all cargo
router.get("/", async (req: Request, res: Response) => {
  const cargo = await Cargo.find().populate("assignedMission");
  res.json(cargo);
});

// Create cargo
router.post("/", async (req: Request, res: Response) => {
  const { itemName, category, quantity, currentLocation, status, assignedMission } = req.body;
  const cargo = new Cargo({
    itemName,
    category,
    quantity,
    currentLocation,
    status: status || "packed",
    assignedMission: assignedMission || null,
  });
  await cargo.save();
  res.status(201).json(cargo);
});

// Update cargo status
router.put("/:id/status", async (req: Request, res: Response) => {
  const { status } = req.body;
  const cargo = await Cargo.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!cargo) return res.status(404).json({ message: "Cargo not found" });
  res.json(cargo);
});

// Get single cargo
router.get("/:id", async (req: Request, res: Response) => {
  const cargo = await Cargo.findById(req.params.id).populate("assignedMission");
  if (!cargo) return res.status(404).json({ message: "Cargo not found" });
  res.json(cargo);
});

export default router;