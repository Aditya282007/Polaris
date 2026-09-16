import "dotenv/config";
import mongoose from "mongoose";
import Mission from "./models/Mission";
import Cargo from "./models/Cargo";
import InventoryItem from "./models/InventoryItem";
import Personnel from "./models/Personnel";
import Incident from "./models/Incident";

const seedDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);

  // Clear existing data
  await Mission.deleteMany({});
  await Cargo.deleteMany({});
  await InventoryItem.deleteMany({});
  await Personnel.deleteMany({});
  await Incident.deleteMany({});

  // Sample Missions
  const mission1 = new Mission({
    name: "Antarctic Resupply 2026",
    legs: [
      { from: "Maitri", to: "Bharati", startDate: new Date("2026-01-15"), endDate: new Date("2026-01-30") },
      { from: "Bharati", to: "Maitri", startDate: new Date("2026-02-10"), endDate: new Date("2026-02-25") },
    ],
    team: [],
    cargoManifest: [],
    status: "active",
  });

  const mission2 = new Mission({
    name: "Arctic Research Initiative",
    legs: [
      { from: "Himadri", to: "Maitri", startDate: new Date("2026-03-01"), endDate: new Date("2026-03-15") },
    ],
    team: [],
    cargoManifest: [],
    status: "planning",
  });

  const mission3 = new Mission({
    name: "Winter Over Rotation",
    legs: [
      { from: "Maitri", to: "Himadri", startDate: new Date("2026-05-01"), endDate: new Date("2026-05-15") },
    ],
    team: [],
    cargoManifest: [],
    status: "planning",
  });

  await mission1.save();
  await mission2.save();
  await mission3.save();

  // Sample Cargo Items (~20)
  const cargoCategories = [
    "Food", "Fuel", "Scientific Equipment", "Medical Supplies", "Construction Materials",
    "Clothing", "Tools", "Books", "Computers", "Consumables"
  ];

  const cargoItems = [];
  for (let i = 0; i < 20; i++) {
    const category = cargoCategories[i % cargoCategories.length];
    const statuses = ["packed", "in-transit", "arrived"];
    const status = statuses[i % statuses.length];
    const assignedMission = i % 3 === 0 ? mission1._id : (i % 5 === 0 ? mission2._id : mission3._id);

    const cargo = new Cargo({
      itemName: `Item ${i + 1}`,
      category,
      quantity: Math.floor(Math.random() * 500) + 10,
      currentLocation: status === "arrived" ? "Maitri Station" : status === "in-transit" ? "En Route" : "Warehouse",
      status,
      assignedMission,
    });
    cargoItems.push(cargo.save());
  }
  await Promise.all(cargoItems);

  // Sample Inventory Items (~10)
  const inventoryItems = await InventoryItem.insertMany([
    {
      name: "Diesel Fuel",
      category: "Fuel",
      currentStock: 120,
      unit: "liters",
      reorderThreshold: 50,
    },
    {
      name: "Freeze-Dried Meals",
      category: "Food",
      currentStock: 15,
      unit: "meals",
      reorderThreshold: 30,
    },
    {
      name: "Medical Kits",
      category: "Medical Supplies",
      currentStock: 3,
      unit: "kits",
      reorderThreshold: 5,
    },
    {
      name: "Scientific Sample Containers",
      category: "Scientific Equipment",
      currentStock: 45,
      unit: "units",
      reorderThreshold: 20,
    },
    {
      name: "Winter Clothing Packs",
      category: "Clothing",
      currentStock: 8,
      unit: "packs",
      reorderThreshold: 15,
    },
    {
      name: "Solar Panels",
      category: "Scientific Equipment",
      currentStock: 12,
      unit: "units",
      reorderThreshold: 8,
    },
    {
      name: "Repair Tools Set",
      category: "Tools",
      currentStock: 3,
      unit: "sets",
      reorderThreshold: 5,
    },
    {
      name: "Communication Equipment",
      category: "Scientific Equipment",
      currentStock: 2,
      unit: "units",
      reorderThreshold: 3,
    },
    {
      name: "Food Consumables",
      category: "Food",
      currentStock: 200,
      unit: "units",
      reorderThreshold: 100,
    },
    {
      name: "Navigation Supplies",
      category: "Tools",
      currentStock: 6,
      unit: "sets",
      reorderThreshold: 10,
    },
  ]);

  // Sample Personnel (~8)
  const personnelItems = await Personnel.insertMany([
    { name: "Dr. Arjun Sharma", role: "Expedition Commander", currentStation: "Maitri", status: "checked-in", lastCheckIn: new Date() },
    { name: "Priya Patel", role: "Scientist", currentStation: "Bharati", status: "on-field", lastCheckIn: new Date(Date.now() - 3 * 60 * 1000) },
    { name: "Rajesh Kumar", role: "Medical Officer", currentStation: "Maitri", status: "checked-in", lastCheckIn: new Date() },
    { name: "Aisha Khan", role: "Engineer", currentStation: "Himadri", status: "checked-out", lastCheckIn: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { name: "Vikram Singh", role: "Operator", currentStation: "Maitri", status: "checked-in", lastCheckIn: new Date() },
    { name: "Lisa Wang", role: "Scientist", currentStation: "Arctic", status: "on-field", lastCheckIn: new Date(Date.now() - 7 * 60 * 1000) },
    { name: "Miguel Gonzalez", role: "Medical Officer", currentStation: "Bharati", status: "checked-out", lastCheckIn: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { name: "Chen Wei", role: "Logistics Coordinator", currentStation: "Maitri", status: "checked-in", lastCheckIn: new Date() },
  ]);

  // Sample Incidents (~5)
  const incidentItems = await Incident.insertMany([
    {
      rawText: "Temperature sensors malfunctioning at Maitri station. Readings fluctuating between -40°C to -2°C. Critical for ongoing experiments.",
      reportedBy: personnelItems[0]._id,
      parsedType: "equipment-failure",
      parsedSeverity: "high",
      location: "Maitri Station",
      status: "open",
      relatedEntity: "inventory",
      relatedEntityId: inventoryItems[0]._id,
    },
    {
      rawText: "Medical emergency: Dr. Sharma reported severe frostbite on left hand. Requires immediate medical attention.",
      reportedBy: personnelItems[1]._id,
      parsedType: "medical-emergency",
      parsedSeverity: "critical",
      location: "Himadri Station",
      status: "in-progress",
      relatedEntity: "personnel",
      relatedEntityId: personnelItems[1]._id,
    },
    {
      rawText: "Fuel reserve below 30% threshold. Critical for return journey planning.",
      reportedBy: personnelItems[3]._id,
      parsedType: "resource-warning",
      parsedSeverity: "high",
      location: "Bharati Station",
      status: "open",
      relatedEntity: "cargo",
      relatedEntityId: (await cargoItems[0])._id,
    },
    {
      rawText: "Personnel communication blackout lasting 45 minutes. Satellite link restored.",
      reportedBy: personnelItems[4]._id,
      parsedType: "communication-failure",
      parsedSeverity: "medium",
      location: "Maitri Station",
      status: "resolved",
      relatedEntity: null,
      relatedEntityId: null,
    },
    {
      rawText: "Structural crack detected in Module A at Bharati. Evacuation procedures activated.",
      reportedBy: personnelItems[5]._id,
      parsedType: "structural-damage",
      parsedSeverity: "critical",
      location: "Bharati Station",
      status: "open",
      relatedEntity: "personnel",
      relatedEntityId: personnelItems[7]._id,
    },
  ]);

  console.log("Database seeded successfully!");
  mongoose.connection.close();
};

seedDB().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});