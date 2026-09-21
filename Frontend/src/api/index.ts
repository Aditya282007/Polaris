import { 
  CargoItem, InventoryItem, Mission, Personnel, Incident, ActionFeedItem, MapMarker, DashboardData,
  CargoStatus, PersonnelStatus, MissionStatus, IncidentSeverity, IncidentType 
} from '../types';
import {
  MOCK_CARGO,
  MOCK_INVENTORY,
  MOCK_PERSONNEL,
  MOCK_MISSIONS,
  MOCK_INCIDENTS,
  MOCK_ACTION_FEED,
  MOCK_MAP_MARKERS,
  getDashboardData,
  CARGO_STATUS_HISTORY,
  CARGO_STATUSES,
  PERSONNEL_STATUSES,
  MISSION_STATUSES,
  INCIDENT_SEVERITIES,
  INCIDENT_TYPES,
} from '../mock/data';

const USE_MOCK = true;
const MOCK_DELAY = 300;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mockResponse<T>(data: T): Promise<T> {
  return delay(MOCK_DELAY).then(() => data);
}

export const api = {
  auth: {
    login: async (username: string): Promise<{ token: string; user: string }> => {
      return mockResponse({ token: 'demo-token-' + Date.now(), user: username });
    },
    logout: async (): Promise<void> => {
      return mockResponse(undefined);
    },
  },

  dashboard: {
    getData: async (): Promise<DashboardData> => {
      return mockResponse(getDashboardData());
    },
  },

  cargo: {
    getAll: async (): Promise<CargoItem[]> => {
      return mockResponse([...MOCK_CARGO]);
    },
    getById: async (id: string): Promise<CargoItem | undefined> => {
      return mockResponse(MOCK_CARGO.find(c => c.id === id));
    },
    getStatusHistory: async (id: string): Promise<Array<{ status: CargoStatus; timestamp: string; location: string; note?: string }>> => {
      return mockResponse(CARGO_STATUS_HISTORY[id] || []);
    },
    updateStatus: async (id: string, status: CargoStatus): Promise<CargoItem | undefined> => {
      const cargo = MOCK_CARGO.find(c => c.id === id);
      if (cargo) {
        cargo.status = status;
        cargo.lastUpdated = new Date().toISOString();
      }
      return mockResponse(cargo);
    },
    getStatuses: async (): Promise<CargoStatus[]> => {
      return mockResponse(CARGO_STATUSES);
    },
  },

  inventory: {
    getAll: async (): Promise<InventoryItem[]> => {
      return mockResponse([...MOCK_INVENTORY]);
    },
    getById: async (id: string): Promise<InventoryItem | undefined> => {
      return mockResponse(MOCK_INVENTORY.find(i => i.id === id));
    },
    logConsumption: async (id: string, quantity: number): Promise<InventoryItem | undefined> => {
      const item = MOCK_INVENTORY.find(i => i.id === id);
      if (item) {
        item.currentStock = Math.max(0, item.currentStock - quantity);
        item.lastConsumptionDate = new Date().toISOString().split('T')[0];
        item.consumptionHistory.push({ date: item.lastConsumptionDate, quantity });
        item.daysUntilDepletion = item.consumptionRate > 0 ? Math.floor(item.currentStock / item.consumptionRate) : 999;
      }
      return mockResponse(item);
    },
  },

  personnel: {
    getAll: async (): Promise<Personnel[]> => {
      return mockResponse([...MOCK_PERSONNEL]);
    },
    getById: async (id: string): Promise<Personnel | undefined> => {
      return mockResponse(MOCK_PERSONNEL.find(p => p.id === id));
    },
    checkIn: async (id: string, station: string): Promise<Personnel | undefined> => {
      const person = MOCK_PERSONNEL.find(p => p.id === id);
      if (person) {
        person.status = 'CHECKED_IN';
        person.lastCheckIn = new Date().toISOString();
        person.overdueMinutes = 0;
        if (person.nextScheduledCheckIn) {
          const next = new Date(person.nextScheduledCheckIn);
          next.setHours(next.getHours() + 12);
          person.nextScheduledCheckIn = next.toISOString();
        }
      }
      return mockResponse(person);
    },
    checkOut: async (id: string): Promise<Personnel | undefined> => {
      const person = MOCK_PERSONNEL.find(p => p.id === id);
      if (person) {
        person.status = 'CHECKED_OUT';
        person.lastCheckIn = new Date().toISOString();
      }
      return mockResponse(person);
    },
    getStatuses: async (): Promise<PersonnelStatus[]> => {
      return mockResponse(PERSONNEL_STATUSES);
    },
  },

  missions: {
    getAll: async (): Promise<Mission[]> => {
      return mockResponse([...MOCK_MISSIONS]);
    },
    getById: async (id: string): Promise<Mission | undefined> => {
      return mockResponse(MOCK_MISSIONS.find(m => m.id === id));
    },
    create: async (mission: Omit<Mission, 'id'>): Promise<Mission> => {
      const newMission: Mission = {
        ...mission,
        id: 'MSN-' + Date.now(),
      };
      MOCK_MISSIONS.push(newMission);
      return mockResponse(newMission);
    },
    getStatuses: async (): Promise<MissionStatus[]> => {
      return mockResponse(MISSION_STATUSES);
    },
  },

  incidents: {
    getAll: async (): Promise<Incident[]> => {
      return mockResponse([...MOCK_INCIDENTS]);
    },
    create: async (incident: Omit<Incident, 'id' | 'reportedAt' | 'status'>): Promise<Incident> => {
      const newIncident: Incident = {
        ...incident,
        id: 'INC-' + Date.now(),
        reportedAt: new Date().toISOString(),
        status: 'OPEN',
      };
      MOCK_INCIDENTS.unshift(newIncident);
      return mockResponse(newIncident);
    },
    classify: async (text: string): Promise<{ type: IncidentType; severity: IncidentSeverity; summary: string }> => {
      return mockResponse(classifyIncident(text));
    },
    resolve: async (id: string): Promise<Incident | undefined> => {
      const incident = MOCK_INCIDENTS.find(i => i.id === id);
      if (incident) {
        incident.status = 'RESOLVED';
        incident.resolvedAt = new Date().toISOString();
      }
      return mockResponse(incident);
    },
    getSeverities: async (): Promise<IncidentSeverity[]> => {
      return mockResponse(INCIDENT_SEVERITIES);
    },
    getTypes: async (): Promise<IncidentType[]> => {
      return mockResponse(INCIDENT_TYPES);
    },
  },

  actionFeed: {
    getAll: async (): Promise<ActionFeedItem[]> => {
      return mockResponse([...MOCK_ACTION_FEED]);
    },
    acknowledge: async (id: string): Promise<ActionFeedItem | undefined> => {
      const item = MOCK_ACTION_FEED.find(a => a.id === id);
      if (item) {
        item.acknowledged = true;
        item.acknowledgedBy = 'CURRENT_USER';
        item.acknowledgedAt = new Date().toISOString();
      }
      return mockResponse(item);
    },
  },

  map: {
    getMarkers: async (): Promise<MapMarker[]> => {
      return mockResponse([...MOCK_MAP_MARKERS]);
    },
  },
};

function classifyIncident(text: string): { type: IncidentType; severity: IncidentSeverity; summary: string } {
  const lower = text.toLowerCase();
  
  let type: IncidentType = 'EQUIPMENT';
  let severity: IncidentSeverity = 'WARNING';
  
  if (lower.includes('fuel') || lower.includes('cargo') || lower.includes('shipment') || lower.includes('delivery') || lower.includes('supply')) {
    type = 'CARGO';
  } else if (lower.includes('personnel') || lower.includes('crew') || lower.includes('staff') || lower.includes('check-in') || lower.includes('check in') || lower.includes('overdue') || lower.includes('missing') || lower.includes('injury') || lower.includes('medical') || lower.includes('health')) {
    type = 'PERSONNEL';
  } else if (lower.includes('weather') || lower.includes('storm') || lower.includes('wind') || lower.includes('blizzard') || lower.includes('temperature') || lower.includes('catabatic')) {
    type = 'WEATHER';
  } else if (lower.includes('comm') || lower.includes('radio') || lower.includes('satellite') || lower.includes('signal') || lower.includes('link') || lower.includes('communication')) {
    type = 'COMMUNICATION';
  } else if (lower.includes('equipment') || lower.includes('engine') || lower.includes('generator') || lower.includes('drill') || lower.includes('machinery') || lower.includes('system') || lower.includes('failure') || lower.includes('broken') || lower.includes('malfunction')) {
    type = 'EQUIPMENT';
  } else if (lower.includes('medical') || lower.includes('oxygen') || lower.includes('health') || lower.includes('illness') || lower.includes('injury')) {
    type = 'MEDICAL';
  }

  if (lower.includes('critical') || lower.includes('emergency') || lower.includes('urgent') || lower.includes('immediate') || lower.includes('life') || lower.includes('death') || lower.includes('crash') || lower.includes('collision') || lower.includes('fire') || lower.includes('explosion')) {
    severity = 'CRITICAL';
  } else if (lower.includes('warning') || lower.includes('alert') || lower.includes('delayed') || lower.includes('overdue') || lower.includes('low') || lower.includes('degraded') || lower.includes('issue') || lower.includes('problem') || lower.includes('concern')) {
    severity = 'WARNING';
  } else {
    severity = 'NOMINAL';
  }

  const summary = text.length > 120 ? text.substring(0, 117) + '...' : text;

  return { type, severity, summary };
}