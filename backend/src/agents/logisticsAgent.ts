import MissionModel from "../models/Mission";
import { ICargo } from "../models/Cargo";
import PersonnelModel from "../models/Personnel";
import mongoose from "mongoose";

class LogisticsAgent {
  checkForConflicts = async (missionId: string, missionData: any) => {
    try {
      const mission = await MissionModel.findById(missionId);
      if (!mission) return;

      // Check for personnel double-assignment across legs
      const allPersonnel: string[] = [];
      mission.legs.forEach((leg: any) => {
        // This is a simplified check - in reality we'd check leg-specific assignments
        if (leg.personnel) {
          leg.personnel.forEach((pId: string) => {
            if (allPersonnel.includes(pId)) {
              // Double-assigned
              const io = (global as any).io;
              if (io) {
                io.to("action-feed").emit("logistics-conflict", {
                  message: `Personnel ${pId} assigned to multiple legs in mission "${mission.name}"`,
                  entityId: pId,
                  entityType: "personnel",
                });
              }
            }
            allPersonnel.push(pId);
          });
        }
      });

      // Check for cargo double-assignment
      const allCargo: string[] = [];
      mission.cargoManifest.forEach((cId: any) => {
        if (allCargo.includes(cId.toString())) {
          const io = (global as any).io;
          if (io) {
            io.to("action-feed").emit("logistics-conflict", {
              message: `Cargo item ${cId} assigned to multiple missions`,
              entityId: cId,
              entityType: "cargo",
            });
          }
        }
        allCargo.push(cId);
      });
    } catch (error) {
      console.error("LogisticsAgent error:", error);
    }
  };

  onMissionCreate = async (missionData: any) => {
    const mission = new MissionModel(missionData);
    await mission.save();
    this.checkForConflicts(mission._id.toString(), missionData);
  };

  onMissionUpdate = async (missionId: string, updatedData: any) => {
    const mission = await MissionModel.findByIdAndUpdate(missionId, updatedData, { new: true });
    if (mission) {
      this.checkForConflicts(mission._id.toString(), updatedData);
    }
  };
}

export const logisticsAgent = new LogisticsAgent();