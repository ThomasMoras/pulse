"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useContract } from "@/hooks/useContract";

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";

export function useContract(successCallback: () => void) {
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const {
    data: writeContractHash,
    status: writeContractStatus,
    writeContract,
  } = useWriteContract();
  const { status: transactionStatus } = useWaitForTransactionReceipt({
    hash: writeContractHash,
  });

  useEffect(() => {
    if (writeContractStatus === "error" || transactionStatus === "error") {
      toast({
        title: "Error",
        description: "Transaction failed.",
      });
    } else if (
      writeContractStatus === "success" &&
      transactionStatus === "pending"
    ) {
      toast({
        title: "Information",
        description: "Transaction is beeing processed.",
      });
    } else if (transactionStatus === "success") {
      toast({
        title: "Congratulations",
        description: "Transaction has succeeded!",
      });
      successCallback();
    }
  }, [transactionStatus, writeContractStatus]);

  return {
    isConnected: isConnected,
    isPending:
      transactionStatus === "pending" &&
      !["idle", "error"].includes(writeContractStatus),
    writeContract,
  };
}
