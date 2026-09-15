import express, { Request, Response } from "express";
import Personnel from "../models/Personnel";

const router = express.Router();

// Get all personnel
router.get("/", async (req: Request, res: Response) => {
  const personnel = await Personnel.find();
  res.json(personnel);
});

// Create personnel
router.post("/", async (req: Request, res: Response) => {
  const { name, role, currentStation, status } = req.body;
  const person = new Personnel({
    name,
    role,
    currentStation,
    status: status || "checked-out",
  });
  await person.save();
  res.status(201).json(person);
});

// Check in/out
router.put("/:id/checkin", async (req: Request, res: Response) => {
  const { status, station } = req.body;
  const person = await Personnel.findById(req.params.id);
  if (!person) return res.status(404).json({ message: "Personnel not found" });

  person.status = status || "checked-in";
  if (station) person.currentStation = station;
  person.lastCheckIn = new Date();
  await person.save();
  res.json(person);
});

// Check out
router.put("/:id/checkout", async (req: Request, res: Response) => {
  const person = await Personnel.findById(req.params.id);
  if (!person) return res.status(404).json({ message: "Personnel not found" });

  person.status = "checked-out";
  await person.save();
  res.json(person);
});

export default router;