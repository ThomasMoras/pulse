import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount } from "wagmi";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  status: "sent" | "delivered" | "read";
}

interface ChatProps {
  conversationId: string;
  partnerAddress: string;
  partnerName?: string;
}

const ChatMessage = ({ message, isOwnMessage }: { message: Message; isOwnMessage: boolean }) => (
  <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
    <div
      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
        isOwnMessage ? "bg-primary text-primary-foreground ml-12" : "bg-muted mr-12"
      }`}
    >
      <p className="text-sm">{message.content}</p>
      <div
        className={`flex items-center gap-1 mt-1 ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        <span className="text-[10px] text-muted-foreground">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {isOwnMessage && (
          <span className="text-[10px] text-muted-foreground">
            {message.status === "read" ? "✓✓" : message.status === "delivered" ? "✓✓" : "✓"}
          </span>
        )}
      </div>
    </div>
  </div>
);

const Chat: React.FC<ChatProps> = ({ conversationId, partnerAddress, partnerName }) => {
  const { address } = useAccount();
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  // Simulation de messages pour l'exemple
  React.useEffect(() => {
    setMessages([
      {
        id: "1",
        content: "Salut ! Comment vas-tu ?",
        sender: partnerAddress,
        timestamp: Date.now() - 3600000,
        status: "read",
      },
      {
        id: "2",
        content: "Hey ! Ça va bien merci, et toi ?",
        sender: address || "",
        timestamp: Date.now() - 3500000,
        status: "read",
      },
      {
        id: "3",
        content: "Parfait ! On pourrait peut-être se rencontrer un de ces jours ?",
        sender: partnerAddress,
        timestamp: Date.now() - 3400000,
        status: "delivered",
      },
    ]);
  }, [address, partnerAddress]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: address || "",
      timestamp: Date.now(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Scroll to bottom after sending message
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">
          {partnerName || `${partnerAddress.slice(0, 6)}...${partnerAddress.slice(-4)}`}
        </h2>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} isOwnMessage={msg.sender === address} />
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
