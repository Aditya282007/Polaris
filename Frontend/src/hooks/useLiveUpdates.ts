import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { DashboardData, ActionFeedItem, Incident, CargoItem, Personnel, Mission, MissionStatus, LiveUpdateState } from '../types';
import { api } from '../api';

const SOCKET_URL = 'http://localhost:5000';

interface UseLiveUpdatesOptions {
  enabled?: boolean;
  pollingInterval?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

export function useLiveUpdates(options: UseLiveUpdatesOptions = {}) {
  const {
    enabled = true,
    pollingInterval = 30000,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [state, setState] = useState<LiveUpdateState>({
    connected: false,
    dashboardData: null,
    actionFeed: [],
    incidents: [],
    cargo: [],
    personnel: [],
    missions: [],
    lastUpdate: null,
    error: null,
  });

  const socketRef = useRef<Socket | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  const updateState = useCallback((updates: Partial<LiveUpdateState>) => {
    if (!isMountedRef.current) return;
    setState((prevState: LiveUpdateState) => ({ ...prevState, ...updates, lastUpdate: new Date(), error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    if (!isMountedRef.current) return;
    setState((prevState: LiveUpdateState) => ({ ...prevState, error, connected: false }));
    onError?.(error);
  }, [onError]);

  const initializeData = useCallback(async () => {
    try {
      const [dashboardData, actionFeed, incidents, cargo, personnel, missions] = await Promise.all([
        api.dashboard.getData(),
        api.actionFeed.getAll(),
        api.incidents.getAll(),
        api.cargo.getAll(),
        api.personnel.getAll(),
        api.missions.getAll(),
      ]);
      
      updateState({
        dashboardData,
        actionFeed,
        incidents,
        cargo,
        personnel,
        missions,
      });
    } catch (err) {
      console.error('Failed to initialize data:', err);
      setError('Failed to load initial data');
    }
  }, [updateState, setError]);

  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) return;

    try {
      const socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socket.on('connect', () => {
        console.log('[Socket] Connected');
        updateState({ connected: true });
        socket.emit('subscribe:dashboard');
        onConnect?.();
      });

      socket.on('disconnect', (reason: string) => {
        console.log('[Socket] Disconnected:', reason);
        updateState({ connected: false });
        onDisconnect?.();
      });

      socket.on('connect_error', (err: Error) => {
        console.error('[Socket] Connection error:', err.message);
        setError(`Connection error: ${err.message}`);
      });

      socket.on('action-feed:update', (item: ActionFeedItem) => {
        setState((prevState: LiveUpdateState) => ({ 
          ...prevState, 
          actionFeed: [item, ...prevState.actionFeed].slice(0, 50),
          lastUpdate: new Date(),
        }));
      });

      socket.on('action-feed:remove', (id: string) => {
        setState((prevState: LiveUpdateState) => ({ 
          ...prevState, 
          actionFeed: prevState.actionFeed.filter(i => i.id !== id),
          lastUpdate: new Date(),
        }));
      });

      socket.on('incident:new', (incident: Incident) => {
        const newActionFeedItem: ActionFeedItem = {
          id: `AF-${Date.now()}`,
          timestamp: incident.reportedAt,
          severity: incident.severity,
          category: incident.type,
          title: incident.title,
          description: incident.description,
          station: incident.station,
          actionRequired: incident.severity !== 'NOMINAL',
          suggestedAction: incident.suggestedAction,
          source: 'emergency',
          acknowledged: false,
        };
        setState((prevState: LiveUpdateState) => ({ 
          ...prevState, 
          incidents: [incident, ...prevState.incidents],
          actionFeed: [newActionFeedItem, ...prevState.actionFeed].slice(0, 50),
          lastUpdate: new Date(),
        }));
      });

      socket.on('incident:update', (incident: Incident) => {
        setState((prevState: LiveUpdateState) => ({ 
          ...prevState, 
          incidents: prevState.incidents.map(i => i.id === incident.id ? incident : i),
          lastUpdate: new Date(),
        }));
      });

      socket.on('personnel:checkin', (personnelItem: Personnel) => {
        setState((prevState: LiveUpdateState) => ({ 
          ...prevState, 
          personnel: prevState.personnel.map(p => p.id === personnelItem.id ? personnelItem : p),
          lastUpdate: new Date(),
        }));
      });

      socket.on('cargo:status', (cargoItem: CargoItem) => {
        setState((prevState: LiveUpdateState) => ({ 
          ...prevState, 
          cargo: prevState.cargo.map(c => c.id === cargoItem.id ? cargoItem : c),
          lastUpdate: new Date(),
        }));
      });

      socket.on('inventory:alert', (alert: { id: string; name: string; daysLeft: number }) => {
        console.log('[Inventory Alert]', alert);
      });

      socket.on('mission:status', (update: { id: string; status: MissionStatus }) => {
        setState((prevState: LiveUpdateState) => ({ 
          ...prevState, 
          missions: prevState.missions.map(m => m.id === update.id ? { ...m, status: update.status } : m),
          lastUpdate: new Date(),
        }));
      });

      socket.on('connection:status', (connected: boolean) => {
        updateState({ connected });
      });

      socketRef.current = socket;
    } catch (err) {
      console.error('[Socket] Failed to create connection:', err);
      setError('Failed to establish real-time connection');
    }
  }, [updateState, setError, onConnect, onDisconnect]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('unsubscribe:dashboard');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return;
    
    pollingIntervalRef.current = setInterval(async () => {
      if (!state.connected) {
        try {
          const [dashboardData, actionFeed] = await Promise.all([
            api.dashboard.getData(),
            api.actionFeed.getAll(),
          ]);
          updateState({ dashboardData, actionFeed });
        } catch (err) {
          console.error('[Polling] Failed to fetch updates:', err);
        }
      }
    }, pollingInterval);
  }, [state.connected, pollingInterval, updateState]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    initializeData();

    if (enabled) {
      connectSocket();
      startPolling();
    }

    return () => {
      isMountedRef.current = false;
      disconnectSocket();
      stopPolling();
    };
  }, [enabled, initializeData, connectSocket, disconnectSocket, startPolling, stopPolling]);

  const acknowledgeAction = useCallback(async (id: string) => {
    try {
      await api.actionFeed.acknowledge(id);
      setState((prevState: LiveUpdateState) => ({ 
        ...prevState, 
        actionFeed: prevState.actionFeed.map(item => 
          item.id === id ? { ...item, acknowledged: true, acknowledgedBy: 'CURRENT_USER', acknowledgedAt: new Date().toISOString() } : item
        ),
        lastUpdate: new Date(),
      }));
    } catch (err) {
      console.error('Failed to acknowledge action:', err);
      setError('Failed to acknowledge action');
    }
  }, [setError]);

  const refreshData = useCallback(async () => {
    await initializeData();
  }, [initializeData]);

  return {
    ...state,
    acknowledgeAction,
    refreshData,
    isConnected: state.connected,
  };
}

export default useLiveUpdates;