"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";

export function useContract(onSuccess?: () => void) {
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const hasCalledSuccess = useRef(false);

  const { data: hash, error, isPending: isWritePending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess && !hasCalledSuccess.current) {
      hasCalledSuccess.current = true;
      if (onSuccess) {
        onSuccess();
      }
      toast({
        title: "Congratulations",
        description: "Transaction has succeeded!",
      });
    }

    // Reset le flag quand une nouvelle transaction commence
    if (isWritePending) {
      hasCalledSuccess.current = false;
    }
  }, [isSuccess, onSuccess, toast, isWritePending]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Transaction failed.",
      });
    }
    if (hash && isConfirming) {
      toast({
        title: "Information",
        description: "Transaction is being processed.",
      });
    }
  }, [error, hash, isConfirming, toast]);

  return {
    isConnected,
    isPending: isWritePending || isConfirming,
    writeContract,
    transactionHash: hash,
  };
}
