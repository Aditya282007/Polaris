import IncidentModel from "../models/Incident";
import OllamaClient from "../utils/ollamaClient";

class EmergencyAgent {
  private ollama: OllamaClient;

  constructor() {
    this.ollama = new OllamaClient("http://localhost:11434");
  }

  async parseAndRouteIncident(rawText: string, reportedBy: string) {
    const response = await this.ollama.parseIncident(rawText);

    const incident = new IncidentModel({
      rawText,
      reportedBy,
      parsedType: response.type,
      parsedSeverity: response.severity,
      summary: response.summary,
      suggestedAction: response.suggestedAction,
      location: this.extractLocation(rawText),
      status: "open",
    });

    await incident.save();

    // Emit to incident queue and action feed
    const io = (global as any).io;
    if (io) {
      io.to("action-feed").emit("emergency-new-incident", incident._id.toString());
      io.to("incident-queue").emit("incidents-updated", [incident]);
    }

    return incident;
  }

  private extractLocation(text: string): string {
    // Simple location extraction - look for station names or geographic mentions
    const stationPatterns = /(Maitri|Bharati|Himadri|Antarctic|Arctic|Station\s+\w+)/i;
    const match = text.match(stationPatterns);
    return match ? match[0] : "Unknown";
  }
}

export const emergencyAgent = new EmergencyAgent();