import { useCallback } from "react";
import { useContract } from "./useContract";
import { pulseContract } from "@/contracts/pulse.contract";
import { InteractionStatus } from "@/types";

export function useInteraction(onSuccess?: () => void) {
  const { writeContract, isPending } = useContract(onSuccess);

  const interact = useCallback(
    async (address: string, interaction: InteractionStatus) => {
      try {
        const config = {
          address: pulseContract.address,
          abi: pulseContract.abi,
          args: [address as `0x${string}`],
        };
        let functionName: string;
        switch (interaction) {
          case InteractionStatus.LIKED:
            functionName = "like";
            break;
          case InteractionStatus.DISLIKED:
            functionName = "dislike";
            break;
          default:
            functionName = "superLike";
        }

        writeContract({
          ...config,
          functionName,
        });

        return { success: true };
      } catch (error) {
        console.error("Échec de l'interraction :", error);
        return { success: false, error };
      }
    },
    [writeContract]
  );

  return { interact, isPending };
}
