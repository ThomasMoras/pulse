"use client";

import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { pulseContract } from "@/contracts/pulse.contract";
import { DataType, EventLog } from "@/contexts/data-provider";
import { useEffect, useState } from "react";

export function useData(): DataType {
  const { isConnected, address } = useAccount();
  const [eventLogs, setEventLogs] = useState<EventLog[] | undefined>(undefined);

  useWatchContractEvent({
    ...pulseContract,
    fromBlock: pulseContract.fromBlock,
    onLogs: (logs) => setEventLogs(logs as EventLog[]),
    eventName: "logs" as any, // Hack eventName because typescript is incorrect.
    poll: true,
    pollingInterval: 3000, // Polygon zkEVM block time.
  });

  const { data: balance, refetch: refetchBalance } = useReadContract({
    ...pulseContract,
    account: address,
    // functionName: "",
    // args: [address!],
  });

  //   useEffect(() => {
  //     console.log("balance");
  //     console.log(balance);
  //   }, [balance]);

  const lol = 666;

  const eventLogsCount = eventLogs?.length;

  return {
    data: {
      eventLogs: eventLogs,
      eventLogsCount,
      walletAddress: address,
      //   balance: balance,
      //   lol: lol,
    },
    isConnected: isConnected,
    refetchBalance,
  };
}
