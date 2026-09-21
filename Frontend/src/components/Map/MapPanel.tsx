import React from 'react';
import { MapMarker } from '../../types';
import { STATIONS } from '../../data/seed';

interface MapPanelProps {
  markers: MapMarker[];
  className?: string;
}

const STATION_COORDS: Record<string, { x: number; y: number; label: string }> = {
  MAITRI: { x: 42, y: 78, label: 'MAITRI' },
  BHARATI: { x: 78, y: 82, label: 'BHARATI' },
  HIMADRI: { x: 58, y: 12, label: 'HIMADRI' },
};

function polarProjection(lat: number, lng: number): { x: number; y: number } {
  if (lat > 0) {
    const radius = (90 - lat) * 0.8;
    const angle = (lng - 90) * (Math.PI / 180);
    return { x: 50 + radius * Math.cos(angle), y: 50 - radius * Math.sin(angle) };
  }
  const radius = (90 + lat) * 0.8;
  const angle = (lng + 90) * (Math.PI / 180);
  return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
}

function MarkerIcon({ type, status, size = 20 }: { type: 'cargo' | 'personnel' | 'station'; status?: string; size?: number }) {
  const colors = {
    station: '#0A0A0A',
    cargo: status === 'ARRIVED' ? '#1E8A49' : status === 'IN_TRANSIT' ? '#D4A017' : '#2874A6',
    personnel: status === 'CHECKED_IN' ? '#1E8A49' : status === 'ON_FIELD' ? '#2874A6' : status === 'OVERDUE' ? '#C0392B' : '#6B6B6B',
  };
  const color = colors[type] || '#0A0A0A';
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r={type === 'station' ? 5 : 4} fill={color} stroke="#FFFFFF" strokeWidth="2" />
      {type === 'station' && <circle cx="12" cy="12" r={8} fill="none" stroke={color} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />}
    </svg>
  );
}

interface MarkerProps {
  marker: MapMarker;
  onClick?: (marker: MapMarker) => void;
  onHover?: (marker: MapMarker | null) => void;
}

function Marker({ marker, onClick, onHover }: MarkerProps) {
  const pos = polarProjection(marker.position.lat, marker.position.lng);
  const isStation = marker.type === 'station';
  
  return (
    <g 
      onClick={() => onClick?.(marker)} 
      onMouseEnter={() => onHover?.(marker)}
      onMouseLeave={() => onHover?.(null)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {isStation && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r="8"
          fill="none"
          stroke="#B3E0E7"
          strokeWidth="1"
          opacity="0.3"
        />
      )}
      <MarkerIcon type={marker.type} status={marker.status} size={isStation ? 24 : 20} />
      
      {/* Station labels - always visible, positioned below marker */}
      {isStation && (
        <text
          x={pos.x}
          y={pos.y + 18}
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="11"
          fill="#6B6B6B"
          fontWeight="500"
        >
          {marker.label}
        </text>
      )}
    </g>
  );
}

export function MapPanel({ markers, className = '' }: MapPanelProps) {
  const [hoveredMarker, setHoveredMarker] = React.useState<typeof markers[0] | null>(null);
  
  const stationMarkers = markers.filter(m => m.type === 'station');
  const otherMarkers = markers.filter(m => m.type !== 'station');
  
  return (
    <div className={`w-full aspect-square min-h-[400px] max-h-[600px] ${className}`}>
      <div className="relative w-full h-full liquid-glass-card overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
          <defs>
            <radialGradient id="polarGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FAFBFC" />
              <stop offset="100%" stopColor="#F0F4F7" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#polarGradient)" />
          
          {/* Latitude circles */}
          <g stroke="#B3E0E7" strokeWidth="0.5" fill="none" opacity="0.3">
            <circle cx="50" cy="50" r="10" />
            <circle cx="50" cy="50" r="20" />
            <circle cx="50" cy="50" r="30" />
            <circle cx="50" cy="50" r="40" />
          </g>
          
          {/* Longitude lines */}
          <g stroke="#B3E0E7" strokeWidth="0.5" fill="none" opacity="0.2">
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <line
                key={angle}
                x1="50"
                y1="50"
                x2={50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}
                y2={50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}
              />
            ))}
          </g>
          
          {/* Coastline approximation - Antarctica */}
          <path
            d="M15,65 Q25,60 35,62 Q45,65 55,70 Q65,75 70,78 Q75,82 70,88 Q60,92 45,94 Q30,92 20,85 Q15,80 15,70 Z"
            fill="#F0F4F7"
            stroke="#B3E0E7"
            strokeWidth="0.5"
            opacity="0.5"
          />
          
          {/* Station labels (always visible) - from STATION_COORDS */}
          {Object.entries(STATION_COORDS).map(([code, pos]) => (
            <g key={code}>
              <circle cx={pos.x} cy={pos.y} r="4" fill="#0A0A0A" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx={pos.x} cy={pos.y} r="10" fill="none" stroke="#0A0A0A" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
              <text
                x={pos.x}
                y={pos.y + 14}
                textAnchor="middle"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="10"
                fill="#6B6B6B"
                fontWeight="500"
              >
                {pos.label}
              </text>
            </g>
          ))}
          
          {/* Cargo & Personnel markers */}
          {otherMarkers.map(marker => (
            <Marker 
              key={marker.id} 
              marker={marker} 
              onClick={setHoveredMarker}
              onHover={setHoveredMarker}
            />
          ))}
        </svg>
        
        {/* Legend */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-3 justify-center px-3">
          {[
            { label: 'Station', color: '#0A0A0A', type: 'station' },
            { label: 'Cargo - Arrived', color: '#1E8A49', type: 'cargo', status: 'ARRIVED' },
            { label: 'Cargo - In Transit', color: '#D4A017', type: 'cargo', status: 'IN_TRANSIT' },
            { label: 'Cargo - Packed', color: '#2874A6', type: 'cargo', status: 'PACKED' },
            { label: 'Personnel - OK', color: '#1E8A49', type: 'personnel', status: 'CHECKED_IN' },
            { label: 'Personnel - Field', color: '#2874A6', type: 'personnel', status: 'ON_FIELD' },
            { label: 'Personnel - Overdue', color: '#C0392B', type: 'personnel', status: 'OVERDUE' },
          ].map(item => (
            <span key={item.label} className="flex items-center gap-1.5 text-[10px] text-muted">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r={item.type === 'station' ? 5 : 4} fill={item.color} stroke="#FFFFFF" strokeWidth="2" />
              </svg>
              <span className="text-[10px] text-muted">{item.label}</span>
            </span>
          ))}
        </div>
        
        {/* Hover tooltip for cargo/personnel markers */}
        {hoveredMarker && hoveredMarker.type !== 'station' && (
          <div
            className="absolute z-10 liquid-glass-card p-3 text-[12px] max-w-xs pointer-events-none"
            style={{
              left: `${Math.min(Math.max(hoveredMarker.position.lat > 0 ? 75 : 15, 5), 95)}%`,
              top: `${Math.min(Math.max(hoveredMarker.position.lat < 0 ? 75 : 15, 5), 95)}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <p className="font-ui font-medium text-primary mb-1">{hoveredMarker.label}</p>
            <p className="text-muted text-[11px]">{hoveredMarker.details || hoveredMarker.entityId}</p>
            {hoveredMarker.status && (
              <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] rounded-full bg-glass-bg text-muted border border-glass-border">
                {hoveredMarker.status}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPanel;