import React, { useState, useEffect } from 'react';
import { Panel, SeverityBadge, EmptyState } from '../components/UI/Panel';
import { CargoItem, CargoStatus } from '../types';
import { api } from '../api';

export function CargoTracking() {
  const [cargo, setCargo] = useState<CargoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCargo, setSelectedCargo] = useState<CargoItem | null>(null);
  const [statusHistory, setStatusHistory] = useState<Array<{ status: CargoStatus; timestamp: string; location: string; note?: string }>>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [availableStatuses, setAvailableStatuses] = useState<CargoStatus[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cargoData, statuses] = await Promise.all([
        api.cargo.getAll(),
        api.cargo.getStatuses(),
      ]);
      setCargo(cargoData);
      setAvailableStatuses(statuses);
    } catch (err) {
      console.error('Failed to load cargo data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: CargoStatus) => {
    try {
      const updated = await api.cargo.updateStatus(id, newStatus);
      if (updated) {
        setCargo(prev => prev.map(c => c.id === id ? updated : c));
        if (selectedCargo?.id === id) {
          setSelectedCargo(updated);
          const history = await api.cargo.getStatusHistory(id);
          setStatusHistory(history);
        }
      }
    } catch (err) {
      console.error('Failed to update cargo status:', err);
    }
  };

  const handleRowClick = async (item: CargoItem) => {
    setSelectedCargo(item);
    const history = await api.cargo.getStatusHistory(item.id);
    setStatusHistory(history);
    setShowDrawer(true);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric', 
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC' 
  }) + ' UTC';

  const getStatusConfig = (status: CargoStatus) => {
    switch (status) {
      case 'ARRIVED': return { bg: 'rgba(30, 138, 73, 0.12)', text: '#1E8A49', border: 'rgba(30, 138, 73, 0.3)' };
      case 'IN_TRANSIT': return { bg: 'rgba(212, 160, 23, 0.12)', text: '#D4A017', border: 'rgba(212, 160, 23, 0.3)' };
      case 'PACKED': return { bg: 'rgba(40, 116, 166, 0.12)', text: '#2874A6', border: 'rgba(40, 116, 166, 0.3)' };
      default: return { bg: 'rgba(107, 107, 107, 0.12)', text: '#6B6B6B', border: 'rgba(107, 107, 107, 0.3)' };
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-ui font-bold text-2xl text-primary tracking-tight">CARGO TRACKING</h1>
          <p className="text-muted text-sm mt-1">Real-time cargo status, location & ETA across all stations</p>
        </div>
        <button className="btn-primary text-sm whitespace-nowrap">
          ADD CARGO
        </button>
      </div>

      <Panel title="CARGO MANIFEST" subtitle="All tracked cargo items across stations">
        {isLoading ? (
          <div className="text-center py-12 text-muted">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mx-auto mb-4" />
            <p>Loading cargo data...</p>
          </div>
        ) : cargo.length > 0 ? (
          <div className="table-container">
            <table className="data-table" role="table">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>CATEGORY</th>
                  <th>STATUS</th>
                  <th>LOCATION</th>
                  <th>ASSIGNED MISSION</th>
                  <th>QTY / UNIT</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {cargo.map(item => {
                  const config = getStatusConfig(item.status);
                  return (
                    <tr key={item.id} className="cursor-pointer hover:bg-liquid-glass" onClick={() => handleRowClick(item)}>
                      <td className="font-ui font-medium text-primary truncate max-w-xs">{item.name}</td>
                      <td className="text-muted">{item.category}</td>
                      <td>
                        <select
                          value={item.status}
                          onChange={e => { e.stopPropagation(); handleStatusChange(item.id, e.target.value as CargoStatus); }}
                          className="select-field text-xs"
                          style={{ backgroundColor: config.bg, color: config.text, borderColor: config.border }}
                        >
                          {availableStatuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="text-muted font-mono text-xs">{item.currentLocation}</td>
                      <td className="text-muted truncate max-w-xs">
                        {item.assignedMissionName || '—'}
                        {item.assignedMissionId && <span className="font-mono text-xs ml-1">({item.assignedMissionId})</span>}
                      </td>
                      <td className="text-muted font-mono text-xs">{item.quantity} {item.unit}</td>
                      <td className="text-muted font-mono text-xs">{item.eta ? formatDate(item.eta) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3m0 0v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M9 10h1M15 10h1"/></svg>}
            title="No cargo items"
            description="Cargo manifest is empty. Add items to begin tracking."
          />
        )}
      </Panel>

      {/* Detail Drawer */}
      {showDrawer && selectedCargo && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-4 modal-overlay">
          <div className="liquid-glass w-full md:w-96 max-h-[90vh] overflow-y-auto relative z-10">
            <div className="flex items-center justify-between border-b px-6 py-5 sticky top-0 z-10" style={{ borderColor: 'rgba(179, 224, 231, 0.5)' }}>
              <h2 className="font-ui font-bold text-lg text-primary">CARGO DETAILS</h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-2 text-muted hover:text-primary hover:bg-liquid-glass rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-ui font-semibold text-primary text-base mb-2">{selectedCargo.name}</h3>
                <p className="text-muted text-sm">{selectedCargo.category} · {selectedCargo.quantity} {selectedCargo.unit}</p>
              </div>

              <div className="grid gap-4">
                <div className="liquid-glass p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted uppercase tracking-wider">CURRENT STATUS</span>
                    <SeverityBadge severity={selectedCargo.status === 'ARRIVED' ? 'NOMINAL' : selectedCargo.status === 'IN_TRANSIT' ? 'WARNING' : 'NOMINAL'} size="sm" />
                  </div>
                  <p className="font-mono text-xl font-semibold text-primary">{selectedCargo.status}</p>
                </div>
                <div className="liquid-glass p-4 space-y-2">
                  <span className="text-xs text-muted uppercase tracking-wider">LOCATION</span>
                  <p className="font-mono text-base text-primary">{selectedCargo.currentLocation}</p>
                </div>
                <div className="liquid-glass p-4 space-y-2">
                  <span className="text-xs text-muted uppercase tracking-wider">DESTINATION</span>
                  <p className="font-mono text-base text-primary">{selectedCargo.destination || '—'}</p>
                </div>
                <div className="liquid-glass p-4 space-y-2">
                  <span className="text-xs text-muted uppercase tracking-wider">ETA</span>
                  <p className="font-mono text-base text-primary">{selectedCargo.eta ? formatDate(selectedCargo.eta) : 'Not specified'}</p>
                </div>
                <div className="liquid-glass p-4 space-y-2">
                  <span className="text-xs text-muted uppercase tracking-wider">ASSIGNED MISSION</span>
                  <p className="font-mono text-base text-primary">{selectedCargo.assignedMissionName || '—'}</p>
                  {selectedCargo.assignedMissionId && <p className="text-muted text-xs">{selectedCargo.assignedMissionId}</p>}
                </div>
                <div className="liquid-glass p-4 space-y-2">
                  <span className="text-xs text-muted uppercase tracking-wider">LAST UPDATED</span>
                  <p className="font-mono text-base text-primary">{formatDate(selectedCargo.lastUpdated)}</p>
                </div>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: 'rgba(179, 224, 231, 0.5)' }}>
                <h4 className="font-ui font-medium text-primary text-sm uppercase tracking-wider mb-3">STATUS HISTORY</h4>
                {statusHistory.length > 0 ? (
                  <div className="space-y-3">
                    {statusHistory.map((entry, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 liquid-glass">
                        <div className="flex-shrink-0 w-10 flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${entry.status === 'ARRIVED' ? 'bg-success' : entry.status === 'IN_TRANSIT' ? 'bg-warning' : 'bg-info'}`} />
                          <div className="w-px h-full" style={{ backgroundColor: 'rgba(179, 224, 231, 0.5)', flex: 1 }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-ui font-medium text-sm text-primary">{entry.status}</span>
                            <span className="text-muted text-xs font-mono">{entry.location}</span>
                          </div>
                          <p className="text-muted text-sm">{formatDate(entry.timestamp)}</p>
                          {entry.note && <p className="text-muted/80 text-xs mt-1">{entry.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-sm text-center py-4">No status history available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CargoTracking;