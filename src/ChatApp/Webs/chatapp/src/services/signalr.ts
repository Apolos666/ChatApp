import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr"
import type { MessageDto, MessageStatusUpdate } from "@/app/chat/(types)/message";

export class SignalRService {
  private static instance: SignalRService;
  private connection: HubConnection;
  private messageHandlers: ((message: MessageDto) => void)[] = [];
  private statusUpdateHandlers: ((update: MessageStatusUpdate) => void)[] = [];
  private messageStore: Map<number, MessageDto> = new Map();

  private constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5221/chatHub", {
        accessTokenFactory: () => localStorage.getItem("chat_token") || "",
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();
  }

  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  public async startConnection(): Promise<void> {
    try {
      if (this.connection.state === "Disconnected") {
        await this.connection.start();
        console.log("SignalR Connected");
      }
    } catch (error) {
      console.error("SignalR Connection Error:", error);
      throw error;
    }
  }

  public isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }

  public async stop(): Promise<void> {
    try {
      await this.connection.stop();
      console.log("SignalR Disconnected");
    } catch (error) {
      console.error("SignalR Disconnection Error:", error);
      throw error;
    }
  }

  public async joinRoom(roomId: number): Promise<void> {
    try {
      await this.connection.invoke("JoinRoom", roomId);
      console.log(`Joined room ${roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
      throw error;
    }
  }

  public async leaveRoom(roomId: number): Promise<void> {
    try {
      await this.connection.invoke("LeaveRoom", roomId);
      console.log(`Left room ${roomId}`);
    } catch (error) {
      console.error("Error leaving room:", error);
      throw error;
    }
  }

  public onReceiveMessage(handler: (message: MessageDto) => void): void {
    if (!this.messageHandlers.includes(handler)) {
      this.messageHandlers.push(handler);
      this.connection.on("ReceiveMessage", (message: MessageDto) => {
        const existingMessage = this.messageStore.get(message.id);
        if (!existingMessage) {
          this.messageStore.set(message.id, message);
          handler(message);
        } else if (existingMessage.status !== message.status) {
          this.messageStore.set(message.id, message);
          handler(message);
        }
      });
    }
  }

  public onMessageStatusUpdated(handler: (update: MessageStatusUpdate) => void): void {
    if (!this.statusUpdateHandlers.includes(handler)) {
      this.statusUpdateHandlers.push(handler);
      this.connection.on("MessageStatusUpdated", (update: MessageStatusUpdate) => {
        handler(update);
      });
    }
  }

  public removeMessageHandler(handler: (message: MessageDto) => void): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    this.connection.off("ReceiveMessage", handler);
  }

  public removeStatusUpdateHandler(handler: (update: MessageStatusUpdate) => void): void {
    this.statusUpdateHandlers = this.statusUpdateHandlers.filter(h => h !== handler);
    this.connection.off("MessageStatusUpdated", handler);
  }
} 