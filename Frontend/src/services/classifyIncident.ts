import { IncidentType, IncidentSeverity } from '../types';

export interface ClassificationResult {
  type: IncidentType;
  severity: IncidentSeverity;
  summary: string;
  suggestedAction: string;
}

const TYPE_KEYWORDS: Record<IncidentType, string[]> = {
  EQUIPMENT: ['equipment', 'engine', 'generator', 'drill', 'machinery', 'system', 'failure', 'broken', 'malfunction', 'snowmobile', 'vehicle', 'heater', 'power', 'electrical', 'hydraulic', 'pump', 'compressor'],
  PERSONNEL: ['personnel', 'crew', 'staff', 'check-in', 'check in', 'overdue', 'missing', 'injury', 'medical', 'health', 'evacuation', 'sar', 'search', 'rescue', 'frostbite', 'hypothermia'],
  WEATHER: ['weather', 'storm', 'wind', 'blizzard', 'whiteout', 'temperature', 'catabatic', 'visibility', 'snow', 'ice', 'gust', 'squall'],
  COMMUNICATION: ['comm', 'radio', 'satellite', 'signal', 'link', 'communication', 'hf', 'vhf', 'iridium', 'packet loss', 'degraded', 'outage', 'antenna'],
  MEDICAL: ['medical', 'oxygen', 'o2', 'health', 'illness', 'injury', 'trauma', 'burn', 'wound', 'infection', 'virus', 'outbreak', 'casualty'],
  CARGO: ['cargo', 'fuel', 'shipment', 'delivery', 'supply', 'container', 'crate', 'manifest', 'logistics', 'resupply', 'delayed', 'lost'],
};

const SEVERITY_KEYWORDS: Record<IncidentSeverity, string[]> = {
  CRITICAL: ['critical', 'emergency', 'urgent', 'immediate', 'life', 'death', 'crash', 'collision', 'fire', 'explosion', 'mayday', 'sinking', 'trapped', 'unconscious', 'severe'],
  WARNING: ['warning', 'alert', 'delayed', 'overdue', 'low', 'degraded', 'issue', 'problem', 'concern', 'malfunction', 'failure', 'unstable', 'deteriorating', 'abnormal'],
  NOMINAL: ['nominal', 'routine', 'normal', 'standard', 'scheduled', 'planned', 'minor', 'cosmetic', 'advisory', 'info', 'informational'],
};

const SUGGESTED_ACTIONS: Record<IncidentType, Record<IncidentSeverity, string>> = {
  EQUIPMENT: {
    CRITICAL: 'IMMEDIATE: Shut down affected system. Deploy backup/redundant unit. Dispatch maintenance team with spare parts. Establish safety perimeter.',
    WARNING: 'Schedule maintenance within 24 hours. Monitor system parameters closely. Prepare spare parts for replacement. Log degradation trend.',
    NOMINAL: 'Log in maintenance tracker. Schedule at next routine service window. No immediate action required.',
  },
  PERSONNEL: {
    CRITICAL: 'IMMEDIATE: Activate SAR protocol. Deploy medical team. Establish comms with field party. Notify station leader and medical officer.',
    WARNING: 'Attempt comms re-establishment. Verify last known position. Prep SAR team on standby. Check environmental conditions.',
    NOMINAL: 'Log check-in. Update personnel tracking board. Continue routine monitoring.',
  },
  WEATHER: {
    CRITICAL: 'IMMEDIATE: Suspend all outdoor ops. Secure all external equipment. Activate shelter-in-place. Verify life support systems.',
    WARNING: 'Monitor forecast closely. Prep for op suspension. Secure loose cargo. Brief all personnel on contingency plans.',
    NOMINAL: 'Log weather observation. Continue routine monitoring. Update forecast board.',
  },
  COMMUNICATION: {
    CRITICAL: 'IMMEDIATE: Switch to backup comms (Iridium/SATCOM). Dispatch comms tech to diagnose. Establish relay via adjacent station.',
    WARNING: 'Attempt frequency change. Check antenna alignment. Monitor signal quality. Prep backup comms deployment.',
    NOMINAL: 'Log comms status. Continue routine monitoring. Schedule antenna inspection.',
  },
  MEDICAL: {
    CRITICAL: 'IMMEDIATE: Activate medical emergency protocol. Deploy medical officer. Prep medevac if required. Notify all stations.',
    WARNING: 'Assess patient. Administer first aid. Monitor vitals. Consult remote medical support if needed.',
    NOMINAL: 'Log in medical tracker. Schedule follow-up. Continue routine monitoring.',
  },
  CARGO: {
    CRITICAL: 'IMMEDIATE: Activate contingency resupply. Divert from alternate source. Assess impact on dependent missions. Notify logistics command.',
    WARNING: 'Track shipment ETA. Identify alternate routing. Prep receiving team. Update cargo manifest.',
    NOMINAL: 'Log shipment status. Update tracking. Continue routine monitoring.',
  },
};

function classifyType(text: string): IncidentType {
  const lower = text.toLowerCase();
  let bestMatch: IncidentType = 'EQUIPMENT';
  let maxMatches = 0;

  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
    const matches = keywords.filter(k => lower.includes(k)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = type as IncidentType;
    }
  }
  return bestMatch;
}

function classifySeverity(text: string): IncidentSeverity {
  const lower = text.toLowerCase();
  
  for (const [severity, keywords] of Object.entries(SEVERITY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) {
      return severity as IncidentSeverity;
    }
  }
  return 'NOMINAL';
}

function generateSummary(type: IncidentType, severity: IncidentSeverity, text: string): string {
  const prefix = severity === 'CRITICAL' ? 'CRITICAL' : severity === 'WARNING' ? 'WARNING' : 'INFO';
  const firstSentence = text.split('.')[0];
  return `${prefix} ${type}: ${firstSentence.length > 100 ? firstSentence.substring(0, 97) + '...' : firstSentence}`;
}

export async function classifyIncident(text: string): Promise<ClassificationResult> {
  // Artificial delay to simulate LLM processing
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const type = classifyType(text);
  const severity = classifySeverity(text);
  const summary = generateSummary(type, severity, text);
  const suggestedAction = SUGGESTED_ACTIONS[type]?.[severity] || 'Assess situation and take appropriate action.';
  
  return { type, severity, summary, suggestedAction };
}