import { ACCESS_TOKEN } from '@/constants';
import { QueryClient } from '@tanstack/react-query';
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
    const queryClient = new QueryClient();
    if (this.socket) return;

    const token = loadFromLocalStorage(ACCESS_TOKEN, null);

    this.socket = new WebSocket(`${url}?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      // Play notification sound when a message is received
      const notificationSound = document.getElementById('notification-sound') as HTMLAudioElement;
      if (notificationSound) {
        notificationSound.play().catch((error) => {
          console.error('Error playing notification sound:', error);
        });
      }
      // Invalidate the query client to refresh data
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
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
