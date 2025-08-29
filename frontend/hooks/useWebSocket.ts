import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

interface WebSocketMessage {
  type: 'thought_updated' | 'thought_created' | 'thought_deleted' | 'team_sync' | 'user_joined' | 'user_left';
  data: any;
  teamId?: string;
  userId?: string;
  timestamp: string;
}

interface UseWebSocketProps {
  teamId?: string;
  enabled?: boolean;
}

export function useWebSocket({ teamId, enabled = true }: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    if (!enabled || !teamId || socketRef.current?.connected) {
      return;
    }

    const socket = io('ws://localhost:8000', {
      transports: ['websocket', 'polling'],
      query: {
        teamId,
        // TODO: Add user authentication token
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setConnectionError(null);
      
      // Join team room
      socket.emit('join_team', { teamId });
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
      setActiveUsers([]);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Handle real-time updates
    socket.on('message', (message: WebSocketMessage) => {
      handleMessage(message);
    });

    // Handle user presence
    socket.on('users_updated', (users: string[]) => {
      setActiveUsers(users);
    });

    socket.on('user_joined', (userId: string) => {
      setActiveUsers(prev => [...prev.filter(u => u !== userId), userId]);
    });

    socket.on('user_left', (userId: string) => {
      setActiveUsers(prev => prev.filter(u => u !== userId));
    });

    return socket;
  }, [enabled, teamId]);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    console.log('Received WebSocket message:', message);

    switch (message.type) {
      case 'thought_updated':
        // Update the thought in React Query cache
        queryClient.setQueryData(['thoughts', message.data.id], message.data);
        queryClient.invalidateQueries({ queryKey: ['thoughts'], exact: false });
        break;

      case 'thought_created':
        // Add new thought to cache
        queryClient.invalidateQueries({ queryKey: ['thoughts'] });
        queryClient.invalidateQueries({ queryKey: ['system-stats'] });
        break;

      case 'thought_deleted':
        // Remove thought from cache
        queryClient.removeQueries({ queryKey: ['thoughts', message.data.id] });
        queryClient.invalidateQueries({ queryKey: ['thoughts'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['system-stats'] });
        break;

      case 'team_sync':
        // Refresh all team-related data
        queryClient.invalidateQueries({ queryKey: ['thoughts'] });
        queryClient.invalidateQueries({ queryKey: ['teams'] });
        queryClient.invalidateQueries({ queryKey: ['system-stats'] });
        break;

      default:
        console.warn('Unknown WebSocket message type:', message.type);
    }
  }, [queryClient]);

  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('message', {
        ...message,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setActiveUsers([]);
    }
  }, []);

  useEffect(() => {
    if (enabled && teamId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, teamId, connect, disconnect]);

  return {
    isConnected,
    connectionError,
    activeUsers,
    sendMessage,
    disconnect,
    reconnect: connect,
  };
}