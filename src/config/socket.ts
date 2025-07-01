// src/services/websocketService.ts
import { ACCESS_TOKEN } from '@/constants';
import { toast } from 'sonner';
import { loadFromLocalStorage } from '@/libs/utils';

class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(url: string) {
    if (this.socket) return;

    const token = loadFromLocalStorage(ACCESS_TOKEN, null);

    this.socket = new WebSocket(`${url}?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      toast.info(`Message from server: ${event.data}`);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket closed');
      this.socket = null;
    };
  }

  send(message: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn('WebSocket not connected');
    }
  }

  close() {
    this.socket?.close();
    this.socket = null;
  }
}

export default WebSocketService.getInstance();
