import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_URL, STOMP_SUBSCRIBE, STOMP_SEND } from '../utils/constants';

class WebSocketService {
  constructor() {
    this.client       = null;
    this.subscription = null;
  }

  connect(roomName, onMessage, onConnect) {
    this.disconnect();

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('chatToken') || ''}`,
      },
      onConnect: (frame) => {
        console.log('[WS] Connected:', frame.command);
        this.subscription = this.client.subscribe(
          STOMP_SUBSCRIBE(roomName),
          (stompMessage) => {
            try {
              const parsed = JSON.parse(stompMessage.body);
              onMessage(parsed);
            } catch (e) {
              console.error('[WS] Failed to parse message:', e);
            }
          }
        );
        if (onConnect) onConnect();
      },
      onStompError:    (frame) => console.error('[WS] STOMP error:', frame.headers?.message ?? frame),
      onWebSocketClose:(event) => console.warn('[WS] WebSocket closed:', event.code, event.reason),
    });

    this.client.activate();
  }

  sendMessage(chatroomId, message) {
    if (!this.client?.connected) {
      console.warn('[WS] Cannot send — not connected');
      return;
    }
    this.client.publish({
      destination: STOMP_SEND(),
      body: JSON.stringify(message),
    });
  }

  sendTyping(chatroomId, username, isTyping) {
    if (!this.client?.connected) return;
    this.client.publish({
      destination: `/app/chat/${chatroomId}/typing`,
      body: JSON.stringify({ username, isTyping }),
    });
  }

  disconnect() {
    if (this.subscription) {
      try { this.subscription.unsubscribe(); } catch (_) {}
      this.subscription = null;
    }
    if (this.client) {
      try { this.client.deactivate(); } catch (_) {}
      this.client = null;
    }
  }

  get isConnected() { return !!this.client?.connected; }
}

export default new WebSocketService();
