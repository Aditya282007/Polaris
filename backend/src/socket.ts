import { Server, Socket } from "socket.io";
import IncidentModel from "./models/Incident";
import InventoryItemModel from "./models/InventoryItem";
import PersonnelModel from "./models/Personnel";

interface ActionFeedItem {
  id: string;
  type: "inventory" | "logistics" | "safety" | "emergency";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: Date;
  entityId?: string;
  entityType?:
    | "cargo"
    | "inventory"
    | "mission"
    | "personnel"
    | "emergency";
}

// In-memory action feed (in production, use Redis or DB)
let actionFeed: ActionFeedItem[] = [];

export function setupSocket(socket: Socket, io: Server) {
  // Join action feed room
  socket.join("action-feed");

  // Get current action feed
  socket.on("get-action-feed", () => {
    const sorted = [...actionFeed].sort(
      (a, b) => {
        const severityOrder: Record<string, number> = {
          critical: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        if (severityOrder[b.severity] !== severityOrder[a.severity]) {
          return severityOrder[b.severity] - severityOrder[a.severity];
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
    );
    socket.emit("action-feed-updated", sorted);
  });

  // Inventory agent: low stock alert
  socket.on("inventory-low-stock", async (itemId: string) => {
    const item = await InventoryItemModel.findById(itemId);
    if (item && item.lowStockAlert) {
      const severity = item.currentStock < item.reorderThreshold / 2 ? "high" : "medium";
      const alert: ActionFeedItem = {
        id: `inventory-${itemId}`,
        type: "inventory",
        severity,
        message: `Low stock alert: ${item.name} (${item.currentStock}${item.unit}) below threshold (${item.reorderThreshold}${item.unit})`,
        timestamp: new Date(),
        entityId: itemId,
        entityType: "inventory",
      };
      actionFeed.push(alert);
      io.to("action-feed").emit("action-feed-updated", [alert]);
    }
  });

  // Logistics agent: conflict alert
  socket.on("logistics-conflict", async (payload: { message: string; entityId: string; entityType: string }) => {
    const alert: ActionFeedItem = {
      id: `logistics-${Date.now()}`,
      type: "logistics",
      severity: "high",
      message: payload.message,
      timestamp: new Date(),
      entityId: payload.entityId,
      entityType: payload.entityType as
        | "cargo"
        | "inventory"
        | "mission"
        | "personnel"
        | "emergency",
    };
    actionFeed.push(alert);
    io.to("action-feed").emit("action-feed-updated", [alert]);
  });

  // Safety agent: overdue check-in
  socket.on("safety-overdue", async (personnelId: string) => {
    const person = await PersonnelModel.findById(personnelId);
    if (person) {
      const minutesSinceCheckIn = (new Date().getTime() - person.lastCheckIn.getTime()) / (1000 * 60);
      const severity = minutesSinceCheckIn > 12 ? "critical" : "high";
      const alert: ActionFeedItem = {
        id: `safety-${personnelId}`,
        type: "safety",
        severity,
        message: `Overdue check-in: ${person.name} not checked in in ${Math.round(minutesSinceCheckIn)} minutes at ${person.currentStation}`,
        timestamp: new Date(),
        entityId: personnelId,
        entityType: "personnel",
      };
      actionFeed.push(alert);
      io.to("action-feed").emit("action-feed-updated", [alert]);
    }
  });

  // Emergency agent: new incident
  socket.on("emergency-new-incident", async (incidentId: string) => {
    const incident = await IncidentModel.findById(incidentId);
    if (incident) {
      const severityMap: Record<string, "low" | "medium" | "high" | "critical"> = {
        low: "low",
        medium: "medium",
        high: "high",
        critical: "critical",
      };
      const alert: ActionFeedItem = {
        id: `emergency-${incidentId}`,
        type: "emergency",
        severity: severityMap[incident.parsedSeverity] || "low",
        message: `Incident: ${incident.parsedType} - ${incident.parsedSeverity} - ${incident.rawText.substring(0, 80)}...`,
        timestamp: incident.createdAt,
        entityId: incident._id.toString(),
        entityType: "emergency" as const,
      };
      actionFeed.push(alert);
      io.to("action-feed").emit("action-feed-updated", [alert]);
    }
  });

  // Resolve incident
  socket.on("incident-resolve", async (incidentId: string) => {
    const incident = await IncidentModel.findByIdAndUpdate(
      incidentId,
      { status: "resolved" },
      { new: true }
    );
    if (incident) {
      // Remove related action feed item
      actionFeed = actionFeed.filter((item) => item.id !== `emergency-${incidentId}`);
      io.to("action-feed").emit("action-feed-updated", actionFeed);
    }
  });
}