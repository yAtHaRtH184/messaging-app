// Base URL for all REST API calls
export const BASE_URL = 'http://localhost:8080';

// WebSocket endpoint
export const WS_URL = `${BASE_URL}/ws`;

// STOMP destinations
export const STOMP_SUBSCRIBE = (roomName)   => `/topic/${roomName}`;
export const STOMP_SEND      = (chatroomId) => `/app/chat.send`;

// Chat history
export const PAGE_SIZE = 20;
