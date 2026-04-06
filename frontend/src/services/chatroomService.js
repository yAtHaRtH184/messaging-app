import api from './api';

/** Create a new chatroom. POST /api/chatroom/create */
export const createChatroom = (roomName) =>
  api.post('/api/chatroom/create', { roomName });

/** Join an existing chatroom. POST /api/chatroom/join */
export const joinChatroom = (roomName) =>
  api.post('/api/chatroom/join', { roomName });

/**
 * Fetch paginated message history.
 * GET /api/chatroom/history/{chatroomId}?page=0&size=20
 */
export const getChatHistory = (chatroomId, page = 0, size = 20) =>
  api.get(`/api/chatroom/history/${chatroomId}`, { params: { page, size } });
