import PersonnelModel from "../models/Personnel";

interface OverdueCheck {
  personnelId: string;
  name: string;
  currentStation: string;
  minutesOverdue: number;
  severity: "high" | "critical";
}

class SafetyAgent {
  private checkInterval: NodeJS.Timeout | null = null;
  private overdueThresholdMinutes: number = 360; // 6 hours default

  startSchedule(intervalMs: number = 60000, thresholdMinutes: number = 360) {
    this.overdueThresholdMinutes = thresholdMinutes;
    if (this.checkInterval) clearInterval(this.checkInterval);
    this.checkInterval = setInterval(() => this.checkAllPersonnel(), intervalMs);
    // Run once immediately
    this.checkAllPersonnel();
  }

  stopSchedule() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  async checkAllPersonnel() {
    try {
      const personnel = await PersonnelModel.find({ status: "on-field" });
      
      for (const person of personnel) {
        const minutesSinceCheckIn = (new Date().getTime() - person.lastCheckIn.getTime()) / (1000 * 60);
        
        if (minutesSinceCheckIn > this.overdueThresholdMinutes) {
          const severity = minutesSinceCheckIn > 720 ? "critical" : "high"; // 12 hours = critical
          
          const io = (global as any).io;
          if (io) {
            io.to("action-feed").emit("safety-overdue", person._id.toString());
          }
        }
      }
    } catch (error) {
      console.error("SafetyAgent error:", error);
    }
  }
}

export const safetyAgent = new SafetyAgent();