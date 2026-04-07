// Base URL for all REST API calls
export const BASE_URL = import.meta.env.VITE_API_URL;   

// WebSocket endpoint
export const WS_URL = import.meta.env.VITE_API_URL + "/ws";


// STOMP destinations
export const STOMP_SUBSCRIBE = (roomName)   =>  `/topic/chat/${roomName}`
export const STOMP_SEND      = (chatroomId) => `/app/chat/${chatroomId}`;

// Chat history
export const PAGE_SIZE = 20;
