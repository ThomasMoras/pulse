import { useCallback, useState, useEffect, useRef } from "react";
import { useContract } from "./useContract";
import { pulseContract } from "@/contracts/pulse.contract";
import { useWatchContractEvent, useAccount, useReadContract } from "wagmi";
import { useLitEncryption } from "./useLitEncryption";
import { useWalletClient } from "wagmi";

interface Message {
  sender: string;
  encryptedContent: string;
  timestamp: number;
}

interface DecodedMessage extends Message {
  id: string;
  content: string;
  status: "sent" | "delivered" | "read";
}

export function useConversation(
  conversationId?: string,
  partnerAddress?: string,
  onSuccess?: (recipient: string) => void
) {
  const [processedTransactions, setProcessedTransactions] = useState(new Set());
  const [messages, setMessages] = useState<DecodedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { address: userAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const encryption = useLitEncryption("ethereum");
  const lastMessagesRef = useRef<Message[]>([]);

  const handleContractSuccess = useCallback(() => {
    // Le callback sera vide car on gère tout via l'événement
  }, []);

  const { writeContract, isPending, transactionHash } = useContract(handleContractSuccess);

  // Récupération des messages depuis le contrat
  const { data: contractMessages, refetch } = useReadContract({
    address: pulseContract.address,
    abi: pulseContract.abi,
    functionName: "getConversationMessages",
    args: conversationId ? [conversationId as `0x${string}`, userAddress] : undefined,
    enabled: Boolean(conversationId && encryption && walletClient),
  });

  // Fonction pour décoder les messages
  const decodeMessages = useCallback(
    async (rawMessages: Message[]) => {
      if (!encryption || !walletClient || !userAddress || !partnerAddress) return [];

      console.log("Decoding messages, count:", rawMessages.length);

      try {
        const decodedMessages = await Promise.all(
          rawMessages.map(async (msg) => {
            let decryptedContent = "";
            try {
              const isOwnMessage = msg.sender.toLowerCase() === userAddress.toLowerCase();
              decryptedContent = await encryption.decryptMessage(
                msg.encryptedContent,
                isOwnMessage ? partnerAddress : userAddress,
                walletClient as any
              );
              console.log(decryptedContent);

              const decodedMessage = {
                ...msg,
                id: `${msg.timestamp}-${msg.sender}`,
                content: decryptedContent,
                status: "delivered",
              };

              return decodedMessage;
            } catch (error) {
              console.error("Decryption failed:", error, {
                sender: msg.sender,
                timestamp: msg.timestamp,
              });
              return {
                ...msg,
                id: `${msg.timestamp}-${msg.sender}`,
                content: "Message cannot be decrypted",
                status: "delivered",
              };
            }
          })
        );

        return decodedMessages;
      } catch (error) {
        console.error("Error decoding messages:", error);
        return [];
      }
    },
    [encryption, walletClient, userAddress, partnerAddress]
  );

  // useEffect(() => {
  //   const loadMessages = async () => {
  //     if (!contractMessages || !Array.isArray(contractMessages)) return;

  //     if (
  //       lastMessagesRef.current.length === contractMessages.length &&
  //       lastMessagesRef.current.every((msg, i) => msg === contractMessages[i])
  //     ) {
  //       // Si les messages n'ont pas changé, ne pas déclencher decodeMessages
  //       console.log("Messages unchanged, skipping update");
  //       return;
  //     }
  //     lastMessagesRef.current = contractMessages;

  //     console.log("Loading messages...");
  //     setIsLoading(true);
  //     try {
  //       const decoded = await decodeMessages(contractMessages as Message[]);
  //       console.log("Decoded messages:", decoded);
  //       setMessages(decoded);
  //     } catch (error) {
  //       console.error("Error loading messages:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadMessages();
  // }, [contractMessages, decodeMessages]);

  // WORKING BUT 2 CALL
  // useEffect(() => {
  //   const loadMessages = async () => {
  //     if (!contractMessages || !Array.isArray(contractMessages)) return;
  //     setIsLoading(true);
  //     try {
  //       const decoded = await decodeMessages(contractMessages as Message[]);
  //       setMessages(decoded);
  //     } catch (error) {
  //       console.error("Error loading messages:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadMessages();
  // }, [contractMessages, decodeMessages]);

  // Surveillance des nouveaux messages
  useWatchContractEvent({
    address: pulseContract.address,
    abi: pulseContract.abi,
    eventName: "NewMessage",
    onLogs(logs) {
      logs.forEach((log) => {
        if (
          log.transactionHash === transactionHash &&
          !processedTransactions.has(log.transactionHash)
        ) {
          setProcessedTransactions((prevSet) => new Set(prevSet).add(log.transactionHash));

          try {
            const sender = log.args.sender;
            const timestamp = log.args.timestamp;
            const msgConversationId = log.args.conversationId;

            if (msgConversationId === conversationId) {
              // Rafraîchir les messages
              refetch();
            }

            if (onSuccess && msgConversationId) {
              onSuccess(msgConversationId as string);
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
      if (!walletClient.account) {
        console.error("No account connected");
        return;
      }

      console.log("💫 Starting sendMessage");

      try {
        // Chiffrer le message
        const encryptedMessage = await encryption.encryptMessage(
          messageContent,
          partnerAddress,
          walletClient as any // Cast to ethers.Signer
        );

        console.log(encryptedMessage);
        // Envoyer le message chiffré
        writeContract({
          address: pulseContract.address,
          abi: pulseContract.abi,
          functionName: "sendMessage",
          args: [conversationId as `0x${string}`, encryptedMessage],
        });

        // Optimistic update
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${userAddress}`,
            sender: userAddress || "",
            content: messageContent,
            encryptedContent: encryptedMessage,
            timestamp: Math.floor(Date.now() / 1000),
            status: "sent",
          },
        ]);
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    },
    [encryption, walletClient, conversationId, partnerAddress, writeContract, userAddress]
  );

  return {
    messages,
    sendMessage,
    isPending,
    isLoading,
    refetchMessages: refetch,
  };
}
