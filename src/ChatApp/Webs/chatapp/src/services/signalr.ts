import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import type { MessageDto } from "@/types/message";

export class SignalRService {
  private static instance: SignalRService;
  private connection: HubConnection;
  private messageHandlers: ((message: MessageDto) => void)[] = [];

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
    console.log("called leave room")
    try {
      await this.connection.invoke("LeaveRoom", roomId);
      console.log(`Left room ${roomId}`);
    } catch (error) {
      console.error("Error leaving room:", error);
      throw error;
    }
  }

  public removeMessageHandler(handler: (message: MessageDto) => void): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    this.connection.off("ReceiveMessage", handler);
  }

  public onReceiveMessage(handler: (message: MessageDto) => void): void {
    if (!this.messageHandlers.includes(handler)) {
      this.messageHandlers.push(handler);
      this.connection.on("ReceiveMessage", handler);
    }
  }
} 