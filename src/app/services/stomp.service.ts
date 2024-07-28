import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StompService {

  private stompClient: any;
  private socket: any;
  private isConnected = false;
  
  constructor() {
  }

  connect(onConnectCallback: () => void): void {
    const url = `${environment.API_URL}/sba-websocket`;
    this.socket = new SockJS(url);
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.reconnect_delay = 5000;
    const connectWebSocket = () => {
      this.stompClient.connect({}, () => {
        this.isConnected = true;
        onConnectCallback();
      }, (error: any) => {
        this.isConnected = false;
      });
    };
    connectWebSocket(); 
    timer(5000, 5000).subscribe(() => {
      if (!this.isConnected) {
        connectWebSocket();
      }
    });
  }


  subscribeToTopic(topic: string, callback: (body: any) => void): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe(topic, (message: any) => {
        callback(message.body);
      });
    } else {
    }
  }

  subscribeToTopicResult(topic: string, callback: (body: string) => void): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe(topic, (message: any) => {
        callback(message.body);
      });
    } else {
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        this.isConnected = false;
      });
    }
  }

}
