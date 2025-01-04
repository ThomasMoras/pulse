import { useCallback, useState, useEffect } from "react";
import { useContract } from "./useContract";
import { pulseContract } from "@/contracts/pulse.contract";
import { useWatchContractEvent, useAccount, useReadContract, useWalletClient } from "wagmi";
import { useLitEncryption } from "./useLitEncryption";

interface Message {
  sender: string;
  encryptedContent: string;
  timestamp: number;
}

interface DecodedMessage {
  id: string;
  sender: string;
  content: string;
  encryptedContent: string;
  timestamp: number;
  status: "sent" | "delivered" | "read";
}

export function useConversation(
  conversationId?: string,
  partnerAddress?: string,
  onSuccess?: (success: boolean) => void
) {
  const [processedTransactions, setProcessedTransactions] = useState(new Set());
  const [messages, setMessages] = useState<DecodedMessage[]>([]);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const { address: userAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const encryption = useLitEncryption("ethereum");

  const handleContractSuccess = useCallback(() => {
    // Le callback sera vide car on gère tout via les événements
  }, []);

  const { writeContract, isPending } = useContract(handleContractSuccess);

  const { data: contractMessages } = useReadContract({
    address: pulseContract.address,
    abi: pulseContract.abi,
    functionName: "getConversationMessages",
    args: conversationId ? [conversationId as `0x${string}`, userAddress] : undefined,
    enabled: Boolean(conversationId && encryption && walletClient),
  });

  const decodeMessages = useCallback(
    async (rawMessages: Message[]) => {
      if (!encryption || !walletClient || !userAddress || !partnerAddress) {
        return [];
      }

      try {
        const messagesToDecode = rawMessages.map((msg) => ({
          encryptedData: msg.encryptedContent,
          recipientAddress:
            msg.sender.toLowerCase() === userAddress.toLowerCase() ? partnerAddress : userAddress,
        }));

        const decodedContents = await encryption.decryptMessages(
          messagesToDecode,
          walletClient as any
        );

        return rawMessages.map((msg, index) => ({
          id: `${msg.timestamp}-${msg.sender}`,
          sender: msg.sender,
          content: decodedContents[index],
          encryptedContent: msg.encryptedContent,
          timestamp: Number(msg.timestamp),
          status: msg.sender.toLowerCase() === userAddress.toLowerCase() ? "sent" : "delivered",
        }));
      } catch (error) {
        console.error("Error decoding messages:", error);
        return [];
      }
    },
    [encryption, walletClient, userAddress, partnerAddress]
  );

  // Effet pour décoder les messages quand ils sont reçus
  useEffect(() => {
    const loadMessages = async () => {
      if (!contractMessages || !Array.isArray(contractMessages)) return;

      try {
        const decodedMessages = await decodeMessages(contractMessages as Message[]);
        setMessages(decodedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [contractMessages, decodeMessages]);

  // Surveillance des nouveaux messages
  useWatchContractEvent({
    address: pulseContract.address,
    abi: pulseContract.abi,
    eventName: "NewMessage",
    onLogs(logs) {
      logs.forEach((log) => {
        if (!processedTransactions.has(log.transactionHash)) {
          setProcessedTransactions((prev) => new Set([...prev, log.transactionHash]));

          try {
            const msgConversationId = log.args.conversationId;

            if (msgConversationId === conversationId && onSuccess) {
              onSuccess(true);
            }
          } catch (error) {
            console.error("Error processing NewMessage:", error);
          }
        }
      });
    },
  });

  const sendMessage = useCallback(
    async (messageContent: string) => {
      if (!encryption || !walletClient || !conversationId || !partnerAddress) {
        console.error("Missing required dependencies for sending message");
        return;
      }

      try {
        setPendingMessage(messageContent);
        const encryptedMessage = await encryption.encryptMessage(
          messageContent,
          partnerAddress,
          walletClient as any
        );

        await writeContract({
          address: pulseContract.address,
          abi: pulseContract.abi,
          functionName: "sendMessage",
          args: [conversationId as `0x${string}`, encryptedMessage],
        });
      } catch (error) {
        console.error("Failed to send message:", error);
        setPendingMessage(null);
        throw error;
      }
    },
    [encryption, walletClient, conversationId, partnerAddress, writeContract]
  );

  return {
    messages,
    pendingMessage,
    sendMessage,
    isPending,
    decodeMessages,
  };
}
