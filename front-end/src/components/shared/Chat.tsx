import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useConversation } from "@/hooks/useConversation";
import { useAccount, useReadContract, useWalletClient } from "wagmi";
import { pulseContract } from "@/contracts/pulse.contract";
import { useLitEncryption } from "@/hooks/useLitEncryption";

interface ChatProps {
  conversationId: string;
  partnerAddress: string;
  partnerName?: string;
}

interface DecodedMessage {
  id: string;
  sender: string;
  content: string;
  encryptedContent: string;
  timestamp: number;
  status: "sent" | "delivered" | "read";
}

// Message component
const ChatMessage = React.memo(
  ({
    message,
    isOwnMessage,
  }: {
    message: {
      content: string;
      timestamp: number | bigint;
      status: "sent" | "delivered" | "read";
    };
    isOwnMessage: boolean;
  }) => {
    const timestamp = useMemo(
      () => (typeof message.timestamp === "bigint" ? Number(message.timestamp) : message.timestamp),
      [message.timestamp]
    );

    const formattedTime = useMemo(
      () =>
        new Date(timestamp * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      [timestamp]
    );

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
            <span className="text-[10px] text-muted-foreground">{formattedTime}</span>
            {isOwnMessage && (
              <span className="text-[10px] text-muted-foreground">
                {message.status === "read" ? "✓✓" : message.status === "delivered" ? "✓✓" : "✓"}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ChatMessage.displayName = "ChatMessage";

// Main Chat Component
const Chat: React.FC<ChatProps> = React.memo(({ conversationId, partnerAddress, partnerName }) => {
  const { address } = useAccount();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<DecodedMessage[]>([]);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { data: walletClient } = useWalletClient();
  const encryption = useLitEncryption("ethereum");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedMessageIds = useRef(new Set<string>());

  const { decodeMessages, sendMessage, isPending } = useConversation(
    conversationId,
    partnerAddress,
    async (success) => {
      if (success && pendingMessage) {
        setPendingMessage(null);
      }
    }
  );

  const { data: contractMessages } = useReadContract({
    address: pulseContract.address,
    abi: pulseContract.abi,
    functionName: "getConversationMessages",
    args: [conversationId as `0x${string}`, address as `0x${string}`],
    enabled: Boolean(conversationId && encryption && walletClient && address),
  });

  // Decode messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!contractMessages || !Array.isArray(contractMessages)) return;

      try {
        const decodedMessages = await decodeMessages(contractMessages as Message[]);

        // Filtrer les messages déjà traités
        const newMessages = decodedMessages.filter((msg) => {
          const messageId = `${msg.timestamp}-${msg.sender}`;
          if (processedMessageIds.current.has(messageId)) {
            return false;
          }
          processedMessageIds.current.add(messageId);
          return true;
        });

        if (isInitialLoad) {
          setMessages(decodedMessages);
          setIsInitialLoad(false);
        } else if (newMessages.length > 0) {
          setMessages((prev) => [...prev, ...newMessages]);
        }
      } catch (error) {
        console.error("Error decoding messages:", error);
      }
    };

    loadMessages();
  }, [contractMessages, decodeMessages, isInitialLoad]);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!messageInput.trim() || isPending || !address) return;

      const newMessageContent = messageInput;
      try {
        // Ajouter le message en attente
        setPendingMessage(newMessageContent);
        setMessageInput("");

        // Envoyer le message
        await sendMessage(newMessageContent);
      } catch (error) {
        console.error("Failed to send message:", error);
        setMessageInput(newMessageContent);
        setPendingMessage(null);
      }
    },
    [messageInput, isPending, sendMessage, address]
  );

  const messagesList = useMemo(() => {
    const allMessages = [...messages];

    // Ajouter le message en attente s'il existe
    if (pendingMessage) {
      const pendingMessageObj: DecodedMessage = {
        id: "pending",
        sender: address || "",
        content: pendingMessage,
        encryptedContent: "",
        timestamp: Math.floor(Date.now() / 1000),
        status: "sent",
      };
      allMessages.push(pendingMessageObj);
    }

    return allMessages
      .sort((a, b) => a.timestamp - b.timestamp) // S'assurer que les messages sont dans l'ordre
      .map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isOwnMessage={msg.sender.toLowerCase() === address?.toLowerCase()}
          isPending={msg.id === "pending"}
        />
      ));
  }, [messages, pendingMessage, address]);

  // ... (reste du composant reste le même)

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">
          {partnerName || `${partnerAddress.slice(0, 6)}...${partnerAddress.slice(-4)}`}
        </h2>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {messages.length === 0 && !pendingMessage ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-muted-foreground">No messages yet</span>
          </div>
        ) : (
          <div className="space-y-4">
            {messagesList}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={isPending ? "Sending..." : "Write your message..."}
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
});

Chat.displayName = "Chat";

export default Chat;
