"use client";

import { useData } from "@/hooks/useData";
import React, { createContext } from "react";
import { Log } from "viem";

export type EventLog = Log & {
  eventName: string;
  args: {
    amount: bigint; // Make sure the amount is of type bigint to convert it to ether
    by: string;
  };
};

export interface DataType {
  data: {
    eventLogs: EventLog[] | undefined;
    eventLogsCount: number | undefined;
    walletAddress: `0x${string}` | undefined;
    // balance: bigint | undefined;
    // lol: number | undefined;
  };
  isConnected: boolean;
  refetchBalance: () => void;
}

export const DataContext = createContext<DataType>({
  data: {
    eventLogs: undefined,
    eventLogsCount: undefined,
    walletAddress: undefined,
    // balance: undefined,
    // lol: undefined,
  },
  isConnected: false,
  refetchBalance: () => undefined,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const data = useData();
  return (
    <DataContext.Provider value={{ ...data }}>{children}</DataContext.Provider>
  );
}
