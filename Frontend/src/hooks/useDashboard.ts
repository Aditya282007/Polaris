import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { DashboardData, MapMarker, ActionFeedItem, IncidentSeverity, IncidentType } from '../types';
import { getDashboardData } from '../data/seed';

const SOCKET_URL = 'http://localhost:5000';

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const initialData = getDashboardData();
    setData(initialData);

    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Connected');
      setConnected(true);
      newSocket.emit('subscribe:dashboard');
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      setConnected(false);
    });

    newSocket.on('action-feed:update', (item: any) => {
      setData((prev: DashboardData | null) => prev ? { ...prev, actionFeed: [item, ...prev.actionFeed].slice(0, 50) } : null);
    });

    newSocket.on('action-feed:remove', (id: string) => {
      setData((prev: DashboardData | null) => prev ? { ...prev, actionFeed: prev.actionFeed.filter(i => i.id !== id) } : null);
    });

    newSocket.on('incident:new', (incident: any) => {
      setData((prev: DashboardData | null) => prev ? { 
        ...prev, 
        actionFeed: [{ 
          id: `AF-${Date.now()}`, 
          timestamp: incident.reportedAt, 
          severity: incident.severity as 'CRITICAL' | 'WARNING' | 'NOMINAL', 
          category: incident.type, 
          title: incident.title, 
          description: incident.description, 
          station: incident.station, 
          actionRequired: incident.severity !== 'NOMINAL', 
          suggestedAction: incident.suggestedAction, 
          source: 'emergency' as const, 
          acknowledged: false 
        }, ...(prev.actionFeed || [])].slice(0, 50) 
      } : null);
    });

    newSocket.on('personnel:checkin', (personnel: any) => {
      setData((prev: DashboardData | null) => prev ? { ...prev, personnelSnapshot: prev.personnelSnapshot.map((p: any) => p.id === personnel.id ? personnel : p) } : null);
    });

    newSocket.on('cargo:status', (cargo: any) => {
      setData((prev: DashboardData | null) => prev ? { ...prev, mapMarkers: prev.mapMarkers.map((m: any) => m.entityId === cargo.id ? { ...m, details: `Status: ${cargo.status}` } : m) } : null);
    });

    newSocket.on('inventory:alert', (alert: any) => {
      console.log('[Inventory Alert]', alert);
    });

    newSocket.on('mission:status', (update: any) => {
      setData((prev: DashboardData | null) => prev ? { ...prev, missions: prev.missions.map((m: any) => m.id === update.id ? { ...m, status: update.status } : m) } : null);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('unsubscribe:dashboard');
      newSocket.disconnect();
    };
  }, []);

  const acknowledgeAction = useCallback((id: string, userId: string = 'OPS-USER') => {
    socket?.emit('action-feed:acknowledge', id, userId);
  }, [socket]);

  const acknowledgeIncident = useCallback((id: string, userId: string = 'OPS-USER') => {
    socket?.emit('incident:acknowledge', id, userId);
  }, [socket]);

  const resolveIncident = useCallback((id: string, userId: string = 'OPS-USER') => {
    socket?.emit('incident:resolve', id, userId);
  }, [socket]);

  const checkInPersonnel = useCallback((personnelId: string, station: string) => {
    socket?.emit('personnel:checkin', personnelId, station);
  }, [socket]);

  const updateCargoStatus = useCallback((cargoId: string, status: string) => {
    socket?.emit('cargo:update-status', cargoId, status);
  }, [socket]);

  return {
    data,
    connected,
    acknowledgeAction,
    acknowledgeIncident,
    resolveIncident,
    checkInPersonnel,
    updateCargoStatus,
  };
}

export function useSeedData() {
  return null;
}