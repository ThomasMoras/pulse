import { useCallback, useState } from "react";
import { useContract } from "./useContract";
import { pulseContract } from "@/contracts/pulse.contract";
import { InteractionStatus } from "@/types";
import { useWatchContractEvent, useAccount } from "wagmi";

export function useInteraction(onSuccess?: (recipient: string) => void) {
  const [processedTransactions, setProcessedTransactions] = useState(new Set());
  const { address: userAddress } = useAccount();

  const handleContractSuccess = useCallback(() => {
    // Le callback sera vide car on gère tout via l'événement
  }, []);

  const { writeContract, isPending, transactionHash } = useContract(handleContractSuccess);

  useWatchContractEvent({
    address: pulseContract.address,
    abi: pulseContract.abi,
    eventName: "Interacted",
    onLogs(logs) {
      logs.forEach((log) => {
        if (
          log.transactionHash === transactionHash &&
          !processedTransactions.has(log.transactionHash)
        ) {
          console.log("🎯 Processing interaction event:", {
            hash: log.transactionHash,
            currentUser: userAddress,
            args: log.args,
          });

          setProcessedTransactions((prevSet) => new Set(prevSet).add(log.transactionHash));

          try {
            const sender = log.args.sender;
            const recipient = log.args.receiver;
            const status = log.args.interraction;

            console.log("📝 Interaction details:", {
              sender,
              recipient,
              status,
              currentUser: userAddress,
            });

            if (onSuccess && recipient) {
              onSuccess(recipient as string);
            }
          } catch (error) {
            console.error("Error processing interaction:", error);
          }
        }
      });
    },
  });

  const interact = useCallback(
    async (address: string, interaction: InteractionStatus) => {
      console.log("💫 Starting interaction:", {
        address,
        interaction,
        currentUser: userAddress,
      });

      try {
        if (interaction === InteractionStatus.LIKED) {
          writeContract({
            address: pulseContract.address,
            abi: pulseContract.abi,
            functionName: "like",
            args: [address as `0x${string}`],
          });
        } else if (interaction === InteractionStatus.DISLIKED) {
          writeContract({
            address: pulseContract.address,
            abi: pulseContract.abi,
            functionName: "dislike",
            args: [address as `0x${string}`],
          });
        } else {
          writeContract({
            address: pulseContract.address,
            abi: pulseContract.abi,
            functionName: "superLike",
            args: [address as `0x${string}`],
          });
        }
      } catch (error) {
        console.error("Échec de l'interaction:", error);
      }
    },
    [writeContract, userAddress]
  );

  return { interact, isPending };
}
