import InventoryItemModel from "../models/InventoryItem";
import OllamaClient from "../utils/ollamaClient";

export interface ResupplyRequest {
  items: Array<{ name: string; quantity: number }>;
  rationale: string;
}

export interface ConsumptionAnalysis {
  itemId: string;
  itemName: string;
  currentStock: number;
  reorderThreshold: number;
  daysUntilDepletion: number;
  needsResupply: boolean;
  suggestedResupply?: ResupplyRequest;
}

class InventoryAgent {
  private ollama: OllamaClient;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.ollama = new OllamaClient("http://localhost:11434");
  }

  startSchedule(checkIntervalMs: number = 300000) {
    if (this.checkInterval) clearInterval(this.checkInterval);
    this.checkInterval = setInterval(() => this.checkAllItems(), checkIntervalMs);
    // Also run once immediately
    this.checkAllItems();
  }

  stopSchedule() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  async checkAllItems() {
    try {
      const items = await InventoryItemModel.find().lean();
      
      for (const item of items) {
        // Cast to access all properties including 'unit'
        const inventoryItem: any = item;
        
        const consumptionHistory = inventoryItem.consumptionLog.map(
          (log: any) => ({
            date: log.date,
            quantityUsed: log.quantityUsed,
          })
        );

        const analysis: ConsumptionAnalysis = {
          itemId: inventoryItem._id.toString(),
          itemName: inventoryItem.name,
          currentStock: inventoryItem.currentStock,
          reorderThreshold: inventoryItem.reorderThreshold,
          daysUntilDepletion: 0,
          needsResupply: false,
        };

        // Calculate days until depletion
        if (inventoryItem.consumptionLog.length > 0 && inventoryItem.currentStock > 0) {
          const totalConsumed = inventoryItem.consumptionLog.reduce(
            (sum: number, log: any) => sum + log.quantityUsed,
            0
          );
          const daysPassed = (new Date().getTime() - new Date(inventoryItem.consumptionLog[0].date).getTime()) / (1000 * 60 * 60 * 24);
          if (daysPassed > 0) {
            const avgDailyConsumption = totalConsumed / daysPassed;
            analysis.daysUntilDepletion = Math.max(0, Math.round(inventoryItem.currentStock / avgDailyConsumption));
          }
        }

        // Check if below threshold
        if (inventoryItem.currentStock <= inventoryItem.reorderThreshold) {
          analysis.needsResupply = true;
          analysis.daysUntilDepletion = 0;

          // Draft resupply request using Ollama
          const resupply = await this.ollama.draftResupplyRequest({
            name: inventoryItem.name,
            category: inventoryItem.category,
            currentStock: inventoryItem.currentStock,
            reorderThreshold: inventoryItem.reorderThreshold,
            unit: inventoryItem.unit || "units",
            consumptionHistory: consumptionHistory,
          });

          analysis.suggestedResupply = resupply;
        }

        // Emit to frontend via Socket.IO
        const io = (global as any).io;
        if (io && analysis.needsResupply) {
          io.to("action-feed").emit("inventory-low-stock", analysis.itemId);
        }
      }
    } catch (error) {
      console.error("InventoryAgent error:", error);
    }
  }
}

export const inventoryAgent = new InventoryAgent();