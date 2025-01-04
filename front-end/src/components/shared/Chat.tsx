import React, { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useConversation } from "@/hooks/useConversation";
import { useAccount } from "wagmi";

interface ChatProps {
  conversationId: string;
  partnerAddress: string;
  partnerName?: string;
}

const ChatMessage = ({
  message,
  isOwnMessage,
}: {
  message: {
    content: string;
    timestamp: number | bigint; // Ajout du type bigint
    status: "sent" | "delivered" | "read";
  };
  isOwnMessage: boolean;
}) => {
  // Conversion du timestamp en nombre
  const timestamp =
    typeof message.timestamp === "bigint" ? Number(message.timestamp) : message.timestamp;

  return (
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
            {new Date(timestamp * 1000).toLocaleTimeString([], {
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
};
const Chat: React.FC<ChatProps> = ({ conversationId, partnerAddress, partnerName }) => {
  const { address } = useAccount();
  const [messageInput, setMessageInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  console.log("Rendering Chat component");

  const { messages, sendMessage, isPending, isLoading } = useConversation(
    conversationId,
    partnerAddress
  );

  console.log("Messages in Chat component:", messages);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || isPending) return;

    try {
      await sendMessage(messageInput);
      setMessageInput("");

      // Scroll to bottom
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
          top: scrollAreaRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Vous pouvez ajouter ici une notification d'erreur pour l'utilisateur
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">
          {partnerName || `${partnerAddress.slice(0, 6)}...${partnerAddress.slice(-4)}`}
        </h2>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-muted-foreground">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-muted-foreground">No messages yet</span>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isOwnMessage={msg.sender.toLowerCase() === address?.toLowerCase()}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Write your message..."
            className="flex-1"
            disabled={isPending}
          />
          <Button type="submit" size="icon" disabled={isPending || !messageInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
