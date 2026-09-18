import { Panel } from '../UI/Panel';

export function InventoryPanel({ items, className = '' }: {
  items: Array<{
    id: string;
    name: string;
    category: string;
    currentStock: number;
    unit: string;
    reorderThreshold: number;
    consumptionRate: number;
    daysUntilDepletion: number;
    lastConsumptionDate: string;
  }>;
  className?: string;
}) {
  return (
    <Panel title="INVENTORY CRITICAL" subtitle="Low-stock items • depletion timeline" className={`h-full ${className}`}>
      <div className="space-y-4">
        <p className="text-polar-text-muted text-data-sm">Inventory panel placeholder - {items.length} items</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map(item => (
            <div key={item.id} className="bg-polar-panel-ice/50 border border-polar-border-ice p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-ui font-medium text-polar-text-primary text-data-sm">{item.name}</h4>
                <span className="font-mono text-data-xs text-polar-text-muted">{item.id}</span>
              </div>
              <div className="flex items-center justify-between text-data-sm">
                <span className="font-mono text-polar-text-primary">
                  {item.currentStock.toLocaleString()} {item.unit}
                </span>
                <span className="text-polar-text-muted">/ {item.reorderThreshold} {item.unit}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex-1 h-2 bg-polar-border-ice/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '50%', backgroundColor: '#FF6B2E' }} />
                </div>
                <span className="font-mono text-data-sm font-medium text-polar-accent-warm ml-2">15d</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export default InventoryPanel;