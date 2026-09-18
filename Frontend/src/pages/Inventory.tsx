import React, { useState, useEffect } from 'react';
import { Panel, SeverityBadge, EmptyState } from '../components/UI/Panel';
import { InventoryItem } from '../types';
import { api } from '../api';

export function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConsumptionModal, setShowConsumptionModal] = useState<InventoryItem | null>(null);
  const [consumptionQty, setConsumptionQty] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.inventory.getAll();
      setInventory(data);
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogConsumption = async (item: InventoryItem) => {
    const qty = parseFloat(consumptionQty);
    if (isNaN(qty) || qty <= 0) return;

    try {
      const updated = await api.inventory.logConsumption(item.id, qty);
      if (updated) {
        setInventory(prev => prev.map(i => i.id === item.id ? updated : i));
      }
    } catch (err) {
      console.error('Failed to log consumption:', err);
    } finally {
      setShowConsumptionModal(null);
      setConsumptionQty('');
    }
  };

  const openConsumptionModal = (item: InventoryItem) => {
    setShowConsumptionModal(item);
    setConsumptionQty('');
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

  const getStatusConfig = (item: InventoryItem) => {
    if (item.currentStock <= 0) return { severity: 'CRITICAL' as const, label: 'DEPLETED', color: '#C0392B' };
    if (item.currentStock <= item.reorderThreshold) return { severity: 'CRITICAL' as const, label: 'CRITICAL', color: '#C0392B' };
    if (item.daysUntilDepletion <= 30) return { severity: 'WARNING' as const, label: 'LOW STOCK', color: '#D4A017' };
    return { severity: 'NOMINAL' as const, label: 'NOMINAL', color: '#1E8A49' };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-ui font-bold text-2xl text-primary tracking-tight">INVENTORY MANAGEMENT</h1>
          <p className="text-muted text-sm mt-1">Stock levels, consumption rates & depletion forecasts</p>
        </div>
        <button className="btn-primary text-sm whitespace-nowrap">
          ADD ITEM
        </button>
      </div>

      <Panel title="INVENTORY OVERVIEW" subtitle="Stock levels, consumption rates & depletion forecasts">
        {isLoading ? (
          <div className="text-center py-12 text-muted">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mx-auto mb-4" />
            <p>Loading inventory data...</p>
          </div>
        ) : inventory.length > 0 ? (
          <div className="table-container">
            <table className="data-table" role="table">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>CATEGORY</th>
                  <th>CURRENT STOCK</th>
                  <th>UNIT</th>
                  <th>REORDER THRESHOLD</th>
                  <th>DAYS UNTIL DEPLETION</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => {
                  const config = getStatusConfig(item);
                  const isCritical = item.currentStock <= item.reorderThreshold;
                  return (
                    <tr key={item.id} className={isCritical ? 'bg-liquid-glass' : ''}>
                      <td className="font-ui font-medium text-primary truncate max-w-xs">{item.name}</td>
                      <td className="text-muted">{item.category}</td>
                      <td className="font-mono text-base text-primary">{item.currentStock}</td>
                      <td className="text-muted">{item.unit}</td>
                      <td className="font-mono text-sm text-muted">{item.reorderThreshold}</td>
                      <td className="font-mono text-base" style={{ color: config.color }}>
                        {item.daysUntilDepletion <= 0 ? '0' : item.daysUntilDepletion}
                        <span className="text-muted text-xs ml-1">days</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <SeverityBadge severity={config.severity} size="xs" />
                          {isCritical && <span className="text-xs font-ui font-medium text-critical">⚠ BELOW THRESHOLD</span>}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => openConsumptionModal(item)}
                          disabled={item.currentStock <= 0}
                          className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          LOG CONSUMPTION
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>}
            title="No inventory items"
            description="Inventory is empty. Add items to begin tracking stock levels."
          />
        )}
      </Panel>

      {/* Consumption Modal */}
      {showConsumptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="liquid-glass w-full max-w-md">
            <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: 'rgba(179, 224, 231, 0.5)' }}>
              <h2 className="font-ui font-bold text-lg text-primary">LOG CONSUMPTION</h2>
              <button
                onClick={() => { setShowConsumptionModal(null); setConsumptionQty(''); }}
                className="p-2 text-muted hover:text-primary hover:bg-liquid-glass rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="liquid-glass p-4 space-y-1">
                <p className="font-ui font-medium text-primary">{showConsumptionModal.name}</p>
                <p className="text-muted text-sm">{showConsumptionModal.category} · {showConsumptionModal.currentStock} {showConsumptionModal.unit} available</p>
                <p className="text-muted text-xs">Reorder threshold: {showConsumptionModal.reorderThreshold} {showConsumptionModal.unit}</p>
                <p className="text-muted text-xs">Consumption rate: {showConsumptionModal.consumptionRate} {showConsumptionModal.unit}/day</p>
                <p className="text-muted text-xs">Current depletion estimate: {showConsumptionModal.daysUntilDepletion} days</p>
              </div>

              <div>
                <label className="block text-xs font-ui font-medium text-muted uppercase tracking-wider mb-1">QUANTITY CONSUMED</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={showConsumptionModal.currentStock}
                  value={consumptionQty}
                  onChange={e => setConsumptionQty(e.target.value)}
                  className="input-field"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div className="liquid-glass p-3 space-y-1 text-xs">
                <p className="text-muted">After logging:</p>
                <p className="font-mono text-primary">
                  New stock: {showConsumptionModal.currentStock - (parseFloat(consumptionQty) || 0)} {showConsumptionModal.unit}
                </p>
                <p className="font-mono text-primary">
                  Est. days remaining: {showConsumptionModal.consumptionRate > 0 
                    ? Math.max(0, Math.floor((showConsumptionModal.currentStock - (parseFloat(consumptionQty) || 0)) / showConsumptionModal.consumptionRate))
                    : 'N/A'} days
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'rgba(179, 224, 231, 0.5)' }}>
                <button
                  onClick={() => { setShowConsumptionModal(null); setConsumptionQty(''); }}
                  className="btn-secondary"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleLogConsumption(showConsumptionModal)}
                  disabled={!consumptionQty || parseFloat(consumptionQty) <= 0}
                  className="btn-primary"
                >
                  LOG CONSUMPTION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;