export interface OllamaResponse {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  summary: string;
  suggestedAction: string;
}

export class OllamaClient {
  private baseUrl: string;

  constructor(baseUrl = "http://localhost:11434") {
    this.baseUrl = baseUrl;
  }

  async parseIncident(text: string): Promise<OllamaResponse> {
    const prompt = "You are a polar expedition emergency response assistant. Analyze the following incident report and extract structured JSON.\n\n" +
      "Return ONLY a valid JSON object with these exact fields:\n" +
      '{ "type": "<incident type>", "severity": "<low|medium|high|critical>", "summary": "<2-sentence summary>", "suggestedAction": "<immediate action>" }' +
      "\n\nIncident report: " + text;

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3:8b-instruct",
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await response.json() as { response: string };
    const content = data.response || "";

    // Try to extract JSON from the response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Fallback if JSON parsing fails
    }

    // Default fallback
    return {
      type: "general-incident",
      severity: "medium",
      summary: text.substring(0, 100),
      suggestedAction: "Monitor the situation and assess further",
    };
  }

  async draftResupplyRequest(itemData: {
    name: string;
    category: string;
    currentStock: number;
    reorderThreshold: number;
    unit: string;
    consumptionHistory: Array<{ date: Date; quantityUsed: number }>;
  }): Promise<{ items: Array<{ name: string; quantity: number }>; rationale: string }> {
    const avgDailyConsumption = itemData.consumptionHistory.reduce(
      (sum: number, c: { quantityUsed: number }) => sum + c.quantityUsed,
      0
    ) / Math.max(itemData.consumptionHistory.length, 1);

    const daysRemaining = itemData.currentStock / Math.max(avgDailyConsumption, 0.01);
    const daysUntilDepletion = Math.max(0, Math.round(daysRemaining));

    const suggestedQuantity = Math.max(
      itemData.reorderThreshold - itemData.currentStock,
      Math.ceil(avgDailyConsumption * 7)
    );

    const prompt = "Based on the following inventory consumption data, draft a resupply request.\n\n" +
      "Item: " + itemData.name +
      "\nCategory: " + itemData.category +
      "\nCurrent Stock: " + itemData.currentStock + " " + itemData.unit +
      "\nReorder Threshold: " + itemData.reorderThreshold + " " + itemData.unit +
      "\nAverage Daily Consumption: " + avgDailyConsumption.toFixed(2) + " " + itemData.unit + "/day" +
      "\nDays Until Depletion: " + daysUntilDepletion + " days" +
      "\n\nGenerate a JSON response with: { \"items\": [{\"name\": \"<item name>\", \"quantity\": <number>}], \"rationale\": \"<brief rationale>\" }";

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3:8b-instruct",
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await response.json() as { response: string };
    const content = data.response || "";

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Fallback
    }

    return {
      items: [{ name: itemData.name, quantity: suggestedQuantity }],
      rationale: "Resupply requested: " + suggestedQuantity + " units needed. " + daysUntilDepletion + " days remaining at current consumption rate.",
    };
  }
}

export { OllamaClient as default };