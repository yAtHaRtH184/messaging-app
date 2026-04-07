// Base URL
export const BASE_URL = import.meta.env.VITE_API_URL;

// WebSocket endpoint
export const WS_URL = import.meta.env.VITE_API_URL + "/ws";

// ✅ MATCH YOUR BACKEND
export const STOMP_SUBSCRIBE = (roomName) => `/topic/${roomName}`;
export const STOMP_SEND = () => `/app/chat.send`;

export const PAGE_SIZE = 20;