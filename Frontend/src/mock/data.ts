import { 
  Station, CargoItem, InventoryItem, Mission, MissionLeg, Incident, ActionFeedItem, MapMarker, DashboardData, 
  CargoStatus, PersonnelStatus, MissionStatus, IncidentSeverity, IncidentType, Personnel 
} from '../types';

export const STATIONS: Record<Station, { name: string; position: { lat: number; lng: number } }> = {
  MAITRI: { name: 'Maitri', position: { lat: -70.77, lng: 11.73 } },
  BHARATI: { name: 'Bharati', position: { lat: -69.41, lng: 76.19 } },
  HIMADRI: { name: 'Himadri', position: { lat: 78.92, lng: 11.92 } },
};

export const MOCK_CARGO: CargoItem[] = [
  { id: 'CRG-001', name: 'Diesel Fuel (Arctic Grade)', category: 'Fuel', quantity: 45000, unit: 'L', status: 'IN_TRANSIT', currentLocation: 'EN_ROUTE', assignedMissionId: 'MSN-2026-03', assignedMissionName: 'Antarctic Resupply 2026', destination: 'MAITRI', eta: '2026-02-15T08:00:00Z', lastUpdated: '2026-01-20T14:30:00Z' },
  { id: 'CRG-002', name: 'AN-124 Spare Engine', category: 'Aviation', quantity: 1, unit: 'UNIT', status: 'PACKED', currentLocation: 'BHARATI', assignedMissionId: 'MSN-2026-03', assignedMissionName: 'Antarctic Resupply 2026', destination: 'MAITRI', eta: '2026-02-18T12:00:00Z', lastUpdated: '2026-01-22T09:15:00Z' },
  { id: 'CRG-003', name: 'Medical Supplies - Trauma Kit', category: 'Medical', quantity: 12, unit: 'KIT', status: 'ARRIVED', currentLocation: 'MAITRI', assignedMissionId: 'MSN-2026-02', assignedMissionName: 'Winter Medical Rotation', destination: 'MAITRI', eta: '2026-01-10T10:00:00Z', lastUpdated: '2026-01-10T10:05:00Z' },
  { id: 'CRG-004', name: 'Ice Core Drill Assembly', category: 'Science', quantity: 2, unit: 'UNIT', status: 'IN_TRANSIT', currentLocation: 'EN_ROUTE', assignedMissionId: 'MSN-2026-04', assignedMissionName: 'Deep Ice Coring 2026', destination: 'BHARATI', eta: '2026-02-25T18:00:00Z', lastUpdated: '2026-01-21T16:45:00Z' },
  { id: 'CRG-005', name: 'Thermal Insulation Panels', category: 'Construction', quantity: 500, unit: 'M2', status: 'PACKED', currentLocation: 'HIMADRI', assignedMissionId: 'MSN-2026-05', assignedMissionName: 'Arctic Station Upgrade', destination: 'HIMADRI', eta: '2026-03-01T06:00:00Z', lastUpdated: '2026-01-22T11:20:00Z' },
  { id: 'CRG-006', name: 'Satellite Comm Array', category: 'Communications', quantity: 3, unit: 'UNIT', status: 'ARRIVED', currentLocation: 'BHARATI', assignedMissionId: 'MSN-2026-01', assignedMissionName: 'Comm Relay Deployment', destination: 'BHARATI', eta: '2025-12-15T00:00:00Z', lastUpdated: '2025-12-15T08:30:00Z' },
  { id: 'CRG-007', name: 'Polar Research Modules', category: 'Science', quantity: 4, unit: 'UNIT', status: 'PACKED', currentLocation: 'MAITRI', assignedMissionId: 'MSN-2026-04', assignedMissionName: 'Deep Ice Coring 2026', destination: 'BHARATI', eta: '2026-03-10T00:00:00Z', lastUpdated: '2026-01-22T14:00:00Z' },
  { id: 'CRG-008', name: 'Emergency Rations Cache', category: 'Food', quantity: 2000, unit: 'PKT', status: 'ARRIVED', currentLocation: 'HIMADRI', assignedMissionId: 'MSN-2026-05', assignedMissionName: 'Arctic Station Upgrade', destination: 'HIMADRI', eta: '2026-02-01T00:00:00Z', lastUpdated: '2026-01-15T10:00:00Z' },
  { id: 'CRG-009', name: 'Snowmobile Fleet (6 units)', category: 'Transport', quantity: 6, unit: 'UNIT', status: 'IN_TRANSIT', currentLocation: 'EN_ROUTE', assignedMissionId: 'MSN-2026-05', assignedMissionName: 'Arctic Station Upgrade', destination: 'HIMADRI', eta: '2026-02-20T00:00:00Z', lastUpdated: '2026-01-18T16:00:00Z' },
  { id: 'CRG-010', name: 'Weather Radar System', category: 'Equipment', quantity: 1, unit: 'UNIT', status: 'PACKED', currentLocation: 'MAITRI', assignedMissionId: 'MSN-2026-03', assignedMissionName: 'Antarctic Resupply 2026', destination: 'MAITRI', eta: '2026-02-28T00:00:00Z', lastUpdated: '2026-01-22T12:00:00Z' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'INV-001', name: 'Jet A-1 Fuel', category: 'Fuel', currentStock: 18500, unit: 'L', reorderThreshold: 20000, consumptionRate: 850, daysUntilDepletion: 22, lastConsumptionDate: '2026-01-22', consumptionHistory: [{ date: '2026-01-15', quantity: 850 }, { date: '2026-01-16', quantity: 820 }, { date: '2026-01-17', quantity: 880 }, { date: '2026-01-18', quantity: 860 }, { date: '2026-01-19', quantity: 840 }, { date: '2026-01-20', quantity: 870 }, { date: '2026-01-21', quantity: 830 }, { date: '2026-01-22', quantity: 850 }] },
  { id: 'INV-002', name: 'Dehydrated Rations (Type IV)', category: 'Food', currentStock: 840, unit: 'PKT', reorderThreshold: 1000, consumptionRate: 48, daysUntilDepletion: 18, lastConsumptionDate: '2026-01-22', consumptionHistory: [{ date: '2026-01-15', quantity: 48 }, { date: '2026-01-16', quantity: 48 }, { date: '2026-01-17', quantity: 48 }, { date: '2026-01-18', quantity: 48 }, { date: '2026-01-19', quantity: 48 }, { date: '2026-01-20', quantity: 48 }, { date: '2026-01-21', quantity: 48 }, { date: '2026-01-22', quantity: 48 }] },
  { id: 'INV-003', name: 'Medical Oxygen Cylinders', category: 'Medical', currentStock: 14, unit: 'CYL', reorderThreshold: 20, consumptionRate: 1.2, daysUntilDepletion: 12, lastConsumptionDate: '2026-01-22', consumptionHistory: [{ date: '2026-01-15', quantity: 1 }, { date: '2026-01-18', quantity: 2 }, { date: '2026-01-20', quantity: 1 }, { date: '2026-01-22', quantity: 1 }] },
  { id: 'INV-004', name: 'Lithium-Ion Battery Packs (12V)', category: 'Power', currentStock: 8, unit: 'UNIT', reorderThreshold: 10, consumptionRate: 0.3, daysUntilDepletion: 27, lastConsumptionDate: '2026-01-20', consumptionHistory: [{ date: '2026-01-15', quantity: 1 }, { date: '2026-01-20', quantity: 1 }] },
  { id: 'INV-005', name: 'Polar-Grade Hydraulic Fluid', category: 'Maintenance', currentStock: 420, unit: 'L', reorderThreshold: 500, consumptionRate: 12, daysUntilDepletion: 35, lastConsumptionDate: '2026-01-21', consumptionHistory: [{ date: '2026-01-15', quantity: 12 }, { date: '2026-01-18', quantity: 12 }, { date: '2026-01-21', quantity: 12 }] },
  { id: 'INV-006', name: 'VHF/UHF Radio Transceivers', category: 'Communications', currentStock: 6, unit: 'UNIT', reorderThreshold: 8, consumptionRate: 0.1, daysUntilDepletion: 60, lastConsumptionDate: '2026-01-10', consumptionHistory: [] },
  { id: 'INV-007', name: 'Insulated Pipe Sections', category: 'Construction', currentStock: 45, unit: 'M', reorderThreshold: 50, consumptionRate: 2.5, daysUntilDepletion: 18, lastConsumptionDate: '2026-01-22', consumptionHistory: [{ date: '2026-01-15', quantity: 2 }, { date: '2026-01-18', quantity: 3 }, { date: '2026-01-22', quantity: 2 }] },
  { id: 'INV-008', name: 'Antarctic Sleeping Bags', category: 'Survival', currentStock: 12, unit: 'UNIT', reorderThreshold: 15, consumptionRate: 0.2, daysUntilDepletion: 60, lastConsumptionDate: '2026-01-10', consumptionHistory: [] },
  { id: 'INV-009', name: 'Helicopter Rotor Blades', category: 'Aviation', currentStock: 3, unit: 'UNIT', reorderThreshold: 4, consumptionRate: 0.05, daysUntilDepletion: 60, lastConsumptionDate: '2026-01-01', consumptionHistory: [] },
  { id: 'INV-010', name: 'Solar Panel Arrays', category: 'Power', currentStock: 20, unit: 'UNIT', reorderThreshold: 25, consumptionRate: 0.8, daysUntilDepletion: 25, lastConsumptionDate: '2026-01-22', consumptionHistory: [{ date: '2026-01-15', quantity: 1 }, { date: '2026-01-22', quantity: 1 }] },
];

export const MOCK_PERSONNEL: Personnel[] = [
  { id: 'PER-001', name: 'Dr. Arvind K. Rao', role: 'Station Leader', station: 'MAITRI', status: 'CHECKED_IN', lastCheckIn: '2026-01-22T06:00:00Z', nextScheduledCheckIn: '2026-01-22T18:00:00Z', missionId: 'MSN-2026-03', missionName: 'Antarctic Resupply 2026', overdueMinutes: 0 },
  { id: 'PER-002', name: 'Priya Patel', role: 'Scientist', station: 'BHARATI', status: 'ON_FIELD', lastCheckIn: '2026-01-22T05:30:00Z', nextScheduledCheckIn: '2026-01-22T17:30:00Z', missionId: 'MSN-2026-03', missionName: 'Antarctic Resupply 2026', overdueMinutes: 0 },
  { id: 'PER-003', name: 'Dr. Meera K. Iyer', role: 'Chief Medical Officer', station: 'BHARATI', status: 'CHECKED_IN', lastCheckIn: '2026-01-22T07:15:00Z', nextScheduledCheckIn: '2026-01-22T19:15:00Z', missionId: 'MSN-2026-04', missionName: 'Deep Ice Coring 2026', overdueMinutes: 0 },
  { id: 'PER-004', name: 'Lars H. Eriksson', role: 'Power Systems Lead', station: 'HIMADRI', status: 'OVERDUE', lastCheckIn: '2026-01-21T22:00:00Z', nextScheduledCheckIn: '2026-01-22T10:00:00Z', missionId: 'MSN-2026-05', missionName: 'Arctic Station Upgrade', overdueMinutes: 780 },
  { id: 'PER-005', name: 'Aisha M. Al-Farsi', role: 'Glaciologist', station: 'BHARATI', status: 'CHECKED_IN', lastCheckIn: '2026-01-22T06:45:00Z', nextScheduledCheckIn: '2026-01-22T18:45:00Z', missionId: 'MSN-2026-04', missionName: 'Deep Ice Coring 2026', overdueMinutes: 0 },
  { id: 'PER-006', name: 'Rajesh Kumar', role: 'Medical Officer', station: 'MAITRI', status: 'CHECKED_OUT', lastCheckIn: '2026-01-21T20:00:00Z', nextScheduledCheckIn: '2026-01-22T08:00:00Z', overdueMinutes: 0 },
  { id: 'PER-007', name: 'Anika S. Desai', role: 'Heavy Equipment Operator', station: 'HIMADRI', status: 'CHECKED_IN', lastCheckIn: '2026-01-22T05:45:00Z', nextScheduledCheckIn: '2026-01-22T17:45:00Z', missionId: 'MSN-2026-05', missionName: 'Arctic Station Upgrade', overdueMinutes: 0 },
  { id: 'PER-008', name: 'Viktor M. Kozlov', role: 'Atmospheric Scientist', station: 'BHARATI', status: 'ON_FIELD', lastCheckIn: '2026-01-22T04:30:00Z', nextScheduledCheckIn: '2026-01-22T16:30:00Z', missionId: 'MSN-2026-01', missionName: 'Comm Relay Deployment', overdueMinutes: 0 },
];

export const MOCK_MISSIONS: Mission[] = [
  { id: 'MSN-2026-01', name: 'Comm Relay Deployment', status: 'COMPLETED', legs: [{ id: 'LEG-001', from: 'HIMADRI', to: 'BHARATI', startDate: '2025-11-15T00:00:00Z', endDate: '2025-12-15T00:00:00Z', status: 'COMPLETED', cargoIds: ['CRG-006'], personnelIds: ['PER-008'] }], currentLegIndex: 1, startDate: '2025-11-15T00:00:00Z', estimatedEndDate: '2025-12-15T00:00:00Z', cargoIds: ['CRG-006'], personnelIds: ['PER-008'] },
  { id: 'MSN-2026-02', name: 'Winter Medical Rotation', status: 'COMPLETED', legs: [{ id: 'LEG-002', from: 'MAITRI', to: 'BHARATI', startDate: '2025-12-01T00:00:00Z', endDate: '2026-01-10T00:00:00Z', status: 'COMPLETED', cargoIds: ['CRG-003'], personnelIds: ['PER-003'] }], currentLegIndex: 1, startDate: '2025-12-01T00:00:00Z', estimatedEndDate: '2026-01-10T00:00:00Z', cargoIds: ['CRG-003'], personnelIds: ['PER-003'] },
  { id: 'MSN-2026-03', name: 'Antarctic Resupply 2026', status: 'ACTIVE', legs: [{ id: 'LEG-003', from: 'MAITRI', to: 'BHARATI', startDate: '2026-01-10T00:00:00Z', endDate: '2026-02-20T00:00:00Z', status: 'ACTIVE', cargoIds: ['CRG-001', 'CRG-002'], personnelIds: ['PER-001', 'PER-002'] }, { id: 'LEG-004', from: 'MAITRI', to: 'BHARATI', startDate: '2026-02-22T00:00:00Z', endDate: '2026-03-15T00:00:00Z', status: 'UPCOMING', cargoIds: [], personnelIds: ['PER-001', 'PER-002'] }], currentLegIndex: 0, startDate: '2026-01-10T00:00:00Z', estimatedEndDate: '2026-03-15T00:00:00Z', cargoIds: ['CRG-001', 'CRG-002'], personnelIds: ['PER-001', 'PER-002'] },
  { id: 'MSN-2026-04', name: 'Deep Ice Coring 2026', status: 'ACTIVE', legs: [{ id: 'LEG-005', from: 'MAITRI', to: 'BHARATI', startDate: '2026-01-05T00:00:00Z', endDate: '2026-02-25T00:00:00Z', status: 'ACTIVE', cargoIds: ['CRG-004'], personnelIds: ['PER-003', 'PER-005'] }, { id: 'LEG-006', from: 'BHARATI', to: 'MAITRI', startDate: '2026-02-28T00:00:00Z', endDate: '2026-04-15T00:00:00Z', status: 'UPCOMING', cargoIds: [], personnelIds: ['PER-003', 'PER-005'] }], currentLegIndex: 0, startDate: '2026-01-05T00:00:00Z', estimatedEndDate: '2026-04-15T00:00:00Z', cargoIds: ['CRG-004'], personnelIds: ['PER-003', 'PER-005'] },
  { id: 'MSN-2026-05', name: 'Arctic Station Upgrade', status: 'PLANNING', legs: [{ id: 'LEG-007', from: 'HIMADRI', to: 'HIMADRI', startDate: '2026-03-01T00:00:00Z', endDate: '2026-04-30T00:00:00Z', status: 'UPCOMING', cargoIds: ['CRG-005'], personnelIds: ['PER-004', 'PER-007'] }], currentLegIndex: 0, startDate: '2026-03-01T00:00:00Z', estimatedEndDate: '2026-04-30T00:00:00Z', cargoIds: ['CRG-005'], personnelIds: ['PER-004', 'PER-007'] },
];

export const MOCK_INCIDENTS: Incident[] = [
  { id: 'INC-001', type: 'CARGO', severity: 'CRITICAL', title: 'CRG-001 Fuel Shipment Delayed', description: 'Vessel MV Polar Star delayed 72hrs due to severe sea state (Sea State 7) in Southern Ocean. ETA now 2026-02-18. Fuel reserves at Maitri critical (22 days remaining).', station: 'MAITRI', relatedEntity: 'cargo', relatedEntityId: 'CRG-001', reportedAt: '2026-01-22T08:15:00Z', reportedBy: 'OPS-CTR-DELHI', status: 'OPEN', suggestedAction: 'Divert auxiliary fuel from Bharati reserves; activate emergency air-drop contingency' },
  { id: 'INC-002', type: 'PERSONNEL', severity: 'CRITICAL', title: 'PER-004 Overdue Check-in (13hrs)', description: 'Eng. Eriksson missed 10:00 check-in at Himadri. Last contact 22:00 previous day. Comms intermittent due to ionospheric disturbance.', station: 'HIMADRI', relatedEntity: 'personnel', relatedEntityId: 'PER-004', reportedAt: '2026-01-22T11:30:00Z', reportedBy: 'HIMADRI-OPS', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-01-22T11:45:00Z', suggestedAction: 'Dispatch SAR team via snowmobile; establish HF radio relay via Ny-Ålesund' },
  { id: 'INC-003', type: 'EQUIPMENT', severity: 'WARNING', title: 'INV-003 Medical O2 Below Threshold', description: 'Medical oxygen at 14 cylinders (threshold 20). Consumption accelerated due to respiratory cases. 12 days remaining at current rate.', station: 'BHARATI', relatedEntity: 'equipment', relatedEntityId: 'INV-003', reportedAt: '2026-01-22T09:00:00Z', reportedBy: 'BHARATI-MED', status: 'OPEN', suggestedAction: 'Expedite INV-003 resupply via next available flight; ration non-emergency usage' },
  { id: 'INC-004', type: 'WEATHER', severity: 'WARNING', title: 'Catabatic Wind Event - Maitri', description: 'Forecast: sustained 85 km/h, gusts 120 km/h for 18hrs. Cargo ops suspended. Personnel shelter-in-place.', station: 'MAITRI', relatedEntity: 'environment', relatedEntityId: undefined, reportedAt: '2026-01-22T06:00:00Z', reportedBy: 'MET-CTR-PUNE', status: 'OPEN', suggestedAction: 'Secure all external cargo; verify shelter integrity; suspend helo ops' },
  { id: 'INC-005', type: 'COMMUNICATION', severity: 'NOMINAL', title: 'HF Link Degradation - Bharati', description: 'Ionospheric absorption causing 40% packet loss on HF link. Switching to Iridium backup. No operational impact.', station: 'BHARATI', relatedEntity: 'unknown', relatedEntityId: undefined, reportedAt: '2026-01-22T04:20:00Z', reportedBy: 'COMMS-CTR', status: 'IN_PROGRESS', suggestedAction: 'Monitor; switch to SATCOM primary if degradation exceeds 60%' },
];

export const MOCK_ACTION_FEED: ActionFeedItem[] = [
  { id: 'AF-001', timestamp: '2026-01-22T11:30:00Z', severity: 'CRITICAL', category: 'PERSONNEL', title: 'PER-004 Overdue Check-in (13hrs)', description: 'Eng. Eriksson missed 10:00 check-in at Himadri. SAR dispatched.', station: 'HIMADRI', actionRequired: true, suggestedAction: 'SAR team en route via snowmobile; ETA 45min', source: 'safety', acknowledged: true, acknowledgedBy: 'OPS-CTR-DELHI', acknowledgedAt: '2026-01-22T11:45:00Z' },
  { id: 'AF-002', timestamp: '2026-01-22T08:15:00Z', severity: 'CRITICAL', category: 'CARGO', title: 'CRG-001 Fuel Delayed 72hrs', description: 'MV Polar Star delayed by Sea State 7. Maitri fuel: 22 days remaining.', station: 'MAITRI', actionRequired: true, suggestedAction: 'Divert Bharati reserves; prep air-drop', source: 'logistics', acknowledged: false },
  { id: 'AF-003', timestamp: '2026-01-22T09:00:00Z', severity: 'WARNING', category: 'EQUIPMENT', title: 'INV-003 Medical O2 Below Threshold', description: 'Medical oxygen at 14 cylinders (threshold 20). Consumption up 40% due to respiratory cases.', station: 'BHARATI', actionRequired: true, suggestedAction: 'Expedite resupply; ration non-emergency', source: 'inventory', acknowledged: false },
  { id: 'AF-004', timestamp: '2026-01-22T06:00:00Z', severity: 'WARNING', category: 'WEATHER', title: 'Catabatic Wind Event - Maitri', description: '85 km/h sustained, 120 km/h gusts for 18hrs. Cargo ops suspended.', station: 'MAITRI', actionRequired: true, suggestedAction: 'Secure cargo; shelter-in-place; suspend helo ops', source: 'emergency', acknowledged: false },
  { id: 'AF-005', timestamp: '2026-01-22T04:20:00Z', severity: 'NOMINAL', category: 'COMMUNICATION', title: 'HF Link Degradation - Bharati', description: '40% packet loss on HF link. Satellite link restored.', station: 'BHARATI', actionRequired: false, suggestedAction: 'Monitor; switch to SATCOM primary if >60% loss', source: 'emergency', acknowledged: false },
  { id: 'AF-006', timestamp: '2026-01-21T22:00:00Z', severity: 'CRITICAL', category: 'PERSONNEL', title: 'PER-004 Missed 22:00 Check-in', description: 'Eng. Eriksson missed 22:00 check-in at Himadri. Comms intermittent. SAR on standby.', station: 'HIMADRI', actionRequired: true, suggestedAction: 'SAR team standby; prep snowmobile', source: 'safety', acknowledged: true, acknowledgedBy: 'HIMADRI-OPS', acknowledgedAt: '2026-01-21T22:15:00Z' },
];

export const MOCK_MAP_MARKERS: MapMarker[] = [
  { id: 'MM-001', type: 'station', position: { lat: -70.77, lng: 11.73, label: 'Maitri' }, label: 'Maitri', entityId: 'MAITRI', details: 'Station Leader: Dr. Rao | 8 personnel | Fuel: 22 days', status: undefined },
  { id: 'MM-002', type: 'station', position: { lat: -69.41, lng: 76.19, label: 'Bharati' }, label: 'Bharati', entityId: 'BHARATI', details: 'Station Leader: Dr. Iyer | 6 personnel | O2: 12 days' },
  { id: 'MM-003', type: 'station', position: { lat: 78.92, lng: 11.92, label: 'Himadri' }, label: 'Himadri', entityId: 'HIMADRI', details: 'Station Leader: Eng. Eriksson | 5 personnel | 1 OVERDUE' },
  { id: 'MM-004', type: 'cargo', position: { lat: -62.5, lng: 20.0, label: 'CRG-001' }, label: 'CRG-001', entityId: 'CRG-001', details: 'Diesel Fuel 45,000L | ETA 2026-02-18 | MV Polar Star', status: 'IN_TRANSIT' },
  { id: 'MM-005', type: 'cargo', position: { lat: -68.0, lng: 72.0, label: 'CRG-004' }, label: 'CRG-004', entityId: 'CRG-004', details: 'Ice Core Drill | ETA 2026-02-25 | MV Polar Star', status: 'IN_TRANSIT' },
  { id: 'MM-006', type: 'personnel', position: { lat: -70.77, lng: 11.73, label: 'PER-001' }, label: 'PER-001', entityId: 'PER-001', details: 'Dr. Arvind K. Rao | Station Leader | CHECKED_IN', status: 'CHECKED_IN' },
  { id: 'MM-007', type: 'personnel', position: { lat: 78.92, lng: 11.92, label: 'PER-004' }, label: 'PER-004', entityId: 'PER-004', details: 'Eng. Eriksson | Power Systems | OVERDUE 13hrs', status: 'OVERDUE' },
];

export function getDashboardData(): DashboardData {
  return {
    mapMarkers: MOCK_MAP_MARKERS,
    actionFeed: MOCK_ACTION_FEED,
    missions: MOCK_MISSIONS,
    inventoryCritical: MOCK_INVENTORY.filter(i => i.daysUntilDepletion <= 30),
    personnelSnapshot: MOCK_PERSONNEL,
  };
}

export const CARGO_STATUS_HISTORY: Record<string, Array<{ status: CargoStatus; timestamp: string; location: string; note?: string }>> = {
  'CRG-001': [
    { status: 'PACKED', timestamp: '2026-01-15T10:00:00Z', location: 'BHARATI', note: 'Loaded onto MV Polar Star' },
    { status: 'IN_TRANSIT', timestamp: '2026-01-20T14:30:00Z', location: 'EN_ROUTE', note: 'Departed Bharati, ETA 2026-02-15' },
  ],
  'CRG-002': [
    { status: 'PACKED', timestamp: '2026-01-22T09:15:00Z', location: 'BHARATI', note: 'Awaiting transport' },
  ],
  'CRG-003': [
    { status: 'PACKED', timestamp: '2025-12-15T08:00:00Z', location: 'MAITRI', note: 'Prepared for deployment' },
    { status: 'IN_TRANSIT', timestamp: '2025-12-20T12:00:00Z', location: 'EN_ROUTE', note: 'In transit via helicopter' },
    { status: 'ARRIVED', timestamp: '2026-01-10T10:05:00Z', location: 'MAITRI', note: 'Delivered to medical bay' },
  ],
  'CRG-004': [
    { status: 'PACKED', timestamp: '2026-01-10T14:00:00Z', location: 'BHARATI', note: 'Crated for shipment' },
    { status: 'IN_TRANSIT', timestamp: '2026-01-21T16:45:00Z', location: 'EN_ROUTE', note: 'Loaded on MV Polar Star' },
  ],
  'CRG-005': [
    { status: 'PACKED', timestamp: '2026-01-22T11:20:00Z', location: 'HIMADRI', note: 'Stored in warehouse bay 3' },
  ],
  'CRG-006': [
    { status: 'PACKED', timestamp: '2025-11-20T08:00:00Z', location: 'HIMADRI', note: 'Prepared for deployment' },
    { status: 'IN_TRANSIT', timestamp: '2025-11-25T10:00:00Z', location: 'EN_ROUTE', note: 'Transport to Bharati' },
    { status: 'ARRIVED', timestamp: '2025-12-15T08:30:00Z', location: 'BHARATI', note: 'Installed at comm tower' },
  ],
  'CRG-007': [
    { status: 'PACKED', timestamp: '2026-01-22T14:00:00Z', location: 'MAITRI', note: 'Awaiting transport to Bharati' },
  ],
  'CRG-008': [
    { status: 'PACKED', timestamp: '2026-01-10T08:00:00Z', location: 'HIMADRI', note: 'Stocked in emergency cache' },
    { status: 'ARRIVED', timestamp: '2026-01-15T10:00:00Z', location: 'HIMADRI', note: 'Deployed to emergency shelter' },
  ],
  'CRG-009': [
    { status: 'PACKED', timestamp: '2026-01-15T09:00:00Z', location: 'HIMADRI', note: 'Loaded on cargo vessel' },
    { status: 'IN_TRANSIT', timestamp: '2026-01-18T16:00:00Z', location: 'EN_ROUTE', note: 'En route to Himadri' },
  ],
  'CRG-010': [
    { status: 'PACKED', timestamp: '2026-01-22T12:00:00Z', location: 'MAITRI', note: 'Awaiting deployment' },
  ],
};

export const CARGO_STATUSES: CargoStatus[] = ['PACKED', 'IN_TRANSIT', 'ARRIVED'];
export const PERSONNEL_STATUSES: PersonnelStatus[] = ['CHECKED_IN', 'CHECKED_OUT', 'ON_FIELD', 'OVERDUE'];
export const MISSION_STATUSES: MissionStatus[] = ['PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
export const INCIDENT_SEVERITIES: IncidentSeverity[] = ['CRITICAL', 'WARNING', 'NOMINAL'];
export const INCIDENT_TYPES: IncidentType[] = ['CARGO', 'PERSONNEL', 'EQUIPMENT', 'WEATHER', 'MEDICAL', 'COMMUNICATION'];