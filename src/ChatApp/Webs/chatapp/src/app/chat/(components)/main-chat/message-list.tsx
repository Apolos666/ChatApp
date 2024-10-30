import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { Message } from "../types";

const messages: Message[] = [
  { id: 1, sender: "Jonas", content: "Hello, something ...", time: "21:00" },
  { id: 2, sender: "Toàn", content: "That's good idea", time: "21:05" },
  { id: 3, sender: "Jonas", content: "Hello, something ...", time: "21:10" },
  { id: 4, sender: "Jonas", content: "Hello, something ...", time: "21:10" },
  { id: 5, sender: "Jonas", content: "Hello, something ...", time: "21:10" },
];

export const MessageList = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 messages-scrollbar bg-slate-300">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.sender === "Toàn" ? "justify-end" : "justify-start"
          }`}
        >
          <Card
            className={`max-w-xs ${
              msg.sender === "Toàn"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <CardHeader className="py-1 px-3">
              <p className="font-semibold">{msg.sender}</p>
            </CardHeader>
            <CardContent className="py-1 px-3">
              <p>{msg.content}</p>
            </CardContent>
            <CardFooter className="py-1 px-3">
              <p className="text-xs">{msg.time}</p>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};
