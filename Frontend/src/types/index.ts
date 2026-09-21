/** Core domain types for Polaris — Polar Expedition Logistics */

export type Station = 'MAITRI' | 'BHARATI' | 'HIMADRI';
export type CargoStatus = 'PACKED' | 'IN_TRANSIT' | 'ARRIVED';
export type PersonnelStatus = 'CHECKED_IN' | 'CHECKED_OUT' | 'ON_FIELD' | 'OVERDUE';
export type MissionStatus = 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type IncidentSeverity = 'NOMINAL' | 'WARNING' | 'CRITICAL';
export type IncidentType = 'CARGO' | 'PERSONNEL' | 'EQUIPMENT' | 'WEATHER' | 'MEDICAL' | 'COMMUNICATION';

export interface Position {
  lat: number;
  lng: number;
  station?: Station;
  label?: string;
}

export interface CargoItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: CargoStatus;
  currentLocation: Station | 'EN_ROUTE';
  assignedMissionId?: string;
  assignedMissionName?: string;
  destination?: Station;
  eta?: string; // ISO date
  lastUpdated: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  reorderThreshold: number;
  consumptionRate: number; // per day
  daysUntilDepletion: number;
  lastConsumptionDate: string;
  consumptionHistory: Array<{ date: string; quantity: number }>;
}

export interface Personnel {
  id: string;
  name: string;
  role: string;
  station: Station;
  status: PersonnelStatus;
  lastCheckIn: string; // ISO date
  nextScheduledCheckIn?: string;
  missionId?: string;
  missionName?: string;
  overdueMinutes: number;
}

export interface MissionLeg {
  id: string;
  from: Station;
  to: Station;
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  cargoIds: string[];
  personnelIds: string[];
}

export interface Mission {
  id: string;
  name: string;
  status: MissionStatus;
  legs: MissionLeg[];
  currentLegIndex: number;
  startDate: string;
  estimatedEndDate: string;
  cargoIds: string[];
  personnelIds: string[];
}

export interface Incident {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  title: string;
  description: string;
  station: Station;
  relatedEntity: 'cargo' | 'personnel' | 'equipment' | 'environment' | 'unknown';
  relatedEntityId?: string;
  reportedAt: string; // ISO date
  reportedBy: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';
  acknowledgedAt?: string;
  resolvedAt?: string;
  suggestedAction?: string;
}

export interface ActionFeedItem {
  id: string;
  timestamp: string; // ISO date
  severity: IncidentSeverity;
  category: IncidentType;
  title: string;
  description: string;
  station: Station;
  actionRequired: boolean;
  suggestedAction?: string;
  source: 'inventory' | 'logistics' | 'safety' | 'emergency' | 'manual';
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface ActionFeedItemExtended extends ActionFeedItem {
  acknowledgedBy?: string;
}

export interface DashboardData {
  mapMarkers: MapMarker[];
  actionFeed: ActionFeedItem[];
  missions: Mission[];
  inventoryCritical: InventoryItem[];
  personnelSnapshot: Personnel[];
}

export interface MapMarker {
  id: string;
  type: 'cargo' | 'personnel' | 'station';
  position: Position;
  label: string;
  status?: CargoStatus | PersonnelStatus;
  entityId: string;
  details?: string;
}

// Socket events
export interface ServerToClientEvents {
  'action-feed:update': (item: ActionFeedItem) => void;
  'action-feed:remove': (id: string) => void;
  'incident:new': (incident: Incident) => void;
  'incident:update': (incident: Incident) => void;
  'personnel:checkin': (personnel: Personnel) => void;
  'cargo:status': (cargo: CargoItem) => void;
  'inventory:alert': (item: { id: string; name: string; daysLeft: number }) => void;
  'mission:status': (mission: { id: string; status: MissionStatus }) => void;
  'connection:status': (connected: boolean) => void;
}

export interface ClientToServerEvents {
  'action-feed:acknowledge': (id: string, userId: string) => void;
  'incident:acknowledge': (id: string, userId: string) => void;
  'incident:resolve': (id: string, userId: string) => void;
  'personnel:checkin': (personnelId: string, station: Station) => void;
  'cargo:update-status': (cargoId: string, status: CargoStatus) => void;
  'subscribe:dashboard': () => void;
  'unsubscribe:dashboard': () => void;
}

export interface LiveUpdateState {
  connected: boolean;
  dashboardData: DashboardData | null;
  actionFeed: ActionFeedItem[];
  incidents: Incident[];
  cargo: CargoItem[];
  personnel: Personnel[];
  missions: Mission[];
  lastUpdate: Date | null;
  error: string | null;
}