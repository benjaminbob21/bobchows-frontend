import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Real-time sync is behind the same feature flag as the server. When the
// flag is on, group-order pages subscribe to Socket.IO push updates and
// stop relying on the 5s polling interval (Study B experimental condition).
const WEBSOCKET_ENABLED = import.meta.env.VITE_USE_WEBSOCKET !== "false";

const socketRef: { current: Socket | null } = { current: null };

export const getSocket = (): Socket | null => {
  if (!WEBSOCKET_ENABLED) return null;
  if (!socketRef.current && API_BASE_URL) {
    socketRef.current = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      autoConnect: false,
    });
  }
  return socketRef.current;
};

type GroupOrderSocketPayload = {
  groupOrderId: string;
  status: string;
  paidCount: number;
  totalParticipants: number;
  deliveryDetails?: { name?: string; email?: string };
  restaurantName?: string;
  amountPerPerson?: number;
  totalAmount?: number;
  initiatorName?: string;
  paidParticipants?: {
    name?: string;
    email?: string;
    amount?: number;
    paidAt?: string;
  }[];
};

/**
 * Subscribe to real-time updates for one or more group orders. On every
 * pushed event the group-order list query is invalidated, so the UI
 * re-renders with the freshest state without waiting for the next polling
 * tick.
 */
export const useGroupOrderSocket = (groupOrderIds?: (string | undefined)[]) => {
  const queryClient = useQueryClient();
  const joinedRef = useRef<Set<string>>(new Set());

  const ids = (groupOrderIds ?? []).filter(
    (id): id is string => !!id
  );

  useEffect(() => {
    if (ids.length === 0 || !WEBSOCKET_ENABLED) return;

    const socket = getSocket();
    if (!socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    const joinRooms = () => {
      ids.forEach((id) => {
        if (!joinedRef.current.has(id)) {
          socket.emit("groupOrder:join", id);
          joinedRef.current.add(id);
        }
      });
    };

    const handleUpdate = (payload: GroupOrderSocketPayload) => {
      if (payload?.groupOrderId && ids.includes(payload.groupOrderId)) {
        queryClient.invalidateQueries("fetchGroupOrders");
      }
    };

    if (socket.connected) {
      joinRooms();
    } else {
      socket.on("connect", joinRooms);
    }

    socket.on("groupOrder:update", handleUpdate);
    socket.io.on("reconnect", joinRooms);

    return () => {
      socket.off("groupOrder:update", handleUpdate);
      socket.off("connect", joinRooms);
      socket.io.off("reconnect", joinRooms);
      joinedRef.current.forEach((id) => socket.emit("groupOrder:leave", id));
      joinedRef.current.clear();
    };
  }, [JSON.stringify(ids), queryClient]);
};

/**
 * Opt the group-order queries out of the 5s polling interval while a live
 * socket connection is active, so updates are delivered only by push.
 */
export const useGroupOrderRealtimeQueryOptions = () => {
  const socket = getSocket();
  const isRealtime = WEBSOCKET_ENABLED && !!socket?.connected;
  return { refetchInterval: isRealtime ? false : 5000 } as const;
};
